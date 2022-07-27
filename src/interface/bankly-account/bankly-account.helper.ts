/* eslint-disable @typescript-eslint/no-explicit-any */
import { TransferBalanceParam } from '@shared/services/account-api/account-api.protocol'

const buildTransferBalancePayload = (data: { [x: string]: any }): TransferBalanceParam => {
  return {
    accountOrigin: String(data.accountOrigin),
    accountDestination: String(data.accountDestination),
    value: Number(data.value),
  }
}

export { buildTransferBalancePayload }
