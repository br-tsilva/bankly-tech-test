import { default as dataSource } from '@infra/typeorm/ormconfig.typeorm'
import { default as IDatabaseAdapter } from './database.protocol'
import { DataSource } from 'typeorm'

export default class DatabaseAdapter implements IDatabaseAdapter {
  private static _instance: DataSource

  public get instance() {
    return DatabaseAdapter._instance
  }

  public set instance(instance) {
    DatabaseAdapter._instance = instance
  }

  async start() {
    if (!this.instance || !this.instance.isInitialized) {
      this.instance = await dataSource.initialize()
    }
    return this.instance
  }

  async close() {
    if (this.instance?.isInitialized) {
      await dataSource.destroy()
    }
  }
}
