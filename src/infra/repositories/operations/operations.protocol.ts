import { IOperations, OperationStatus } from '@domain/models'

export default interface IOperationsRepository {
  getOperationById(id: string): Promise<IOperations | undefined>
  getOperationsByTransactionId(transactionId: string): Promise<IOperations[]>
  createOperation(body: Omit<IOperations, 'id' | 'transaction' | 'createdAt' | 'updatedAt'>): Promise<IOperations>
  updateOperationStatus(id: string, status: OperationStatus): Promise<boolean>
}
