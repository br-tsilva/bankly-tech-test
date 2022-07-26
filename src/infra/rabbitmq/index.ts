import connectOptions from './connect-options.rabbitmq'
import { IMessager } from '@shared/services/messager/messager.protocol'
import { Connection, Channel, connect, Message } from 'amqplib'

export default class RabbitmqServer implements IMessager {
  private static _instance: Connection

  private static _channel: Channel

  private get instance() {
    return RabbitmqServer._instance
  }

  private set instance(instance) {
    RabbitmqServer._instance = instance
  }

  private get channel() {
    return RabbitmqServer._channel
  }

  private set channel(channel) {
    RabbitmqServer._channel = channel
  }

  async start() {
    this.instance = await connect(connectOptions)
    this.channel = await this.instance.createChannel()
  }

  async publish(queue: string, message: string) {
    await this.channel.sendToQueue(queue, Buffer.from(message))
  }

  async consume(queue: string, callback: (message: Message) => void) {
    await this.channel.consume(queue, (message) => {
      if (message) {
        callback(message)
        this.channel.ack(message)
      }
    })
  }
}
