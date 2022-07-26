import main from './index'
import config from '@config'

const serverPort = config.get('server_port')
if (!serverPort) {
  throw new Error('No server port configured')
}

main
  .startServices()
  .then(() => {
    main.app.listen(serverPort, () => process.stdout.write(`\nServer has been started at port ${serverPort}\n`))
  })
  .catch((error) => {
    throw new Error(error)
  })
