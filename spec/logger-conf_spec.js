/* eslint-env jasmine */
/**
 * @fileoverview Tests for LoggersConfig class.
 */
const winston = require('winston')

const Loggers = require('../lib/logging/loggers')
const MockSyslogServer = require('./mocks/external/mock-syslog-server')
const LoggersConfig = require('../lib/logging/loggers-config')

/**
 * Promise delay.
 * @param {number} time The time to delay for.
 */
const delay = (time) => new Promise(resolve => setTimeout(resolve, time))

describe('The LoggersConfig class, when used on its own,', () => {
  let loggersConf = null
  let err = null

  it('should construct without error', () => {
    try {
      loggersConf = new LoggersConfig()
    } catch (ex) {
      err = ex
    }

    expect(err).toBe(null)
    expect(loggersConf).toBeInstanceOf(LoggersConfig)
  })

  it('should be able to set configurations', () => {
    console.log()
    const prodConfig = {
      prod: true,
      prodBugs: '1 fixed, 8833 to go'
    }
    const devConfig = {
      prod: false,
      devving: 'fun!'
    }

    if (loggersConf instanceof LoggersConfig) {
      loggersConf.setConfig('prod', prodConfig)
      loggersConf.setConfig('dev', devConfig)
    }

    console.log('prodConfig', loggersConf.prodConfig)
    console.log('devConfig', loggersConf.devConfig)

    expect(Object.keys(loggersConf.prodConfig)).not.toBe(0)
    expect(Object.keys(loggersConf.devConfig)).not.toBe(0)
  })

  it('should be able to get configurations', () => {
    console.log()
    let prodConfig = null
    let devConfig = null

    if (loggersConf instanceof LoggersConfig) {
      prodConfig = loggersConf.getConfig('prod')
      devConfig = loggersConf.getConfig('dev')
    }

    console.log(prodConfig)
    console.log(devConfig)

    expect(prodConfig).not.toBe(null)
    expect(devConfig).not.toBe(null)
  })
})

const configs = {
  dev: {
    isProd: false,
    debug: console.log,
    loggerInfos: [
      {
        id: 'Test-logger',
        label: 'Test_log_1'
      }
    ],
    // Use syslog config.
    levels: winston.config.syslog.levels,
    colors: winston.config.syslog.colors
  },
  prod: {
    isProd: true,
    debug: console.log,
    loggerInfos: [
      {
        id: 'Test-logger',
        label: 'Test_log_2'
      }
    ],
    // Use syslog config.
    levels: winston.config.syslog.levels,
    colors: winston.config.syslog.colors,
    syslogOpts: {
      port: 5514,
      host: 'localhost',
      protocol: 'tcp4',
      // We must use the newer RFC.
      type: 'rfc5424',
      eol: '\r\n'
    }
  }
}

describe('The LoggersConfig class, when used with the Loggers class,', () => {
  const loggersArr = []
  const syslogServer = new MockSyslogServer()
  let loggersConf = null

  beforeAll(async () => {
    await syslogServer.start()
  })

  afterAll(async () => {
    await syslogServer.stop()
  })

  it('should be able to initialize without error', () => {
    let err = null
    try {
      loggersConf = new LoggersConfig()
      loggersConf.setConfig('dev', configs.dev)
      loggersConf.setConfig('prod', configs.prod)
    } catch (ex) {
      err = ex
    }

    expect(err).toBe(null)
    expect(loggersConf).toBeInstanceOf(LoggersConfig)
  })

  it('should be able to create new Loggers object with `dev` config', () => {
    let err = null

    if (loggersConf instanceof LoggersConfig) {
      try {
        const devConf = loggersConf.getConfig('dev')
        loggersArr.push(new Loggers(devConf))
      } catch (ex) {
        err = ex
      }
    }

    expect(loggersArr.length).toBe(1)
    expect(loggersArr[0]).toBeInstanceOf(Loggers)
    expect(err).toBe(null)
  })

  it('should be able to create new Loggers object with `prod` config', () => {
    let err = null

    if (loggersConf instanceof LoggersConfig) {
      try {
        const prodConf = loggersConf.getConfig('prod')
        loggersArr.push(new Loggers(prodConf))
      } catch (ex) {
        err = ex
      }
    }

    expect(loggersArr.length).toBe(2)
    expect(loggersArr[1]).toBeInstanceOf(Loggers)
    expect(err).toBe(null)
  })

  it('should be able to log with Loggers object with `dev` config', () => {
    const devLoggers = loggersArr[0]
    let logged = 0

    if (devLoggers instanceof Loggers) {
      devLoggers.allLoggers().forEach(logger => {
        console.log()
        logger.info('I could log!!!!')
        logger.warning('I could log!!!!')
        logger.alert('I could log!!!!')
        logged++
      })
    }

    expect(devLoggers).toBeInstanceOf(Loggers)
    expect(logged).toBeGreaterThanOrEqual(1)
  })

  it('should be able to log with Loggers object with `prod` config', async () => {
    const prodLoggers = loggersArr[1]
    let logged = 0
    let dataReceived = false

    if (prodLoggers instanceof Loggers) {
      prodLoggers.allLoggers().forEach(logger => {
        console.log()
        logger.info('I could log!!!!')
        logger.warning('I could log!!!!')
        logger.alert('I could log!!!!')
        logged++
      })
    }
    await delay(1000)
    dataReceived = syslogServer.dataReceived

    expect(dataReceived).toBe(true)
    expect(prodLoggers).toBeInstanceOf(Loggers)
    expect(logged).toBeGreaterThanOrEqual(1)
  })
})
