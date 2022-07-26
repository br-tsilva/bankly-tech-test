import { Request, Response } from 'express'
import IAccountApi from '@shared/services/account-api/account-api.protocol'
import { RequestAdapter, LoggerAdapter } from '@shared/adapters'
import { AccountApiService, LoggerService } from '@shared/services'
import config from '@config'

export default class BanklyAccountController {
  private accountApi: IAccountApi

  constructor() {
    const banklyHost = String(config.get('bankly_host', 'localhost'))
    const banklyPort = String(config.get('bankly_port', '80'))

    const loggerAdapter = new LoggerAdapter()

    this.accountApi = new AccountApiService(
      `${banklyHost}:${banklyPort}`,
      new RequestAdapter(),
      new LoggerService(loggerAdapter),
    )

    return this
  }

  async getBalance(request: Request, response: Response) {
    const params = request.params

    const balanceResponse = await this.accountApi.getBalance(params.accountNumber)

    response.status(200).json(balanceResponse)
  }

  async transfer(request: Request, response: Response) {
    response.sendStatus(200)
  }

  async getTransferStatus(request: Request, response: Response) {
    response.sendStatus(200)
  }
}