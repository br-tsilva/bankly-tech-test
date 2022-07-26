/* eslint-disable @typescript-eslint/no-explicit-any */
import { AccountBalance } from './account-api.protocol'

const buildAccountBalancePayload = (data: any): AccountBalance => {
  return {
    accountId: Number(data.id),
    accountNumber: data.accountNumber,
    balance: Number(data.balance),
  }
}

export { buildAccountBalancePayload }
