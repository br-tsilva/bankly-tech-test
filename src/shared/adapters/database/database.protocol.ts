import { DataSource } from 'typeorm'

export default interface IDatabaseAdapter {
  get instance(): DataSource | void
  start(): Promise<DataSource>
  close(): Promise<void>
}
