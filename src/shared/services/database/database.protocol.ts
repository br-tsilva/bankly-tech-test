import { default as IDatabaseAdapter } from '@shared/adapters/database/database.protocol'

export default interface IDatabaseService {
  start(): Promise<IDatabaseAdapter['instance']>
  close(): Promise<void>
}
