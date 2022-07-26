import { default as IDatabaseService } from './database.protocol'
import { default as IDatabaseAdapter } from '@shared/adapters/database/database.protocol'
import { LoggerService } from '@shared/services'

export default class DatabaseService implements IDatabaseService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static _instance: IDatabaseAdapter['instance'] | void

  constructor(private databaseAdapter: IDatabaseAdapter, private loggerService: LoggerService) {}

  get instance() {
    return DatabaseService._instance
  }

  set instance(instance) {
    DatabaseService._instance = instance
  }

  async start() {
    if (!this.instance) {
      this.instance = await this.databaseAdapter.start()
    }
    this.loggerService.log('SUCCESS', 'A connection has been established to the database')
  }

  async close(): Promise<void> {
    if (this.instance) {
      this.instance = await this.databaseAdapter.close()
    }
    this.loggerService.log('SUCCESS', 'A connection has been closed to the database')
  }
}
