import { Router } from 'express'
import banklyAccountRouter from './bankly/bankly-account.route'
import docsRouter from './docs/docs.route'

const router = Router()

router.use('/v1', banklyAccountRouter)
router.use('/docs', docsRouter)

export default router
