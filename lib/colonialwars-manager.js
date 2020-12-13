/**
 * @fileoverview ColonialwarsManager class to manage
 * the Colonial Wars game.
 */

const childProcess = require('child_process')
const path = require('path')
const debug = require('debug')

const utils = require('./utils/utils')
const constants = require('./constants')
const Configurations = require('./utils/configurations')

/**
 * @typedef {Object} CWProcess
 * @prop {childProcess.ChildProcess} proc
 * @prop {string} id
 */

/**
 * ColonialwarsManager class.
 */
class ColonialwarsManager {
  /**
   * Constructor for a ColonialwarsManager.
   * @param {string} confFile Path to the configuration file.
   */
  constructor (confFile) {
    this.confFile = confFile || ''
    this.debug = debug('colonialwars-main')

    /**
     * @type {Map<string, childProcess.ChildProcess>}
     */
    this.appServers = new Map()
    /**
     * @type {Array<childProcess.ChildProcess>}
     */
    this.processes = []
  }

  /**
   * Gets self configurations.
   * @private
   */
  async _getConfig () {
    this.config = await Configurations.readFrom(
      this.confFile, constants.FALLBACKS
    )
    // Set the NODE_ENV.
    process.env.NODE_ENV = this.config.get('IS_PROD')
      ? 'production'
      : 'development'
    this.debug('Got configurations')

    this.appBin =
      this.config.get('APP_BIN_LOCATION') ||
      path.join(__dirname, '../bin', 'app-bin/app-bin.js')
    this.maxApps =
      typeof this.config.get('MAX_APPS') === 'number'
        ? this.config.get('MAX_APPS')
        : 1
  }

  /**
   * Initializes this ColonialwarsManager.
   */
  async init () {
    await this._getConfig()
  }

  // Managing functions.
  /**
   * Adds a new colonialwars-appserver process. Returns the created
   * app server process.
   * @param {string} [confFile] Path of the configuration file.
   * @returns {Promise<CWProcess>}
   */
  async addAppProcess (confFile) {
    if (this.appServers.size >= this.maxApps) {
      throw new Error(
        'Maximum app server amount reached!'
      )
    }
    const appProc = childProcess.fork(
      this.appBin, [
        '--confFile', this.config.get('APP_CONF_FILE') || confFile || ''
      ],
      { env: {} }
    )
    const appID = await utils.genID(36)
    this.appServers.set(appID, appProc)
    this.processes.push(appProc)

    return {
      proc: appProc,
      id: appID
    }
  }

  /**
   * Stops all processes this manager is managing with the specified
   * signal. Default signal is SIGINT.
   * @param {NodeJS.Signals} [signal]
   */
  stopAll (signal) {
    this.processes.forEach(proc => {
      proc.kill(signal)
    })
  }

  // Static functions.
  /**
   * Creates a ColonialwarsManager. This is mainly here so that this class
   * could be initialized on creation.
   * @param {string} [confFile] The configuration file path.
   * @returns {Promise<ColonialwarsManager>}
   */
  static async create (confFile) {
    const cwManager = new ColonialwarsManager(confFile)
    await cwManager.init()
    return cwManager
  }
}

module.exports = exports = ColonialwarsManager
