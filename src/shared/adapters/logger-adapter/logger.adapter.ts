/* eslint-disable @typescript-eslint/no-explicit-any */
import winston from 'winston'
import config from '@config'
import path from 'path'
import fs from 'fs'
import ILoggerAdapter, { LoggerStatus } from './logger.protocol'

export default class LoggerAdapter implements ILoggerAdapter {
  private _instance: winston.Logger

  constructor() {
    const nodeEnv = String(config.get('node_env', 'production'))
    const logsPath = path.resolve(__dirname, '../../../../', '/logs')

    if (!fs.existsSync(logsPath)) {
      fs.mkdirSync(logsPath, {
        recursive: false,
      })
    }

    const winstonTransports: winston.transport[] = [new winston.transports.File({ filename: `${logsPath}/traces.log` })]

    if (nodeEnv === 'development') {
      winstonTransports.push(new winston.transports.Console({ format: winston.format.simple() }))
    }

    this._instance = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      defaultMeta: { date: new Date() },
      transports: winstonTransports,
    })
  }

  get instance() {
    return this._instance
  }

  send(traceId: string, status: LoggerStatus, message: string, data: any) {
    this._instance.log('info', message, {
      traceId,
      status,
      data,
    })
  }
}
