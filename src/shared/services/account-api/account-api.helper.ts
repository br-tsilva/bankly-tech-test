/* eslint-disable @typescript-eslint/no-explicit-any */
import { AccountBalance, Accounts } from './account-api.protocol'

const buildAccountBalancePayload = (data: any): AccountBalance => {
  return {
    accountNumber: data.accountNumber,
    balance: Number(data.balance),
  }
}

const buildAccountsPayload = (data: any): Accounts[] => {
  if (!Array.isArray(data)) {
    return []
  }

  return data.map((current) => ({
    id: Number(current.id),
    accountNumber: String(current.accountNumber),
    balance: Number(current.balance),
  }))
}

export { buildAccountBalancePayload, buildAccountsPayload }
