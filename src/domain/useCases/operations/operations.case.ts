import { default as IDatabaseService } from '@shared/services/database/database.protocol'
import { default as ILoggerService } from '@shared/services/logger/logger.protocol'
import { default as IAccountApiService } from '@shared/services/account-api/account-api.protocol'
import { default as IMessengerService } from '@shared/services/messenger/messenger.protocol'
import { default as Exception } from '@shared/helpers/exception.helper'
import { OperationsRepository, TransactionsRepository } from '@infra/repositories'
import { OperationsContentQueue, RefundContentQueue } from '../operations/operations.protocol'
import { Transactions } from '../'

export default class Operations {
  private static _updateBalanceQueue = 'operations-update-balance'

  private static _refundBalanceQueue = 'operations-refund-balance'

  constructor(
    private databaseService: IDatabaseService,
    private messengerService: IMessengerService,
    private loggerService: ILoggerService,
    private accountApiService: IAccountApiService,
  ) {}

  static get updateBalanceQueue() {
    return Operations._updateBalanceQueue
  }

  static get refundBalanceQueue() {
    return Operations._refundBalanceQueue
  }

  async updateBalance(content: string): Promise<void> {
    const { transactionId, operationId }: OperationsContentQueue = JSON.parse(content)

    const transactionsRepository = new TransactionsRepository(this.databaseService.instance)
    const operationsRepository = new OperationsRepository(this.databaseService.instance)

    try {
      const transaction = await transactionsRepository.getTransactionById(transactionId)
      if (!transaction) {
        throw new Error(`Transaction N. ${transactionId} not found`)
      }

      const operationAccount = transaction.operations.find((operation) => operation.id === operationId)
      if (!operationAccount) {
        throw new Error(`Operation N. ${operationId} was not found in transaction N. ${transactionId}`)
      }

      const account = await this.accountApiService.getBalance(operationAccount.accountNumber)
      if (operationAccount.type === 'Debit' && transaction.value > account.balance) {
        throw new Error(
          `Account N. ${operationAccount.accountNumber} does not have sufficient balance for this operation`,
        )
      }

      await this.accountApiService.updateBalance({
        accountNumber: operationAccount.accountNumber,
        type: operationAccount.type,
        value: transaction.value,
      })
      this.loggerService.log('SUCCESS', `Account N. ${operationAccount.accountNumber} has been balance updated`, {
        operationAccount,
        transaction,
      })
      await operationsRepository.updateOperationStatus(operationId, 'Completed')
      this.loggerService.log('SUCCESS', `Operation N. ${operationId} has been updated to "Completed" status`, {
        operationId,
      })
    } catch (error) {
      if (error instanceof Exception || error instanceof Error) {
        const { message } = this.loggerService.log('ERROR', error.message, { transactionId, operationId })

        await operationsRepository.updateOperationStatus(operationId, 'Error')
        this.loggerService.log('SUCCESS', `Operation N. ${operationId} has been updated to "Error" status`, {
          operationId,
        })

        await transactionsRepository.updateTransactionStatus(transactionId, 'Error', message)
        this.loggerService.log('SUCCESS', `Transaction N. ${transactionId} has been updated to "Error" status`, {
          transactionId,
        })
      }
    } finally {
      const payload: RefundContentQueue = { transactionId }
      this.messengerService.publish(Operations.refundBalanceQueue, JSON.stringify(payload))
    }
  }

  async refundBalance(content: string): Promise<void> {
    const { transactionId }: RefundContentQueue = JSON.parse(content)

    const transactionsRepository = new TransactionsRepository(this.databaseService.instance)
    const operationsRepository = new OperationsRepository(this.databaseService.instance)

    try {
      const transaction = await transactionsRepository.getTransactionById(transactionId)
      if (!transaction) {
        throw new Error(`Transaction N. ${transactionId} not found`)
      }

      const hasSomeErrorOperation = transaction.operations.some((operation) => operation.status === 'Error')
      if (hasSomeErrorOperation) {
        const completedOperations = transaction.operations.filter((operation) =>
          ['Completed'].includes(operation.status),
        )
        for (const operation of completedOperations) {
          try {
            const reverseOperationType = operation.type === 'Credit' ? 'Debit' : 'Credit'

            await this.accountApiService.updateBalance({
              accountNumber: operation.accountNumber,
              type: reverseOperationType,
              value: transaction.value,
            })
            this.loggerService.log('SUCCESS', `Account N. ${operation.accountNumber} has been balance updated`, {
              operation,
            })

            await operationsRepository.updateOperationStatus(operation.id, 'Refund')
            this.loggerService.log('SUCCESS', `Operation N. ${operation.id} has been updated to "Refund" status`, {
              operationId: operation.id,
            })
          } catch (error) {
            if (error instanceof Exception || error instanceof Error) {
              this.loggerService.log('ERROR', error.message, { operationId: operation.id })

              await operationsRepository.updateOperationStatus(operation.id, 'Error')
              this.loggerService.log('SUCCESS', `Operation N. ${operation.id} has been updated to "Error" status`, {
                operationId: operation.id,
              })
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Exception || error instanceof Error) {
        const { message } = this.loggerService.log('ERROR', error.message, { transactionId })

        await transactionsRepository.updateTransactionStatus(transactionId, 'Error', message)
        this.loggerService.log('SUCCESS', `Transaction N. ${transactionId} has been updated to "Error" status`, {
          transactionId,
        })
      }
    } finally {
      await this.messengerService.publish(Transactions.updateStatusQueue, JSON.stringify({ transactionId }))
    }
  }
}
