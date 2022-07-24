import IRequestAdapter from '@shared/adapters/request-adapter/request.protocol'
import ILoggerService from '../logger/logger.protocol'
import IAccountApi, { TransferBalanceParam } from './account-api.protocol'
import { buildAccountBalancePayload, buildTransferBalancePayload } from './account-api.helper'
import { ExceptionHelper } from '@shared/helpers'

export default class AccountApiService implements IAccountApi {
  constructor(
    private serviceHost: string,
    private requestAdapter: IRequestAdapter,
    private loggerService: ILoggerService,
  ) {}

  async getBalance(accountNumber: string) {
    const response = await this.requestAdapter.get(`http://${this.serviceHost}/api/Account/${accountNumber}`)
    if (response.status >= 300) {
      if (response.status === 404) {
        throw new ExceptionHelper(`Account N. ${accountNumber} not found`)
      }

      const { traceId } = this.loggerService.log('ERROR', '', response.data || response.message)
      throw new ExceptionHelper('Error to get balance account', traceId)
    }

    const buildedPayload = buildAccountBalancePayload(response.data)
    return buildedPayload
  }

  async transferBalance({ fromAccountNumber, toAccountNumber, value }: TransferBalanceParam) {
    const fromAccount = await this.getBalance(fromAccountNumber)
    if (fromAccount.balance < value) {
      throw new ExceptionHelper(`Account N. ${fromAccountNumber} does not have enough balance for this transfer`)
    }

    await this.getBalance(toAccountNumber)

    const payload = buildTransferBalancePayload(fromAccountNumber, toAccountNumber, value)
    console.log(payload)

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
