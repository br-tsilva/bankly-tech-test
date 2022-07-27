/* eslint-disable @typescript-eslint/no-explicit-any */
import { TransactionCreatorParam } from '@shared/services/account-api/account-api.protocol'

const buildTransactionCreatorPayload = (data: { [x: string]: any }): TransactionCreatorParam => {
  return {
    accountOrigin: String(data.accountOrigin),
    accountDestination: String(data.accountDestination),
    value: Number(data.value),
  }
}

export { buildTransactionCreatorPayload }
