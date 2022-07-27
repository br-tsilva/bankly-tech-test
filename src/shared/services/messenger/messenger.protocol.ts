/* eslint-disable @typescript-eslint/no-explicit-any */
export default interface IMessengerService {
  start(): Promise<void>
  publish(queue: string, message: string): Promise<void>
  consume(queue: string, callback: (message: any) => Promise<void>): Promise<void>
}
