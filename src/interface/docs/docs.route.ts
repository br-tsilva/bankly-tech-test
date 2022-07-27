import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import { default as swaggerSettings } from '@infra/swagger/swagger.settings'

const router = Router()

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSettings))

export default router
