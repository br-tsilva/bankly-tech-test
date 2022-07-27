export type AccountBalance = {
  accountNumber: string
  balance: number
}

export type UpdateBalanceParam = {
  accountNumber: string
  value: number
  type: 'Credit' | 'Debit'
}

export type TransactionCreatorParam = {
  accountOrigin: string
  accountDestination: string
  value: number
}

export default interface IAccountApi {
  getBalance(accountNumber: string): Promise<AccountBalance>
  updateBalance(params: UpdateBalanceParam): Promise<AccountBalance>
  createTransaction(params: TransactionCreatorParam): Promise<{ transactionId: string }>
  getTransactionStatus(transactionId: string): Promise<{ status: string; error: string }>
}
