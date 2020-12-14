/**
 * @fileoverview Main executable file.
 */

const ColonialwarsManager = require('../')
const utils = require('./bin-utils/utils')
const args = utils.parseArgs(process.argv)
let confFile = ''

if (args.keyedValues.confFile) {
  confFile = args.keyedValues.confFile
}
process.title = 'colonialwars-main'

;(async () => {
  const cwManager = await ColonialwarsManager.create(confFile)
  await cwManager.addAppProcess()
  process.on('SIGINT', signal => {
    cwManager.stopAll(signal)
  })
})()
