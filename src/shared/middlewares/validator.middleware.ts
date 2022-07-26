import Schema, { SchemaDefinition } from 'validate'
import { Request, Response, NextFunction } from 'express'
import { httpStatusCodes } from '@shared/adapters'
import { ExceptionHelper } from '@shared/helpers'

export default (templateSchema: SchemaDefinition) => {
  const middleware = (request: Request, _response: Response, next: NextFunction) => {
    const getFromBodyRequest = ['PATCH', 'PUT', 'POST'].includes(request.method)
    const params = getFromBodyRequest ? { ...request.body, ...request.params } : { ...request.query, ...request.params }

    const schema = new Schema({ ...templateSchema })
    schema.typecaster({
      Number: (value) => {
        if (String(Number(value)) !== 'NaN') {
          return Number(value)
        }
        return false
      },
      Object: (value) => value,
    })

    const errors = schema.validate(params, { strict: true, strip: true, typecast: true })
    if (errors.length) {
      const errorsMapped = errors.map((error) => ({
        [error.path.split(/\.\d/).join('')]: error.toString(),
      }))
      const errorsParsed = Object.assign({}, ...errorsMapped)

      throw new ExceptionHelper('Invalid parameters', {
        statusCode: httpStatusCodes.BAD_REQUEST,
        data: errorsParsed,
      })
    }

    next()
  }

  return middleware
}
