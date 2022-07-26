import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { IFinancialOperations, TOperationStatus, TOperationType } from '@domain/models'
import * as uuid from 'uuid'

@Entity('financial-operations')
export default class FinancialOperationsModel implements IFinancialOperations {
  @PrimaryColumn({ type: 'uuid', default: uuid.v4, unique: true })
  readonly operationId!: string

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

  @UpdateDateColumn({ default: new Date(), update: true, nullable: false })
  readonly updatedAt!: Date

  @CreateDateColumn({ default: new Date(), update: false, nullable: false })
  readonly createdAt!: Date
}
