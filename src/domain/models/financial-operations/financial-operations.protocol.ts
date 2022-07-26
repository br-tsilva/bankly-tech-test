export type TOperationType = 'Transfer'

export type TOperationStatus = 'In Queue' | 'Processing' | 'Confirmed' | 'Error'

export default interface IFinancialOperations {
  id: string
  operationType: TOperationType
  fromAccountNumber: string
  toAccountNumber: string
  value: number
  status: TOperationStatus
  createdAt: Date
  updatedAt: Date
}
