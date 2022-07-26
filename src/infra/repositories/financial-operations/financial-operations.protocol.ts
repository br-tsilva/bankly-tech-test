import { IFinancialOperations } from '@domain/models'

export default interface IFinancialOperationsRepository {
  getOperationById(operationId: string): Promise<IFinancialOperations | undefined>
}
