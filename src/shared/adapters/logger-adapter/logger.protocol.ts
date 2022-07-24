/* eslint-disable @typescript-eslint/no-explicit-any */
export type LoggerStatus = 'SUCCESS' | 'EMPTY' | 'ALERT' | 'REJECTED' | 'ERROR'

export default interface ILoggerAdapter {
  send(traceId: string, status: LoggerStatus, message: string, data: any): void
}
