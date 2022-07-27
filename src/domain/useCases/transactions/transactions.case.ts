import { default as IDatabaseService } from '@shared/services/database/database.protocol'
import { default as ILoggerService } from '@shared/services/logger/logger.protocol'
import { default as IMessengerService } from '@shared/services/messenger/messenger.protocol'
import { default as Exception } from '@shared/helpers/exception.helper'
import { TransactionsRepository, OperationsRepository } from '@infra/repositories'
import { TransactionContentQueue } from './transactions.protocol'
import { default as Operations } from '../operations/operations.case'
import { OperationsContentQueue } from '../operations/operations.protocol'
import { IOperations } from '@domain/models'

export default class Transactions {
  private static _updateStatusQueue = 'transfers-update-status'

  constructor(
    private databaseService: IDatabaseService,
    private messengerService: IMessengerService,
    private loggerService: ILoggerService,
  ) {}

  static get updateStatusQueue() {
    return Transactions._updateStatusQueue
  }

  async updateStatus(content: string): Promise<void> {
    const { transactionId }: TransactionContentQueue = JSON.parse(content)

    const transactionsRepository = new TransactionsRepository(this.databaseService.instance)
    const operationsRepository = new OperationsRepository(this.databaseService.instance)

    try {
      const transaction = await transactionsRepository.getTransactionById(transactionId)
      if (!transaction) {
        throw new Error(`Transaction N. ${transactionId} not found`)
      }

      const [inQueueOperations, pendingOperations] = transaction.operations.reduce(
        ([_inQueueOperations, _pendingOperations], operation) => {
          if (operation.status === 'Pending') {
            _pendingOperations.push(operation)
          }
          if (operation.status === 'In Queue') {
            _inQueueOperations.push(operation)
          }

          return [_inQueueOperations, _pendingOperations]
        },
        <IOperations[][]>[[], []],
      )

      if (pendingOperations.length) {
        await transactionsRepository.updateTransactionStatus(transactionId, 'Processing')
        this.loggerService.log('SUCCESS', `Transaction N. ${transactionId} has been updated to "Processing" status`, {
          transactionId,
        })

        const operationsContent: OperationsContentQueue[] = pendingOperations.map((operation) => ({
          transactionId: transaction.id,
          operationId: operation.id,
        }))

        this.loggerService.log('SUCCESS', `Operations referring to transaction N. ${transactionId} has been builded`, {
          operationsContent,
        })

        for (const operation of operationsContent) {
          await operationsRepository.updateOperationStatus(operation.operationId, 'In Queue')
          this.loggerService.log(
            'SUCCESS',
            `Operation N. ${operation.operationId} has been updated to "In Queue" status`,
            {
              operation,
            },
          )

          this.messengerService.publish(Operations.updateBalanceQueue, JSON.stringify(operation))
        }
        return
      }

      if (inQueueOperations.length) {
        return
      }

      const hasSomeErrorOperation = transaction.operations.some((operation) =>
        ['Error', 'Refund'].includes(operation.status),
      )

      let status: 'Confirmed' | 'Error' = 'Confirmed'
      if (hasSomeErrorOperation) {
        status = 'Error'
      }

      await transactionsRepository.updateTransactionStatus(transactionId, status)
      this.loggerService.log('SUCCESS', `Transaction N. ${transactionId} has been updated to "${status}" status`, {
        transaction,
      })
    } catch (error) {
      if (error instanceof Exception || error instanceof Error) {
        const { message } = this.loggerService.log('ERROR', error.message, {
          transactionId,
        })

        await transactionsRepository.updateTransactionStatus(transactionId, 'Error', message)
        this.loggerService.log('SUCCESS', `Transaction N. ${transactionId} has been updated to "Error" status`, {
          transactionId,
        })
      }
    }
  }
}
