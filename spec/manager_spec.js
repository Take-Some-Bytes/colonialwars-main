/* eslint-env jasmine */
/**
 * @fileoverview Tests for the Colonial Wars Manager.
 */

const childProcess = require('child_process')
const http = require('http')

const ColonialwarsManager = require('../')
const fetch = require('./helpers/fetch')

/**
 * Promise delay.
 * @param {number} time The time to delay for.
 */
const delay = (time) => new Promise(resolve => setTimeout(resolve, time))

describe('The ColonialwarsManager class,', () => {
  let cwManager = null
  let appProc = null

  afterAll(() => {
    if (cwManager instanceof ColonialwarsManager) {
      cwManager.stopAll('SIGINT')
    }
  })

  it('should construct without error', async () => {
    let err = null
    try {
      cwManager = await ColonialwarsManager.create()
    } catch (ex) {
      err = null
    }

    expect(err).toBe(null)
    expect(cwManager).toBeInstanceOf(ColonialwarsManager)
  })

  it('should be able to spawn Colonialwars app processes', async () => {
    if (cwManager instanceof ColonialwarsManager) {
      appProc = await cwManager.addAppProcess()
    }

    expect(appProc.proc).toBeInstanceOf(childProcess.ChildProcess)
    expect(appProc.proc.connected).toBe(true)
  })

  it('should be able to limit how many apps are spawned', async () => {
    let err = null
    console.log()
    try {
      if (cwManager instanceof ColonialwarsManager) {
        await cwManager.addAppProcess()
      }
    } catch (ex) {
      err = ex
    }

    expect(err).toBeInstanceOf(Error)
    expect(err.message).toBe('Maximum app server amount reached!')
  })
})

describe('The ColonialwarsManager class, when managng processes,', () => {
  let cwManager = null

  beforeAll(async () => {
    cwManager = await ColonialwarsManager.create()
  })
  afterAll(async () => {
    if (cwManager instanceof ColonialwarsManager) {
      cwManager.stopAll('SIGINT')
    }
  })

  it('should be able to spawn an appserver process', async () => {
    let appProc = null
    if (cwManager instanceof ColonialwarsManager) {
      appProc = await cwManager.addAppProcess()
    }

    expect(appProc.proc).toBeInstanceOf(childProcess.ChildProcess)
    expect(appProc.proc.connected).toBe(true)
    // Delay to give the process time to actually start up.
    await delay(1000)
  })

  it('should have the appserver to be able to respond', async () => {
    console.log()
    const res = await fetch('http://localhost:7000/')

    expect(res.meta).toBeInstanceOf(http.IncomingMessage)
    expect(res.meta.statusCode).toBe(200)
    expect(res.body).toBeInstanceOf(Buffer)
  })
})
