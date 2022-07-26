/* eslint-disable @typescript-eslint/no-explicit-any */
import { default as ILoggerService } from './logger.protocol'
import { default as ILoggerAdapter, LoggerStatus } from '@shared/adapters/logger-adapter/logger.protocol'
import { isJson } from '@shared/utils'

export default class LoggerService implements ILoggerService {
  constructor(private loggerAdapter: ILoggerAdapter) {}

  _handleData(data: any) {
    if (data instanceof Error) {
      return [{ error: data.message || data.name, stack: data.stack }]
    }

    if (isJson(data)) {
      return [data]
    }

    if (Array.isArray(data)) {
      const itemsPerParts = 50
      const parts = new Array(Math.ceil((data.length || 1) / itemsPerParts))
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
    const handledData = this._handleData(data || {})

    handledData.forEach((part) => this.loggerAdapter.send(traceId, status, message, part || {}))

    return { traceId }
  }
}
