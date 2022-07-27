import { ITransactions, TransactionStatus } from '@domain/models'

export default interface ITransactionsRepository {
  getTransactionById(id: string): Promise<ITransactions | undefined>
  createTransaction(
    body: Omit<ITransactions, 'id' | 'error' | 'operations' | 'createdAt' | 'updatedAt'>,
  ): Promise<ITransactions>
  updateTransactionStatus(id: string, status: TransactionStatus, error?: string): Promise<boolean>
}
