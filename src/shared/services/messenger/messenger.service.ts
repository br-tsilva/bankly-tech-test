/* eslint-disable @typescript-eslint/no-explicit-any */
import { default as IMessengerService } from './messenger.protocol'
import { default as IMessengerAdapter } from '@shared/adapters/messenger/messenger.protocol'
import { default as ILoggerService } from '../logger/logger.protocol'

export default class MessengerService implements IMessengerService {
  constructor(private messagerAdapter: IMessengerAdapter, private loggerService: ILoggerService) {}

  async start() {
    await this.messagerAdapter.start()
    this.loggerService.log('SUCCESS', 'A connection has been established to the messenger service')
  }

  async publish(queue: string, message: string) {
    await this.messagerAdapter.publish(queue, message)
  }

  async consume(queue: string, callback: (message: any) => Promise<void>) {
    await this.messagerAdapter.consume(queue, callback)
  }
}
