import { DataSource } from 'typeorm'

export default interface IDatabaseAdapter {
  get instance(): DataSource
  start(): Promise<DataSource>
  close(): Promise<void>
}
