import { IOperations } from '.'

export type TransactionStatus = 'In Queue' | 'Processing' | 'Confirmed' | 'Error'

export default interface ITransactions {
  id: string
  status: TransactionStatus
  error: string
  value: number
  operations: IOperations[]
  createdAt: Date
  updatedAt: Date
}
