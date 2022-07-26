export default interface IDatabaseService {
  start(): Promise<void>
  close(): Promise<void>
}
