/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IMessenger {
  start(): Promise<void>
  publish(queue: string, message: string): Promise<void>
  consume(queue: string, callback: (message: any) => void): Promise<void>
}

export default interface IMessengerService {
  start(): Promise<void>
  publish(queue: string, message: string): Promise<void>
  consume(queue: string, callback: (message: any) => void): Promise<void>
}
