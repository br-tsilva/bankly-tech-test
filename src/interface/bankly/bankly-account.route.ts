import BanklyAccountController from './bankly-account.controller'
import banklyAccountValidator from './bankly-account.validator'
import { Router } from 'express'
import { validator } from '@shared/middlewares'

const router = Router()
const path = '/bankly'

const banklyAccountController = new BanklyAccountController()

router.get(
  `${path}/account/:accountNumber/balance`,
  validator(banklyAccountValidator.getBalance),
  async (request, response) => {
    await banklyAccountController.getBalance(request, response)
  },
)

router.get(
  `${path}/transaction/:transactionId/status`,
  validator(banklyAccountValidator.getTransactionStatus),
  async (request, response) => {
    await banklyAccountController.getTransactionStatus(request, response)
  },
)

router.post(`${path}/transaction`, validator(banklyAccountValidator.createTransaction), async (request, response) => {
  await banklyAccountController.createTransaction(request, response)
})

export default router
