import { default as IDatabaseService } from '@shared/services/database/database.protocol'
import { default as ILoggerService } from '@shared/services/logger/logger.protocol'
import { default as IMessengerService } from '@shared/services/messenger/messenger.protocol'
import { default as Exception } from '@shared/helpers/exception.helper'
import { TransactionsRepository } from '@infra/repositories'
import { TransactionContentQueue } from './transactions.protocol'
import { default as Operations } from '../operations/operations.case'
import { OperationsContentQueue } from '../operations/operations.protocol'

export default class Transactions {
  private static _transferQueueName = 'transfer-transactions'

  constructor(
    private databaseService: IDatabaseService,
    private messengerService: IMessengerService,
    private loggerService: ILoggerService,
  ) {}

  static get transferQueueName() {
    return Transactions._transferQueueName
  }

  async transfer(content: string, done: () => void): Promise<void> {
    const { transactionId }: TransactionContentQueue = JSON.parse(content)
    const databaseInstance = await this.databaseService.start()

    const transactionsRepository = new TransactionsRepository(databaseInstance)

    try {
      const transaction = await transactionsRepository.getTransactionById(transactionId)
      if (!transaction) {
        throw new Error(`Transaction N. ${transactionId} not found`)
      }

      const completedOperations = transaction.operations.filter((operation) => operation.status !== 'Pending')
      if (completedOperations.length === transaction.operations.length) {
        let status: 'Confirmed' | 'Error' = 'Confirmed'

        const errorOperation = completedOperations.some((operation) => operation.status === 'Error')
        if (errorOperation) {
          status = 'Error'
        }

        await transactionsRepository.updateTransactionStatus(transactionId, status)
        return
      }

      await transactionsRepository.updateTransactionStatus(transactionId, 'Processing')

      const operationsContent: OperationsContentQueue[] = transaction.operations.map((operation) => ({
        transactionId: transaction.id,
        operationId: operation.id,
      }))

      operationsContent.forEach((operation) => {
        this.messengerService.publish(Operations.updateBalanceQueueName, JSON.stringify(operation))
      })
    } catch (error) {
      if (error instanceof Exception || error instanceof Error) {
        await transactionsRepository.updateTransactionStatus(transactionId, 'Error', error.message)
      }
    } finally {
      done()
    }
  }
}
