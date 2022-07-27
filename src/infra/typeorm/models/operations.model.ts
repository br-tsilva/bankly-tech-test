import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { IOperations, OperationType, OperationStatus, ITransactions } from '@domain/models'
import { default as TransactionsModel } from './transactions.model'
import * as uuid from 'uuid'

@Entity('operations')
export default class OperationsModel implements IOperations {
  @PrimaryColumn({ type: 'uuid', unique: true })
  readonly id!: string

  @Column({ type: 'varchar', update: false, nullable: false })
  transactionId!: string

  @Column({ type: 'varchar', update: false, nullable: false })
  accountNumber!: string

  @Column({ type: 'varchar', update: false, nullable: false })
  type!: OperationType

  @Column({ type: 'varchar', update: true, nullable: false })
  status!: OperationStatus

  @ManyToOne(() => TransactionsModel, (transactions) => transactions.operations, { lazy: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'transactionId' })
  transaction!: Promise<ITransactions>

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
