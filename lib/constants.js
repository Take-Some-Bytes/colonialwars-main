/**
 * @fileoverview Constants file to store the constants.
 */

const path = require('path')
const { deepFreeze } = require('./utils/utils')

module.exports = exports = {
  FALLBACKS: {
    IS_PROD: false,
    MAX_APPS: 1,
    APP_BIN_LOCATION: path.join(__dirname, '../bin', 'app-bin/app-bin.js'),
    ALLOWED_DEPLOYMENTS: [
      'colonialwars-appserver',
      'colonialwars-gameserver'
    ]
  }
}

deepFreeze(module.exports)
