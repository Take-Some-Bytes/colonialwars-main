/* eslint-env jasmine */
/**
 * @fileoverview Testing application utility methods.
 */

const { deepFreeze } = require('../../colonialwars-main/lib/utils/utils')
const utils = require('../lib/utils/utils')

describe('Basic tests for Colonial Wars util methods', () => {
  it('should have four properties', () => {
    const utilsLength = Object.keys(utils).length

    expect(utilsLength).toBe(4)
  })
  it('should have two functions, one symbol, one number', () => {
    const utilVals = Object.values(utils)
    let numFuncs = 0
    let numSymbols = 0
    let numNums = 0
    utilVals.forEach(val => {
      switch (typeof val) {
        case 'function':
          numFuncs++
          break
        case 'symbol':
          numSymbols++
          break
        case 'number':
          numNums++
          break
      }
    })

    expect(numFuncs).toBe(2)
    expect(numSymbols).toBe(1)
    expect(numNums).toBe(1)
  })
  it('should be able to deep-freeze objects', () => {
    const obj = {
      foo: 'bar',
      baz: 'quaxx',
      cheese: 'I don\'t like it.',
      deep: {
        deepdeep: {
          depth: 'deeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeep'
        }
      }
    }
    const errors = []
    try {
      deepFreeze(obj)
      errors.push(null)
    } catch (ex) {
      errors.push(ex)
    }
    Object.keys(obj).forEach(key => {
      try {
        obj[key] = null
      } catch (ex) {
        errors.push(ex)
      }
    })

    expect(errors.shift()).toBe(null)
    expect(errors.every(val => val instanceof TypeError)).toBe(true)
  })
  it('should be able to generate IDs', async () => {
    console.log()
    const idLength = 36
    const ids = await Promise.all(
      Array.apply(null, { length: 100 }).map(val => {
        return (val = utils.genID(idLength))
      })
    )
    const idSet = new Set(ids)
    // console.dir(ids)
    // console.dir(idSet)
    expect(ids.length).toBe(idSet.size)
  })
})
