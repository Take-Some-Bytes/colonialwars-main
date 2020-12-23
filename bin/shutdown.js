/**
 * @fileoverview Functions to handle the shutdown of this main process.
 */

/**
 * Gracefully shuts down a ColonialwarsManager instance.
 * @param {InstanceType<import('../')>} manager The Manager instance.
 * @param {NodeJS.Signals} signal The signal that was received.
 */
async function shutDown (manager, signal) {
  manager.loggers.get('Manager-logger').info(
    `Signal ${signal} received. Shutting down server...`
  )
  try {
    manager.stopAll(signal)
    manager.loggers.get('Manager-logger').info(
      'Manager shutdown successfully. Exiting...'
    )
    process.exitCode = 0
  } catch (ex) {
    manager.loggers.get('Manager-logger').crit(
      `An error occured while shutting down manager. Error is: ${ex.stack}`
    )
    process.exitCode = 1
  }
}

/**
 * Handles an uncaught exception in the process.
 * @param {InstanceType<import('../')>} manager The Manager instance.
 * @param {NodeJS.Signals} ex The signal that was received.
 */
async function handleUncaughtEx (manager, ex) {
  try {
    manager.stopAll('SIGINT')
    manager.loggers.get('Manager-logger').crit(
      `Manager crashed. Error is: ${ex.stack}`
    )
    manager.loggers.get('Manager-logger').crit(
      'Exiting...'
    )
    process.exitCode = 1
  } catch (err) {
    manager.loggers.get('Manager-logger').crit(
      `Graceful shutdown failed with error ${err.stack}`
    )
    manager.loggers.get('Manager-logger').crit(
      'Forcing shutdown in one second...'
    )
    // Forcefully exit after one second.
    setTimeout(() => {
      process.exit(1)
    }, 1000)
  }
}

module.exports = exports = {
  shutDown,
  handleUncaughtEx
}
