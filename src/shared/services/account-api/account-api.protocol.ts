export type AccountBalance = {
  accountNumber: string
  balance: number
}

export type UpdateBalanceParam = {
  accountNumber: string
  value: number
  type: 'Credit' | 'Debit'
}

export type TransferBalanceParam = {
  accountOrigin: string
  accountDestination: string
  value: number
}

export default interface IAccountApi {
  getBalance(accountNumber: string): Promise<AccountBalance>
  updateBalance(params: UpdateBalanceParam): Promise<AccountBalance>
  transferBalance(params: TransferBalanceParam): Promise<{ transactionId: string }>
  getTransferBalanceStatus(operationId: string): Promise<{ status: string; error: string }>
}
