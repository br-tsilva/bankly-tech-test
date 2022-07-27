import { ITransactions, TransactionStatus } from '@domain/models'
import { default as ITransactionsRepository } from './transactions.protocol'
import { TransactionsModel } from '@infra/typeorm/models'
import { DataSource, Repository } from 'typeorm'

export default class TransactionsRepository implements ITransactionsRepository {
  private repository: Repository<TransactionsModel>

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(TransactionsModel)
  }

  async getTransactionById(id: string): Promise<ITransactions | undefined> {
    return this.repository.findOneBy({ id }).then((response) => response || undefined)
  }

  async createTransaction(body: Omit<ITransactions, 'id' | 'error' | 'operations' | 'createdAt' | 'updatedAt'>) {
    const createdTransaction = this.repository.create({
      value: body.value,
      status: body.status,
    })

    return this.repository.save(createdTransaction)
  }

  async updateTransactionStatus(id: string, status: TransactionStatus, error?: string) {
    const result = await this.repository.update(id, { status, ...(error && { error }) })
    return (result.affected || 0) > 0
  }
}
