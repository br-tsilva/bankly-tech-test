import { DataSourceOptions } from 'typeorm'
import config from '@config'

export default <DataSourceOptions>{
  type: 'mysql',
  host: String(config.get('db_host', '')),
  port: Number(config.get('db_port', '3306')),
  username: String(config.get('db_username', '')),
  password: String(config.get('db_password', '')),
  database: String(config.get('db_name', '')),
  connectTimeout: Number(config.get('db_connect_timeout_in_ms', '5000')),
}
