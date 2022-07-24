import { Router } from 'express'
import banklyAccountRouter from './bankly-account/bankly-account.route'

const router = Router()

router.use('/', banklyAccountRouter)

export default router
