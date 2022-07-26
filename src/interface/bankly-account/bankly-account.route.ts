import BanklyAccountController from './bankly-account.controller'
import banklyAccountValidator from './bankly-account.validator'
import { Router } from 'express'
import { validator } from '@shared/middlewares'

const router = Router()
const path = '/bankly-account'

const banklyAccountController = new BanklyAccountController()

router.get(
  `${path}/:accountNumber/balance`,
  validator(banklyAccountValidator.getBalance),
  async (request, response) => {
    await banklyAccountController.getBalance(request, response)
  },
)

router.get(
  `${path}/transfer/:operationId/status`,
  validator(banklyAccountValidator.getTransferStatus),
  async (request, response) => {
    await banklyAccountController.getTransferStatus(request, response)
  },
)

router.post(`${path}/transfer`, validator(banklyAccountValidator.transfer), async (request, response) => {
  await banklyAccountController.transfer(request, response)
})

export default router
