import 'express-async-errors'
import { default as express } from 'express'
import { default as routers } from '@interface/routes'
import { DatabaseAdapter, MessengerAdapter } from '@shared/adapters'
import { errorHandler } from '@shared/middlewares'
import { DatabaseService, LoggerService, MessengerService } from '@shared/services'
import { LoggerAdapter } from '@shared/adapters'

const app = express()

const loggerService = new LoggerService(new LoggerAdapter())

const databaseService = new DatabaseService(new DatabaseAdapter(), loggerService)
const messengerService = new MessengerService(new MessengerAdapter(), loggerService)

app.use(express.json({ limit: '200kb' }))
app.use(express.urlencoded({ extended: true }))

app.use(routers, errorHandler)

export default {
  async startServices() {
    await databaseService.start()
    await messengerService.start()
  },
  app,
}
