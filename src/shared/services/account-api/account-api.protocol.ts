export type AccountBalance = {
  accountId: number
  accountNumber: string
  balance: number
}

export type TransferBalanceParam = {
  fromAccountNumber: string
  toAccountNumber: string
  value: number
}

export type TransferBalanceStatus = {
  status: string
}

export default interface IAccountApi {
  getBalance(accountNumber: string): Promise<AccountBalance>
  transferBalance(params: TransferBalanceParam): Promise<TransferBalanceStatus & TransferBalanceParam>
  getTransferBalanceStatus(operationId: string): Promise<TransferBalanceStatus>
}
