import connectOptions from './connect-options.typeorm'
import path from 'path'
import { DataSource } from 'typeorm'

export default new DataSource({
  ...connectOptions,
  synchronize: false,
  logging: false,
  entities: [path.resolve(__dirname, 'models', '**', '*.{js,ts}')],
  migrations: [path.resolve(__dirname, 'migrations', '**', '*.{js,ts}')],
})
