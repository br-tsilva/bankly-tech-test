/* eslint-disable @typescript-eslint/no-explicit-any */
import { TransferBalanceParam } from '@shared/services/account-api/account-api.protocol'

const buildTransferBalancePayload = (data: { [x: string]: any }): TransferBalanceParam => {
  return {
    fromAccountNumber: String(data.fromAccountNumber),
    toAccountNumber: String(data.toAccountNumber),
    value: Number(data.valueToTransfer),
  }
}

export { buildTransferBalancePayload }
