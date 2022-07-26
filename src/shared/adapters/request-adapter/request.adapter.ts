/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import IRequestAdapter, { TRequestAdapterPayloadType } from './request.protocol'

export default class RequestAdapter implements IRequestAdapter {
  _handleResponse(data: any) {
    return {
      status: data.status || 200,
      data: data.data,
    }
  }

  _handleError(data: any) {
    return {
      status: data.status || data.response?.status || 400,
      data: data.response?.data,
      message: data.message || 'Request has been failed',
    }
  }

  _handleParams(data: { [x: string]: any }, type: TRequestAdapterPayloadType) {
    if (type === 'URLENCODED') {
      return new URLSearchParams(data)
    }

    return data
  }

  async get(url: string, params?: { [x: string]: any }) {
    const payload = this._handleParams(params || {}, 'URLENCODED')

    const response = await axios.get(url, { params: payload }).then(this._handleResponse, this._handleError)
    return response
  }

  async post(url: string, params?: { [x: string]: any }) {
    const payload = this._handleParams(params || {}, 'JSON')

    const response = await axios.post(url, payload).then(this._handleResponse, this._handleError)
    return response
  }
}
