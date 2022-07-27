/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerStatus } from '@shared/adapters/logger-adapter/logger.protocol'

export default interface ILoggerService {
  _handleData(data: any): any[]
  log(status: LoggerStatus, message: string, data?: { [x: string]: any }): { traceId: string; message: string }
}
