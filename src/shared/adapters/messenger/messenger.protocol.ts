import { Message } from 'amqplib'

export default interface IMessengerAdapter {
  start(): Promise<void>
  publish(queue: string, message: string): Promise<void>
  consume(queue: string, callback: (message: Message) => void): Promise<void>
}
