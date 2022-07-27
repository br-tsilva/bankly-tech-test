import { JsonObject } from 'swagger-ui-express'
import { default as config } from '@config'

const serverPort = String(config.get('server_port', ''))

export default <JsonObject>{
  openapi: '3.0.0',
  info: {
    title: 'Bankly Service',
    description: 'A technical test',
    contact: {
      email: 'tsv.thiagosilva@gmail.com',
    },
  },
  servers: [
    {
      url: `http://localhost:${serverPort}`,
      description: 'Local server',
    },
  ],
  paths: {
    '/v1/bankly/accounts': {
      get: {
        summary: 'Accounts',
        description: 'Get a list accounts',
        tags: ['Account'],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'integer',
                      description: 'Status code request',
                    },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'integer',
                            description: 'Account Id',
                          },
                          accountNumber: {
                            type: 'string',
                            description: 'Account Number',
                          },
                          balance: {
                            type: 'integer',
                            description: 'Balance account',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/v1/bankly/account/{accountNumber}/balance': {
      get: {
        summary: 'Account Balance',
        description: 'Get current balance from account',
        tags: ['Account'],
        parameters: [
          {
            name: 'accountNumber',
            in: 'path',
            description: 'Account number',
            required: true,
          },
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'integer',
                      description: 'Status code request',
                    },
                    data: {
                      type: 'object',
                      description: 'Content Request',
                      properties: {
                        accountNumber: {
                          type: 'string',
                          description: 'Account Number',
                        },
                        balance: {
                          type: 'integer',
                          description: 'Balance account',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/v1/bankly/transaction/{transactionId}/status': {
      get: {
        summary: 'Transaction Status',
        description: 'Get current transaction status',
        tags: ['Transaction'],
        parameters: [
          {
            name: 'transactionId',
            in: 'path',
            description: 'transactionId',
            required: true,
          },
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'integer',
                      description: 'Status code request',
                    },
                    data: {
                      type: 'object',
                      description: 'Content Request',
                      properties: {
                        status: {
                          type: 'string',
                          description: 'Transaction status',
                        },
                        error: {
                          type: 'string',
                          description: 'Error description',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/v1/bankly/transaction': {
      post: {
        summary: 'Create Transaction',
        description: 'Create a transaction',
        tags: ['Transaction'],
        requestBody: {
          description: 'basic account informations to create a transaction',
          require: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  accountOrigin: {
                    type: 'string',
                    description: 'Sender account balance',
                  },
                  accountDestination: {
                    type: 'string',
                    description: 'Destiny account',
                  },
                  value: {
                    type: 'string',
                    description: 'Value to transfer',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'integer',
                      description: 'Status code request',
                    },
                    data: {
                      type: 'object',
                      description: 'Content Request',
                      properties: {
                        transactionId: {
                          type: 'string',
                          description: 'Transaction ID',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
}
