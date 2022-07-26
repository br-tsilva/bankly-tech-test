import { Request, Response, NextFunction } from 'express'
import { ExceptionHelper } from '@shared/helpers'

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

  response.status(500).json({
    status: 500,
    data: undefined,
    message: error.name || error.message || 'Something went wrong',
  })
}
