import { default as IRequestAdapter } from '@shared/adapters/request-adapter/request.protocol'
import { default as ILoggerService } from '@shared/services/logger/logger.protocol'
import { default as IMessengerService } from '@shared/services/messenger/messenger.protocol'
import { default as IDatabaseService } from '@shared/services/database/database.protocol'
import { TransactionsRepository, OperationsRepository } from '@infra/repositories'
import {
  default as IAccountApi,
  AccountBalance,
  TransferBalanceParam,
  UpdateBalanceParam,
} from './account-api.protocol'
import { buildAccountBalancePayload } from './account-api.helper'
import { ExceptionHelper } from '@shared/helpers'
import { httpStatusCodes } from '@shared/adapters'
import { Transactions } from '@domain/useCases'
import { default as config } from '@config'
export default class AccountApiService implements IAccountApi {
  private serviceHost: string

  constructor(
    private requestAdapter: IRequestAdapter,
    private messengerService: IMessengerService,
    private databaseService: IDatabaseService,
    private loggerService: ILoggerService,
  ) {
    const serviceHost = config.get('bankly_host')
    const servicePort = config.get('bankly_port')
    if (!serviceHost || !servicePort) {
      throw new Error('No bankly service host or port configured')
    }

    this.serviceHost = `${serviceHost}:${servicePort}`
  }

  async getBalance(accountNumber: string) {
    const response = await this.requestAdapter.get(`http://${this.serviceHost}/api/Account/${accountNumber}`)

    if (response.status >= 300) {
      const errorMessage = `Error to get balance from account n. ${accountNumber}`
      const { traceId } = this.loggerService.log('ERROR', errorMessage, response.data)

      throw new ExceptionHelper(errorMessage, {
        statusCode: response.status,
        traceId,
      })
    }

    const buildedPayload = buildAccountBalancePayload(response.data)
    return buildedPayload
  }

  async updateBalance(params: UpdateBalanceParam): Promise<AccountBalance> {
    const response = await this.requestAdapter.post(`http://${this.serviceHost}/api/Account`, params)

    if (response.status >= 300) {
      const errorMessage = `Error to update balance to the account n. ${params.accountNumber}`
      const { traceId } = this.loggerService.log('ERROR', errorMessage, response.data)

      throw new ExceptionHelper(errorMessage, {
        statusCode: response.status,
        traceId,
      })
    }

    return this.getBalance(params.accountNumber)
  }

  async transferBalance(params: TransferBalanceParam) {
    const { accountOrigin, accountDestination } = params

    if (accountOrigin === accountDestination) {
      throw new ExceptionHelper(`An operation cannot be carried out between the same account`, {
        statusCode: httpStatusCodes.CONFLICT,
      })
    }

    const databaseInstance = await this.databaseService.start()

    const transactionsRepository = new TransactionsRepository(databaseInstance)
    const operationsRepository = new OperationsRepository(databaseInstance)

    const createdTransaction = await transactionsRepository.createTransaction({
      value: params.value,
      status: 'In Queue',
    })
    await Promise.all([
      operationsRepository.createOperation({
        transactionId: createdTransaction.id,
        accountNumber: accountOrigin,
        status: 'Pending',
        type: 'Debit',
      }),
      operationsRepository.createOperation({
        transactionId: createdTransaction.id,
        accountNumber: accountDestination,
        status: 'Pending',
        type: 'Credit',
      }),
    ])

    const payload = { transactionId: createdTransaction.id }

    await this.messengerService.publish(Transactions.transferQueueName, JSON.stringify(payload))

    return payload
  }

  async getTransferBalanceStatus(transactionId: string) {
    const databaseInstance = await this.databaseService.start()

    const operationsRepository = new TransactionsRepository(databaseInstance)
    const transaction = await operationsRepository.getTransactionById(transactionId)

    if (!transaction) {
      throw new ExceptionHelper(`No transaction found with id ${transactionId}`, {
        statusCode: httpStatusCodes.NOT_FOUND,
      })
    }

    return {
      status: transaction.status,
      error: transaction.error,
    }
  }
}
