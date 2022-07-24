import dataSource from './ormconfig.typeorm'

export default {
  start: dataSource.initialize,
}
