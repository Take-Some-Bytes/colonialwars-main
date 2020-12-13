/**
 * @fileoverview Utility functions. There's no reason to wrap this
 * in a class... Right? I believe so.
 */

const NO_FREEZE = Symbol('NO_FREEZE')
const ID_MAX_LEN = 100
const crypto = require('crypto')

/**
 * Deep-freezes an object.
 * @param {Object} object The object to deep freeze.
 * @returns {Object}
 */
function deepFreeze (object) {
  // Retrieve the property names defined on object.
  const propNames = Object.getOwnPropertyNames(object)
  // Check for a special "NO_FREEZE" symbol.
  if (object[NO_FREEZE] === true) {
    return
  }
  // Freeze properties before freezing self.
  for (const name of propNames) {
    const value = object[name]
    if (value && typeof value === 'object') {
      // Check for a special "NO_FREEZE" symbol.
      if (value[NO_FREEZE] === true) {
        return
      }
      deepFreeze(value)
    }
  }
  return Object.freeze(object)
}
/**
 * Binds a number to the given minimum and maximum, inclusive of both
 * binds. This function will still work if min and max are switched.
 * @param {number} val The value to check.
 * @param {number} min The minimum number to bound to.
 * @param {number} max The maximum number to bound to.
 * @returns {number}
 */
function bind (val, min, max) {
  if (min > max) { return Math.min(Math.max(val, max), min) }
  return Math.min(Math.max(val, min), max)
}
/**
 * Mixes up a string real good.
 * @param {string} string The string to mix up.
 * @returns {string}
 */
function mixUp (string) {
  const splitString = [...string]
  let result = ''
  let i = 0

  while (i < string.length) {
    const indexToGet = bind(
      Math.floor(Math.random() * splitString.length),
      0, splitString.length
    )
    result += splitString.splice(indexToGet, 1)[0]
    i++
  }

  return result
}
/**
 * Generates an ID that is quite unique.
 * @param {number} length The length of the ID.
 * @returns {Promise<string>}
 */
function genID (length) {
  return new Promise((resolve, reject) => {
    if (length > ID_MAX_LEN) {
      reject(new RangeError('Requested ID is too large!'))
      return
    }

    const cryptoBytes = Math.round(
      length - (length / 4)
    )
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
    let id = ''

    crypto.randomBytes(cryptoBytes, (err, buf) => {
      if (err) {
        reject(err)
        return
      }
      try {
        id = buf.toString('hex')
        for (let i = 0; i < (length / 4); i++) {
          id += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        id = mixUp(id)
        resolve(id)
      } catch (err) {
        reject(err)
      }
    })
  })
}

module.exports = exports = {
  // Symbols:
  NO_FREEZE,
  // Constants
  ID_MAX_LEN,
  // Functions:
  deepFreeze,
  genID
}
