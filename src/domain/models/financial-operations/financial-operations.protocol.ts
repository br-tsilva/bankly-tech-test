export type TOperationType = ''

export type TOperationStatus = 'In Queue' | 'Processing' | 'Confirmed' | 'Error'

export default interface IFinancialOperations {
  operationId: string
  operationType: TOperationType
  fromAccountNumber: string
  toAccountNumber: string
  value: number
  status: TOperationStatus
  createdAt: Date
  updatedAt: Date
}
