import { default as constants } from './constants.config'

const get = (key: string, defaultValue?: string) => {
  if (!(key in constants)) {
    return defaultValue || null
  }

  return constants[key] || defaultValue
}

export default { get }
