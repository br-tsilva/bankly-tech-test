/* eslint-disable @typescript-eslint/no-explicit-any */
export type TRequestAdapterResponse = {
  status: number
  data: { [x: string]: any }
  message?: string
}

export type TRequestAdapterPayloadType = 'JSON' | 'URLENCODED'

export default interface IRequestAdapter {
  _handleResponse(data: any): TRequestAdapterResponse
  _handleError(data: any): TRequestAdapterResponse
  _handleParams(data: { [x: string]: any }, type: TRequestAdapterPayloadType): URLSearchParams | { [x: string]: any }

  get(url: string, params?: { [x: string]: any }): Promise<TRequestAdapterResponse>
  post(url: string, params?: { [x: string]: any }): Promise<TRequestAdapterResponse>
}
