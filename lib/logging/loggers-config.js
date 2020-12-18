/**
 * @fileoverview LoggersConfig class to manage configurations for the Loggers class.
 */

/**
 * @typedef {Object<string, any>} Config
 */

/**
 * LoggersConfig class.
 */
class LoggersConfig {
  constructor () {
    this.prodConfig = {}
    this.devConfig = {}
  }

  /**
   * Sets either the ``'prod'`` configurations, or the ``'dev'`` configurations.
   * @param {'prod'|'dev'} which Which config to set.
   * @param {Config} config The contents of the config.
   */
  setConfig (which, config) {
    // First, some type checking.
    if (which !== 'dev' && which !== 'prod') {
      throw new TypeError(
        'The `which` parameter must either `prod` or `dev`!'
      )
    } else if (!config || typeof config !== 'object') {
      throw new TypeError(
        'The `config` parameter must be a plain object!'
      )
    }

    // Now that type checks have passed, we could proceed
    // safely (I hope).
    this[`${which}Config`] = config
  }

  /**
   * Gets either the ``'prod'`` or the ``'dev'`` configurations.
   * @param {'prod'|'dev'} which Which config to get.
   * @returns {Config}
   */
  getConfig (which) {
    // First, some type checking.
    if (which !== 'dev' && which !== 'prod') {
      throw new TypeError(
        'The `which` parameter must either `prod` or `dev`!'
      )
    }
    // Now, PROCEED.
    return this[`${which}Config`]
  }
}

module.exports = exports = LoggersConfig
