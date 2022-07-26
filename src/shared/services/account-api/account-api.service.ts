import { default as IRequestAdapter } from '@shared/adapters/request-adapter/request.protocol'
import { default as ILoggerService } from '@shared/services/logger/logger.protocol'
import { default as IMessengerService } from '@shared/services/messenger/messenger.protocol'
import { FinancialOperationsRepository } from '@infra/repositories'
import { DatabaseService } from '@shared/services'
import { default as IAccountApi, TransferBalanceParam } from './account-api.protocol'
import { buildAccountBalancePayload } from './account-api.helper'
import { ExceptionHelper } from '@shared/helpers'
import { httpStatusCodes } from '@shared/adapters'

export default class AccountApiService implements IAccountApi {
  constructor(
    private serviceHost: string,
    private requestAdapter: IRequestAdapter,
    private messengerService: IMessengerService,
    private databaseService: DatabaseService,
    private loggerService: ILoggerService,
  ) {}

  async getBalance(accountNumber: string) {
    const response = await this.requestAdapter.get(`http://${this.serviceHost}/api/Account/${accountNumber}`)

    if (response.status >= 300) {
      const { traceId } = this.loggerService.log('ERROR', '', response.data || response.message)
      throw new ExceptionHelper('Error to get balance account', {
        statusCode: response.status,
        traceId,
      })
    }

    const buildedPayload = buildAccountBalancePayload(response.data)
    return buildedPayload
  }

  async transferBalance(payload: TransferBalanceParam) {
    const { fromAccountNumber, toAccountNumber } = payload

    if (fromAccountNumber === toAccountNumber) {
      throw new ExceptionHelper(`An operation cannot be carried out between the same account`, {
        statusCode: httpStatusCodes.CONFLICT,
      })
    }

    // const fromAccount = await this.getBalance(fromAccountNumber)
    // if (fromAccount.balance < value) {
    //   throw new ExceptionHelper(`Account N. ${fromAccountNumber} does not have enough balance for this transfer`, {
    //     statusCode: httpStatusCodes.NOT_ACCEPTABLE,
    //   })
    // }

    // await this.getBalance(toAccountNumber)

    await this.databaseService.start()

    const financialOperationsRepository = new FinancialOperationsRepository(this.databaseService.instance)
    const createdOperation = await financialOperationsRepository.createOperation({
      ...payload,
      operationType: 'Transfer',
    })

    await this.databaseService.close()

    await this.messengerService.publish('transfer-balance', JSON.stringify(createdOperation))

    return createdOperation
  }

  async getTransferBalanceStatus(operationId: string) {
    await this.databaseService.start()

    const financialOperationsRepository = new FinancialOperationsRepository(this.databaseService.instance)
    const foundOperation = await financialOperationsRepository.getOperationById(operationId)

    await this.databaseService.close()

    if (!foundOperation) {
      throw new ExceptionHelper(`No operation found with id ${operationId}`, {
        statusCode: httpStatusCodes.NOT_FOUND,
      })
    }

    return {
      status: foundOperation.status,
    }
  }
}
