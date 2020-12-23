/**
 * @fileoverview ColonialwarsManager class to manage
 * the Colonial Wars game.
 */

const childProcess = require('child_process')
const winstonConfig = require('winston/lib/winston/config')
const path = require('path')
const debug = require('debug')

const utils = require('./utils/utils')
const constants = require('./constants')
const Loggers = require('./logging/loggers')
const Configurations = require('./utils/configurations')
const LoggersConfig = require('./logging/loggers-config')

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
     * @type {Array<CWProcess>}
     */
    this.processes = []

    this.config = null
    this.appBin = null
    this.maxApps = null
    this.loggers = null
    this.loggersConf = null
  }

  /**
   * Gets self configurations.
   * @private
   */
  async _getConfig () {
    this.config = await Configurations.readFrom(
      this.confFile, constants.FALLBACKS
    )
    this.debug('Got configuration file.')

    // Set the NODE_ENV.
    process.env.NODE_ENV = this.config.get('IS_PROD')
      ? 'production'
      : 'development'
    this.appBin =
      this.config.get('APP_BIN_LOCATION') ||
      path.join(__dirname, '../bin', 'app-bin/app-bin.js')
    this.maxApps =
      typeof this.config.get('MAX_APPS') === 'number'
        ? this.config.get('MAX_APPS')
        : 1

    this.debug(
      'All other configurations determined'
    )
  }

  /**
   * Gets logging configurations.
   * @private
   */
  _getLoggersConfig () {
    const conf = {
      isProd: false,
      debug: this.debug,
      loggerInfos: [
        {
          id: 'Process-logger',
          label: 'Process_log'
        },
        {
          id: 'Manager-logger',
          label: 'Manager_log'
        }
      ],
      levels: winstonConfig.syslog.levels,
      colors: winstonConfig.syslog.colors,
      syslogOpts: null
    }
    this.loggersConf = new LoggersConfig()
    this.loggersConf.setConfig('dev', conf)
    this.loggersConf.setConfig('prod', Object.assign(
      Object.assign({}, conf), {
        isProd: true,
        syslogOpts: this.config.get('SYSLOG_OPTS')
      }
    ))
  }

  /**
   * Initialize helper classes.
   * @private
   */
  _initHelpers () {
    this.loggers = new Loggers(
      this.config.get('IS_PROD')
        ? this.loggersConf.getConfig('prod')
        : this.loggersConf.getConfig('dev')
    )
    this.debug('Initialized manager loggers.')
  }

  /**
   * Initializes this ColonialwarsManager.
   */
  async init () {
    await this._getConfig()
    this._getLoggersConfig()
    this._initHelpers()

    this.loggers.get('Manager-logger').info(
      'Initialization complete.'
    )
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
      { env: { DEBUG: process.env.DEBUG } }
    )
    const appID = await utils.genID(36)
    this.appServers.set(appID, appProc)
    this.processes.push({
      proc: appProc,
      id: appID
    })

    this.loggers.get('Process-logger').info(
      `App ID ${appID} started with PID ${appProc.pid}.`
    )

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
    if (!signal || typeof signal !== 'string') {
      signal = 'SIGINT'
    }

    this.processes.forEach(proc => {
      /**
       * TODO: Find out how to know if a subprocess has been terminated.
       * If apps are stuck in a infinite loop and have no time to pay attention
       * to handle-able signals, we might have to kill the process with SIGKILL.
       * But, there is no way to check if the process has terminated or not.
       * (2020/12/17) Take-Some-Bytes */
      proc.proc.kill(signal)

      this.loggers.get('Process-logger').info(
        `Stopped process ${proc.id} with signal ${signal}.`
      )
    })
    // Clear all the objects that store information about
    // the was-running processes.
    this.processes.length = 0
    this.appServers.clear()

    this.loggers.get('Process-logger').info(
      `All processes stopped with signal ${signal}.`
    )
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
