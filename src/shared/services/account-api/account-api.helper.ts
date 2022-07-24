/* eslint-disable @typescript-eslint/no-explicit-any */
import { AccountBalance, TransferBalanceParam } from './account-api.protocol'

const buildAccountBalancePayload = (data: any): AccountBalance => {
  return {
    accountId: Number(data.id),
    accountNumber: data.accountNumber,
    balance: Number(data.balance),
  }
}

const buildTransferBalancePayload = (fromAccount: string, toAccount: string, value: number): TransferBalanceParam => {
  return {
    fromAccountNumber: fromAccount,
    toAccountNumber: toAccount,
    value,
  }
}

export { buildAccountBalancePayload, buildTransferBalancePayload }
