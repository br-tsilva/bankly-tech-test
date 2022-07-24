import { Router } from 'express'
import BanklyAccountController from './bankly-account.controller'

const router = Router()
const path = '/bankly-account'

const banklyAccountController = new BanklyAccountController()

router.get(`${path}/:accountNumber/balance`, (request, response) => {
  banklyAccountController.getBalance(request, response)
})
router.get(`${path}/transfer/:operationId/status`, banklyAccountController.getTransferStatus)
router.post(`${path}/transfer`, banklyAccountController.transfer)

export default router
