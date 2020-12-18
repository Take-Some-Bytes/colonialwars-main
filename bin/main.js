/**
 * @fileoverview Main executable file.
 */

const ColonialwarsManager = require('../')
const utils = require('./bin-utils/utils')
const args = utils.parseArgs(process.argv)
const {
  shutDown,
  handleUncaughtEx
} = require('./shutdown')
let confFile = ''

if (args.keyedValues.confFile) {
  confFile = args.keyedValues.confFile
}
process.title = 'colonialwars-main'

;(async () => {
  const cwManager = await ColonialwarsManager.create(confFile)
  await cwManager.addAppProcess()
  process.on('SIGINT', shutDown.bind(null, cwManager))
  process.on('SIGTERM', shutDown.bind(null, cwManager))
  process.on('uncaughtException', handleUncaughtEx.bind(null, cwManager))
  process.on('unhandledRejection', handleUncaughtEx.bind(null, cwManager))
})()
