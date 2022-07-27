import { IOperations, OperationStatus } from '@domain/models'
import { default as IOperationsRepository } from './operations.protocol'
import { OperationsModel } from '@infra/typeorm/models'
import { DataSource, Repository } from 'typeorm'

export default class OperationsRepository implements IOperationsRepository {
  private repository: Repository<OperationsModel>

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(OperationsModel)
  }

  async getOperationById(id: string): Promise<IOperations | undefined> {
    return this.repository.findOneBy({ id }).then((response) => response || undefined)
  }

  async getOperationsByTransactionId(transactionId: string): Promise<IOperations[]> {
    return this.repository.find({ where: { transactionId } })
  }

  async createOperation(body: Omit<IOperations, 'id' | 'transaction' | 'createdAt' | 'updatedAt'>) {
    const createdOperation = this.repository.create({
      transactionId: body.transactionId,
      accountNumber: body.accountNumber,
      type: body.type,
      status: body.status,
    })

    return this.repository.save(createdOperation)
  }

  async updateOperationStatus(id: string, status: OperationStatus) {
    const result = await this.repository.update(id, { status })
    return (result.affected || 0) > 0
  }
}
