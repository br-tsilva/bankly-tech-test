import { Request, Response } from 'express'
import IAccountApi from '@shared/services/account-api/account-api.protocol'
import { RequestAdapter, LoggerAdapter, DatabaseAdapter, MessengerAdapter } from '@shared/adapters'
import { AccountApiService, LoggerService, DatabaseService, MessengerService } from '@shared/services'
import { default as config } from '@config'
import { buildTransferBalancePayload } from './bankly-account.helper'

export default class BanklyAccountController {
  private accountApi: IAccountApi

  constructor() {
    const banklyHost = String(config.get('bankly_host', 'localhost'))
    const banklyPort = String(config.get('bankly_port', '80'))

    const loggerAdapter = new LoggerAdapter()
    const databaseAdapter = new DatabaseAdapter()
    const messengerAdapter = new MessengerAdapter()

    const loggerService = new LoggerService(loggerAdapter)

    this.accountApi = new AccountApiService(
      `${banklyHost}:${banklyPort}`,
      new RequestAdapter(),
      new MessengerService(messengerAdapter, loggerService),
      new DatabaseService(databaseAdapter, loggerService),
      loggerService,
    )

    return this
  }

  async getBalance(request: Request, response: Response) {
    const params = request.params

    const balanceResponse = await this.accountApi.getBalance(params.accountNumber)

    response.status(200).json({
      status: 200,
      data: balanceResponse,
    })
  }

  async transfer(request: Request, response: Response) {
    const params = request.body

    const transferResponse = await this.accountApi.transferBalance(buildTransferBalancePayload(params))

    response.status(200).json({
      status: 200,
      data: transferResponse,
    })
  }

  async getTransferStatus(request: Request, response: Response) {
    const params = request.params

    const transferStatusResponse = await this.accountApi.getTransferBalanceStatus(params.operationId)

    response.status(200).json({
      status: 200,
      data: transferStatusResponse,
    })
  }
}
