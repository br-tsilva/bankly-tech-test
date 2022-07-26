/* eslint-disable @typescript-eslint/no-explicit-any */
export default class Exception {
  public message: string

  public status: number

  public data: any

  public traceId?: string

  constructor(message: string, details?: { statusCode?: number; traceId?: string; data?: any }) {
    this.message = message
    this.status = details?.statusCode || 400
    this.traceId = details?.traceId
    this.data = details?.data
  }
}
