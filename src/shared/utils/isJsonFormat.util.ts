// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (data: { [x: string]: any }) => {
  try {
    const stringifiedJson = JSON.stringify(data)
    JSON.parse(stringifiedJson)
    return true
  } catch (error) {
    return false
  }
}
