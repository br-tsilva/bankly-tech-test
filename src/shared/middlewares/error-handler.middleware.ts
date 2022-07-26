import { Request, Response, NextFunction } from 'express'
import { ExceptionHelper } from '@shared/helpers'
import { LoggerAdapter } from '@shared/adapters'
import { LoggerService } from '@shared/services'

const loggerAdapter = new LoggerAdapter()
const loggerService = new LoggerService(loggerAdapter)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (error: ExceptionHelper | Error, request: Request, response: Response, _: NextFunction) => {
  if (error instanceof ExceptionHelper) {
    response.status(error.status).json({
      status: error.status,
      data: { traceId: error.traceId, ...error.data },
      message: error.message,
    })
    return
  }

  const { traceId } = loggerService.log('ERROR', String(error), { error })

  response.status(500).json({
    status: 500,
    data: { traceId },
    message: 'An internal error has occurred',
  })
}
