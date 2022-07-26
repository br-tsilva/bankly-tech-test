import { Options } from 'amqplib'
import config from '@config'

export default <Options.Connect>{
  protocol: 'amqp',
  hostname: String(config.get('rabbitmq_host', 'localhost')),
  port: Number(config.get('rabbitmq_amqp_port', '5672')),
  username: String(config.get('rabbitmq_username', '')),
  password: String(config.get('rabbitmq_password', '')),
}
