export default class Exception {
  public message: string

  public traceId: string

  constructor(message: string, traceId?: string) {
    this.message = message
    this.traceId = traceId || ''
  }
}
