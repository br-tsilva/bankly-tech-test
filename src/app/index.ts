import 'express-async-errors'
import { default as express } from 'express'
import { DatabaseAdapter, MessengerAdapter, LoggerAdapter, RequestAdapter } from '@shared/adapters'
import { DatabaseService, LoggerService, MessengerService, AccountApiService } from '@shared/services'
import { default as routers } from '@interface/routes'
import { default as Consumers } from './consumers'
import { errorHandler } from '@shared/middlewares'

const app = express()

const requestAdapter = new RequestAdapter()
const loggerService = new LoggerService(new LoggerAdapter())

const databaseService = new DatabaseService(new DatabaseAdapter(), loggerService)
const messengerService = new MessengerService(new MessengerAdapter(), loggerService)

const accountApiService = new AccountApiService(requestAdapter, messengerService, databaseService, loggerService)
const consumers = new Consumers(databaseService, messengerService, loggerService, accountApiService)

app.use(express.json({ limit: '200kb' }))
app.use(express.urlencoded({ extended: true }))

app.use(routers, errorHandler)

export default {
  async startServices() {
    await databaseService.start()
    await messengerService.start().then(() => {
      consumers.start()
    })
  },
  app,
}
