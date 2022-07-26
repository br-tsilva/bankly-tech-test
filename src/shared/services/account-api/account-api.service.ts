import { default as IRequestAdapter } from '@shared/adapters/request-adapter/request.protocol'
import { default as ILoggerService } from '@shared/services/logger/logger.protocol'
import { default as IMessengerService } from '@shared/services/messenger/messenger.protocol'
// import { default as IDatabaseService } from '@shared/adapter/'
import { default as IAccountApi, TransferBalanceParam } from './account-api.protocol'
import { buildAccountBalancePayload, buildTransferBalancePayload } from './account-api.helper'
import { ExceptionHelper } from '@shared/helpers'
import { httpStatusCodes } from '@shared/adapters'

export default class AccountApiService implements IAccountApi {
  constructor(
    private serviceHost: string,
    private requestAdapter: IRequestAdapter,
    private messengerService: IMessengerService,
    // private databaseService:
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

  async transferBalance({ fromAccountNumber, toAccountNumber, value }: TransferBalanceParam) {
    const fromAccount = await this.getBalance(fromAccountNumber)
    if (fromAccount.balance < value) {
      throw new ExceptionHelper(`Account N. ${fromAccountNumber} does not have enough balance for this transfer`, {
        statusCode: httpStatusCodes.NOT_ACCEPTABLE,
      })
    }

    await this.getBalance(toAccountNumber)

    const payload = buildTransferBalancePayload(fromAccountNumber, toAccountNumber, value)
    await this.messengerService.publish('transfer-balance', JSON.stringify(payload))

    return {
      fromAccountNumber: '',
      toAccountNumber: '',
      value: 0,
      operationId: '',
      status: '',
    }
  }

  async getTransferBalanceStatus(operationId: string) {
    console.log(operationId)
    return {
      fromAccountNumber: '',
      toAccountNumber: '',
      value: 0,
      operationId: '',
      status: '',
    }
  }
}
