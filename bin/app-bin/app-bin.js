/**
 * @fileoverview Main file to start the Colonial Wars application server.
 */

const AppServer = require('../../../colonialwars-appserver')
const utils = require('../bin-utils/utils')
const args = utils.parseArgs(process.argv)
const {
  shutDown,
  handleUncaughtEx
} = require('./shutdown')
let app = null
let confFile = ''

if (!process.connected) {
  throw new Error(
    'You must spawn this script with an IPC channel!'
  )
}
if (args.keyedValues.confFile) {
  confFile = args.keyedValues.confFile
}
process.title = 'colonialwars-appserver'

// Initialize and start app.
;(async () => {
  app = await AppServer.create(confFile)
  await app.start()
  process.send({
    event: 'app_started',
    data: {
      appStarted: app.server.listening
    }
  })

  process.on('SIGINT', shutDown.bind(null, app))
  process.on('SIGTERM', shutDown.bind(null, app))
  process.on('uncaughtException', handleUncaughtEx.bind(null, app))
  process.on('unhandledRejection', handleUncaughtEx.bind(null, app))
})()
