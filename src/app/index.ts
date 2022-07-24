import express from 'express'
import routers from '@interface/routes'

const app = express()

app.use(express.json({ limit: '200kb' }))
app.use(express.urlencoded({ extended: true }))

app.use(routers)

export default {
  async startServices() {
    // throw new Error('Not implemented')
  },
  app,
}
