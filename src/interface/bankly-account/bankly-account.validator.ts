import { SchemaDefinition } from 'validate'

const getBalance = <SchemaDefinition>{
  accountNumber: {
    type: Number,
    required: true,
    message: { required: 'Account number is required' },
  },
}

const getTransactionStatus = <SchemaDefinition>{
  transactionId: {
    type: String,
    match: /^[a-z0-9-]+$/i,
    required: true,
    message: { required: 'Transaction id is required', match: 'Transaction id is invalid' },
  },
}

const createTransaction = <SchemaDefinition>{
  accountOrigin: {
    type: Number,
    required: true,
    message: { required: 'Origin Account Number is required' },
  },
  accountDestination: {
    type: Number,
    required: true,
    message: { required: 'Destiny Account Number is required' },
  },
  value: {
    type: Number,
    required: true,
    message: { required: 'Value to transfer is required' },
  },
}

export default { getBalance, getTransactionStatus, createTransaction }
