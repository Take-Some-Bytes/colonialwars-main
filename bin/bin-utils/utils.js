/**
 * @fileoverview Utility methods.
 */

/**
 * @typedef {Object} ParsedArgs
 * @prop {Array<string>} _
 * @prop {Object<string, string>} keyedValues
 */

/**
 * Parses process arguments.
 * @param {Array<string>} args Arguments.
 * @returns {ParsedArgs}
 */
function parseArgs (args) {
  const toReturn = {
    _: [],
    keyedValues: {}
  }
  let i = 0
  while (i < args.length) {
    /**
     * Parsing rules:
     *  1. IF `arg` STARTS WITH `--`, INSERT `arg` AS KEY IN `toReturn.keyedValues`,
     *   AND USE NEXT `arg` AS VALUE IN KEY-VALUE PAIR.
     *  2. IF `arg` STARTS WITH `-` INSERT `arg` INTO `toReturn._`.
     *  3. IF `arg` HAS STILL NOT BEEN PROCESSED, INSERT INTO `toReturn._`.
     */
    let arg = args[i]
    if (arg.startsWith('--')) {
      if ((i + 1) >= args.length) {
        toReturn._.push(arg.substring(2))
      } else {
        const nextArg = args[i + 1]
        arg = arg.substring(2)

        toReturn.keyedValues[arg] = nextArg
        i++
      }
    } else {
      toReturn._.push(arg.substring(1))
    }
    i++
  }
  return toReturn
}

module.exports = exports = {
  parseArgs
}
