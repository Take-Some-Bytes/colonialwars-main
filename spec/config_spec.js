/* eslint-env jasmine */
/**
 * @fileoverview Test Configurations class.
 */

const path = require('path')
const Configurations = require('../lib/utils/configurations')

describe('Basic tests for Configurations class', () => {
  let configurations = null
  let err = null

  it('should construct without error', () => {
    try {
      configurations = new Configurations({
        crud: [
          'cREATE', 'rEAD', 'uPDATE', 'dELETE'
        ],
        data: {
          trash: true,
          recyclable: false,
          message: "Don't recycle this trash."
        }
      })
    } catch (ex) {
      err = ex
    }
    expect(err).toBe(null)
    expect(configurations).toBeInstanceOf(Configurations)
  })

  it('should get existing properties and return them', () => {
    let val = null
    console.log()
    if (configurations instanceof Configurations) {
      val = configurations.get('crud')
      console.log(val)
    }
    expect(val).not.toBe(null)
  })

  it('should return null for non-existing properties', () => {
    let val = null
    console.log()
    if (configurations instanceof Configurations) {
      val = configurations.get('i', "don't", 'exist')
      console.log(val)
    }
    expect(val).toBe(null)
  })
})

describe('Tests that use a file for Configurations class.', () => {
  let configurations = null
  let err = null

  it('should create without error', async () => {
    try {
      configurations = await Configurations.readFrom(
        path.join(__dirname, 'mocks/external', 'mock-config.json')
      )
    } catch (er) {
      err = er
    }
    expect(err).toBe(null)
    expect(configurations).toBeInstanceOf(Configurations)
  })

  it('should get existing properties and return them', () => {
    let vals = null
    console.log()
    if (configurations instanceof Configurations) {
      vals = []
      vals.push(configurations.get('This'))
      console.dir(vals)
      vals.push(configurations.get('mock'))
      console.dir(vals)
    }
    expect(vals).not.toBe(null)
    expect(vals).toHaveSize(2)
  })

  it('should return null for non-existing properties', () => {
    let val = null
    console.log()
    if (configurations instanceof Configurations) {
      val = configurations.get('i', 'still', "don't", 'exist')
      console.log(val)
    }
    expect(val).toBe(null)
  })
})

describe('Tests with fallbacks.', () => {
  let configurations = null
  let err = null

  it('should create without error', async () => {
    try {
      configurations = await Configurations.readFrom(
        '',
        { fellback: true, That: 'Not this, THAT' }
      )
    } catch (er) {
      err = er
    }
    expect(err).toBe(null)
    expect(configurations).toBeInstanceOf(Configurations)
  })

  it('should get existing properties and return them', () => {
    let vals = null
    console.log()
    if (configurations instanceof Configurations) {
      vals = []
      vals.push(configurations.get('That'))
      console.dir(vals)
      vals.push(configurations.get('fellback'))
      console.dir(vals)
    }
    expect(vals).not.toBe(null)
    expect(vals).toHaveSize(2)
  })

  it('should return null for non-existing properties', () => {
    let val = null
    console.log()
    if (configurations instanceof Configurations) {
      val = configurations.get('i', 'am', 'a', 'teapot')
      console.log(val)
    }
    expect(val).toBe(null)
  })
})
