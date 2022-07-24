/* eslint-disable @typescript-eslint/no-explicit-any */
import ILoggerService from './logger.protocol'
import ILoggerAdapter, { LoggerStatus } from '@shared/adapters/logger-adapter/logger.protocol'

export default class LoggerService implements ILoggerService {
  constructor(private loggerAdapter: ILoggerAdapter) {}

  _handleData(data: any) {
    if (data instanceof Error) {
      return [{ error: data.message || data.name, stack: data.stack }]
    }

    if (Object.keys(data).length) {
      return [data]
    }

    if (Array.isArray(data)) {
      const itemsPerParts = 50
      const parts = new Array(Math.ceil(data.length / itemsPerParts))
        .fill(undefined)
        .map((_, index) => data.slice(itemsPerParts - index * itemsPerParts, itemsPerParts * index))

      return parts
    }

    const strigifiedData = String(data)
    const itemsPerParts = 2000
    const parts = new Array(Math.ceil(strigifiedData.length / itemsPerParts))
      .fill(undefined)
      .map((_, index) => strigifiedData.substring(itemsPerParts - index * itemsPerParts, itemsPerParts * index))

    return parts
  }

  log(status: LoggerStatus, message: string, data?: { [x: string]: any }) {
    const traceId = String(Date.now())
    const handledData = this._handleData(data)

    handledData.forEach((part) => this.loggerAdapter.send(traceId, status, message, part || {}))

    return { traceId }
  }
}
