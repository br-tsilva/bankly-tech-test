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

  async updateBalance(content: string, done: () => void): Promise<void> {
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
        throw new Error(`Operation N. ${operationId} was not found in transaction n. ${transactionId}`)
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
      await operationsRepository.updateOperationStatus(operationId, 'Completed')
    } catch (error) {
      if (error instanceof Exception || error instanceof Error) {
        await operationsRepository.updateOperationStatus(operationId, 'Error')
        await transactionsRepository.updateTransactionStatus(transactionId, 'Error', error.message)
      }
    } finally {
      const payload: RefundContentQueue = { transactionId }
      this.messengerService.publish(Operations.refundBalanceQueue, JSON.stringify(payload))
      done()
    }
  }

  async refundBalance(content: string, done: () => void): Promise<void> {
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

            await operationsRepository.updateOperationStatus(operation.id, 'Refund')
          } catch (error) {
            if (error instanceof Exception || error instanceof Error) {
              await operationsRepository.updateOperationStatus(operation.id, 'Error')
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Exception || error instanceof Error) {
        await transactionsRepository.updateTransactionStatus(transactionId, 'Error', error.message)
      }
    } finally {
      this.messengerService.publish(Transactions.updateStatusQueue, JSON.stringify({ transactionId }))
      done()
    }
  }
}
