/**
 * @fileoverview Main file to start the Colonial Wars application server.
 */

const AppServer = require('../../../colonialwars-appserver')
const utils = require('../bin-utils/utils')
const args = utils.parseArgs(process.argv)
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

  process.on('SIGINT', app.shutDown.bind(app))
  process.on('SIGTERM', app.shutDown.bind(app))
  process.on('uncaughtException', app.handleUncaughtEx.bind(app))
  process.on('unhandledRejection', app.handleUncaughtEx.bind(app))
})()
