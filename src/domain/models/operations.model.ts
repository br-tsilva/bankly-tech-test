export type OperationType = 'Credit' | 'Debit'
export type OperationStatus = 'Pending' | 'Error' | 'Completed' | 'Refund'
import { ITransactions } from '.'

export default interface IOperations {
  id: string
  transactionId: string
  accountNumber: string
  type: OperationType
  status: OperationStatus
  transaction: Promise<ITransactions>
  createdAt: Date
  updatedAt: Date
}
