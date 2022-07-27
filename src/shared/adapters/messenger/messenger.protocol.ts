export default interface IMessengerAdapter {
  start(): Promise<void>
  publish(queue: string, message: string): Promise<void>
  consume(queue: string, callback: (message: string, done: () => void) => Promise<void>): Promise<void>
}
