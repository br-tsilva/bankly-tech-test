import { SchemaDefinition } from 'validate'

const getBalance = <SchemaDefinition>{
  accountNumber: {
    type: Number,
    required: true,
    message: { required: 'Account number is required' },
  },
}

const getTransferStatus = <SchemaDefinition>{
  operationId: {
    type: String,
    match: /^[a-z0-9-]+$/i,
    required: true,
    message: { required: 'Operation id is required', match: 'Operation id is invalid' },
  },
}

const transfer = <SchemaDefinition>{
  fromAccountNumber: {
    type: Number,
    required: true,
    message: { required: 'Origin Account Number is required' },
  },
  toAccountNumber: {
    type: Number,
    required: true,
    message: { required: 'Destiny Account Number is required' },
  },
  valueToTransfer: {
    type: Number,
    required: true,
    message: { required: 'Value to transfer is required' },
  },
}

export default { getBalance, getTransferStatus, transfer }