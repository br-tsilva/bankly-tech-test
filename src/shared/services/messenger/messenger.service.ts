/* eslint-disable @typescript-eslint/no-explicit-any */
import { default as IMessengerService, IMessenger } from './messenger.protocol'
import { default as ILoggerService } from '../logger/logger.protocol'

export default class MessengerService implements IMessengerService {
  constructor(private messager: IMessenger, private loggerService: ILoggerService) {}

  async start() {
    await this.messager.start()
    this.loggerService.log('SUCCESS', 'A connection has been established to the messenger service')
  }

  async publish(queue: string, message: string) {
    await this.messager.publish(queue, message)
  }

  async consume(queue: string, callback: (message: any) => void) {
    await this.messager.consume(queue, callback)
  }
}
