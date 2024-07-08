import sequelize from './api/models'
import logging from './api/utils/logging'
import app from './app'
import appConfig from './config/app.config'

const PATH = 'model/index'

// Start server
const server = app
  .listen(appConfig.server.server_port, () => {
    console.log(`WSV eCommerce start with port ${appConfig.server.server_port}`)
  })
  .on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.log('Error: address already in use')
    } else {
      console.log(err)
    }
  })

// Phương thức quy trình trong nodejs
process.on('SIGINT', () => {
  server.close(() => {
    // Close sequelize connection
    sequelize
      .close()
      .then(() => logging.info(PATH, 'Connection has been closed'))
      .catch((error) => logging.error(PATH, `Unable to close the database: ${error}`))
    console.log(`Exit server express`)
  })
})
