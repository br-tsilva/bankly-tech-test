import { default as connectOptions } from '@infra/rabbitmq/connect-options.rabbitmq'
import { default as IMessengerAdapter } from './messenger.protocol'
import { Connection, Channel, connect } from 'amqplib'

export default class RabbitmqServer implements IMessengerAdapter {
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
    if (!this.instance) {
      this.instance = await connect(connectOptions)
      this.channel = await this.instance.createChannel()
    }
  }

  async publish(queue: string, message: string) {
    await this.channel.assertQueue(queue, {
      durable: true,
    })

    await this.channel.sendToQueue(queue, Buffer.from(message))
  }

  async consume(queue: string, callback: (message: string) => Promise<void>) {
    await this.channel.assertQueue(queue, {
      durable: true,
    })

    await this.channel.consume(queue, (message) => {
      if (message) {
        callback(message.content.toString())
        this.channel.ack(message)
      }
    })
  }
}
