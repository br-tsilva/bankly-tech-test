export default interface IMessengerAdapter {
  start(): Promise<void>
  publish(queue: string, message: string): Promise<void>
  consume(queue: string, callback: (message: string) => Promise<void>): Promise<void>
}
