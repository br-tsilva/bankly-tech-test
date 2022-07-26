import { IFinancialOperations } from '@domain/models'
import { default as IFinancialOperationsRepository } from './financial-operations.protocol'
import { FinancialOperationsModel } from '@infra/typeorm/models'
import { DataSource, Repository } from 'typeorm'

export default class FinancialOperationsRepository implements IFinancialOperationsRepository {
  private repository: Repository<FinancialOperationsModel>

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(FinancialOperationsModel)
  }

  async getOperationById(operationId: string): Promise<IFinancialOperations | undefined> {
    return this.repository.findOneBy({ id: operationId }).then((response) => {
      if (!response) {
        return undefined
      }

      return response
    })
  }

  async createOperation(body: Omit<IFinancialOperations, 'id' | 'status' | 'createdAt' | 'updatedAt'>) {
    const createdOperation = this.repository.create({
      fromAccountNumber: body.fromAccountNumber,
      toAccountNumber: body.toAccountNumber,
      operationType: body.operationType,
      value: body.value,
      status: 'In Queue',
    })

    return this.repository.save(createdOperation)
  }
}
