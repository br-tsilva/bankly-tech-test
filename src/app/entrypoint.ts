import main from './index'
import config from '@config'

const serverPort = config.get('server_port')
if (!serverPort) {
  throw new Error('No server port configured')
}

main
  .startServices()
  .then(() => {
    main.app.listen(serverPort, () => {
      console.log(`Server has been started at port ${serverPort}`)
    })
  })
  .catch((error) => {
    // log error
    throw new Error(error)
  })
