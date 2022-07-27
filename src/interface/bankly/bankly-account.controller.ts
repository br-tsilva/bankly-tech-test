import { Request, Response } from 'express'
import IAccountApi from '@shared/services/account-api/account-api.protocol'
import { RequestAdapter, LoggerAdapter, DatabaseAdapter, MessengerAdapter } from '@shared/adapters'
import { AccountApiService, LoggerService, DatabaseService, MessengerService } from '@shared/services'
import { buildTransactionCreatorPayload } from './bankly-account.helper'

export default class BanklyAccountController {
  private accountApi: IAccountApi

  constructor() {
    const loggerAdapter = new LoggerAdapter()
    const databaseAdapter = new DatabaseAdapter()
    const messengerAdapter = new MessengerAdapter()

    const loggerService = new LoggerService(loggerAdapter)

    this.accountApi = new AccountApiService(
      new RequestAdapter(),
      new MessengerService(messengerAdapter, loggerService),
      new DatabaseService(databaseAdapter, loggerService),
      loggerService,
    )

    return this
  }

  async getAccounts(request: Request, response: Response) {
    const accountsResponse = await this.accountApi.getAccounts()

    response.status(200).json({
      status: 200,
      data: accountsResponse,
    })
  }

  async getBalance(request: Request, response: Response) {
    const params = request.params

    const balanceResponse = await this.accountApi.getBalance(params.accountNumber)

    response.status(200).json({
      status: 200,
      data: balanceResponse,
    })
  }

  async createTransaction(request: Request, response: Response) {
    const params = request.body

    const transactionResponse = await this.accountApi.createTransaction(buildTransactionCreatorPayload(params))

    response.status(200).json({
      status: 200,
      data: transactionResponse,
    })
  }

  async getTransactionStatus(request: Request, response: Response) {
    const params = request.params

    const transactionStatusResponse = await this.accountApi.getTransactionStatus(params.transactionId)

    response.status(200).json({
      status: 200,
      data: transactionStatusResponse,
    })
  }
}
