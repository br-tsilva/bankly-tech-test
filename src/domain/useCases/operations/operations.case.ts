import { default as IDatabaseService } from '@shared/services/database/database.protocol'
import { default as ILoggerService } from '@shared/services/logger/logger.protocol'
import { default as IAccountApiService } from '@shared/services/account-api/account-api.protocol'
import { default as IMessengerService } from '@shared/services/messenger/messenger.protocol'
import { default as Exception } from '@shared/helpers/exception.helper'
import { OperationsRepository, TransactionsRepository } from '@infra/repositories'
import { OperationsContentQueue, RefundContentQueue } from '../operations/operations.protocol'
import { Transactions } from '../'

export default class Operations {
  private static _updateBalanceQueueName = 'update-balance-operations'

  private static _refundBalanceQueueName = 'refund-balance-operations'

  constructor(
    private databaseService: IDatabaseService,
    private messengerService: IMessengerService,
    private loggerService: ILoggerService,
    private accountApiService: IAccountApiService,
  ) {}

  static get updateBalanceQueueName() {
    return Operations._updateBalanceQueueName
  }

  static get refundBalanceQueueName() {
    return Operations._refundBalanceQueueName
  }

  async updateBalance(content: string, done: () => void): Promise<void> {
    const { transactionId, operationId }: OperationsContentQueue = JSON.parse(content)
    const databaseInstance = await this.databaseService.start()

    const transactionsRepository = new TransactionsRepository(databaseInstance)
    const operationsRepository = new OperationsRepository(databaseInstance)

    try {
      const transaction = await transactionsRepository.getTransactionById(transactionId)
      if (!transaction) {
        throw new Error(`Transaction N. ${transactionId} not found`)
      }

      const operationAccount = transaction.operations.find((operation) => operation.id === operationId)
      if (!operationAccount) {
        throw new Error(`Operation N. ${operationId} was not found in transaction n. ${transactionId}`)
      }

      if (transaction.status === 'Error' && operationAccount.status === 'Pending') {
        await operationsRepository.updateOperationStatus(operationId, 'Refund')
        return
      }

      const account = await this.accountApiService.getBalance(operationAccount.accountNumber)
      if (operationAccount.type === 'Debit' && transaction.value > account.balance) {
        throw new Error(
          `Account N. ${operationAccount.accountNumber} does not have sufficient balance for this operation`,
        )
      }

      await operationsRepository.updateOperationStatus(operationId, 'Completed')
      await this.accountApiService.updateBalance({
        accountNumber: operationAccount.accountNumber,
        type: operationAccount.type,
        value: transaction.value,
      })
    } catch (error) {
      if (error instanceof Exception || error instanceof Error) {
        await transactionsRepository.updateTransactionStatus(transactionId, 'Error', error.message)

        const payload: RefundContentQueue = { transactionId }
        this.messengerService.publish(Operations.refundBalanceQueueName, JSON.stringify(payload))
      }
    } finally {
      this.messengerService.publish(Transactions.transferQueueName, JSON.stringify({ transactionId }))
      done()
    }
  }

  async refundBalance(content: string, done: () => void): Promise<void> {
    const { transactionId }: RefundContentQueue = JSON.parse(content)
    const databaseInstance = await this.databaseService.start()

    const transactionsRepository = new TransactionsRepository(databaseInstance)
    const operationsRepository = new OperationsRepository(databaseInstance)

    try {
      const transaction = await transactionsRepository.getTransactionById(transactionId)
      if (!transaction) {
        throw new Error(`Transaction N. ${transactionId} not found`)
      }

      for (const operation of transaction.operations) {
        try {
          const reverseOperationType = operation.type === 'Credit' ? 'Debit' : 'Credit'

          await operationsRepository.updateOperationStatus(operation.id, 'Refund')
          await this.accountApiService.updateBalance({
            accountNumber: operation.accountNumber,
            type: reverseOperationType,
            value: transaction.value,
          })
        } catch (error) {
          if (error instanceof Exception || error instanceof Error) {
            await operationsRepository.updateOperationStatus(operation.id, 'Error')
          }
        }
      }

      done()
    } catch (error) {
      if (error instanceof Exception || error instanceof Error) {
        await transactionsRepository.updateTransactionStatus(transactionId, 'Error', error.message)
      }
    } finally {
      this.messengerService.publish(Transactions.transferQueueName, JSON.stringify({ transactionId }))
    }
  }
}
