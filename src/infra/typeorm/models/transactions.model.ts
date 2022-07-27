import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { ITransactions, TransactionStatus, IOperations } from '@domain/models'
import { default as OperationsModel } from './operations.model'
import * as uuid from 'uuid'

@Entity('transactions')
export default class TransactionsModel implements ITransactions {
  @PrimaryColumn({ type: 'uuid', unique: true })
  readonly id!: string

  @Column({ type: 'varchar', update: true, nullable: false })
  status!: TransactionStatus

  @Column({ type: 'varchar', update: true, nullable: true })
  error!: string

  @Column({ type: 'float', update: false, nullable: false })
  value!: number

  @OneToMany(() => OperationsModel, (operations) => operations.transaction, { eager: true, cascade: true })
  operations!: IOperations[]

  @UpdateDateColumn({ update: true, nullable: false })
  readonly updatedAt!: Date

  @CreateDateColumn({ update: false, nullable: false })
  readonly createdAt!: Date

  constructor() {
    if (!this.id) {
      this.id = uuid.v4()
    }
  }
}
