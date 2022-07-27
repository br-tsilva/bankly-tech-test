import { default as IDatabaseAdapter } from '@shared/adapters/database/database.protocol'

export default interface IDatabaseService {
  get instance(): IDatabaseAdapter['instance']
  start(): Promise<void>
  close(): Promise<void>
}
