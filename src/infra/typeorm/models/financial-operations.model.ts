import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { IFinancialOperations, TOperationStatus, TOperationType } from '@domain/models'
import * as uuid from 'uuid'

@Entity('financial-operations')
export default class FinancialOperationsModel implements IFinancialOperations {
  @PrimaryColumn({ type: 'uuid', unique: true })
  readonly id!: string

  @Column({ type: 'varchar', update: false, nullable: false })
  operationType!: TOperationType

  @Column({ type: 'varchar', update: false, nullable: false })
  fromAccountNumber!: string

  @Column({ type: 'varchar', update: false, nullable: false })
  toAccountNumber!: string

  @Column({ type: 'float', update: false, nullable: false })
  value!: number

  @Column({ type: 'varchar', update: true, nullable: false })
  status!: TOperationStatus

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
