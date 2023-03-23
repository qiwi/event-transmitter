import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { createFrontLogProxyTransmitter } from '../../main/ts/index'
// @ts-ignore
global.document = {
  cookie: '',
}

// @ts-ignore
global.window = {
  // @ts-ignore
  navigator: {
    userAgent: '',
  },
  // @ts-ignore
  location: {
    href: 'https://github.com/qiwi/event-transmitter',
  },
}

// @ts-ignore
global.fetch = async (...data: any[]) => ({
  ok: data,
  json: async () => ({ data }),
})

test('createFrontLogProxyTransmitter correctly call fetch with data', async () => {
  const transmitter = createFrontLogProxyTransmitter({
    appName: 'testApp',
    url: 'https://reqres.in/api/users/2',
  })

  const [, res] = await transmitter.info({
    message: 'my-info-message',
    details: { 'my-custom-info': 'foo' },
    ttl: 14,
    meta: { appVersion: '1.0.0' },
    code: '211',
    tags: ['frontend', 'qiwi'],
  })
  res.details.appContextId = ''
  res.details.clientId = ''

  assert.equal(res, {
    message: 'my-info-message',
    details: {
      'my-custom-info': 'foo',
      appContextId: '',
      clientId: '',
    },
    ttl: 14,
    meta: { appVersion: '1.0.0', appName: 'testApp' },
    code: '211',
    tags: ['frontend', 'qiwi'],
    level: 'info',
  })
})

test('createFrontLogProxyTransmitter correctly call fetch with Error', async () => {
  const transmitter = createFrontLogProxyTransmitter({
    appName: 'testApp',
    url: 'https://reqres.in/api/users/2',
  })
  try {
    // @ts-ignore
    undefined()
  } catch (e) {
    const [, res] = await transmitter.info({
      message: e as Error,
      details: { 'my-custom-info': 'foo' },
      ttl: 14,
      meta: { appVersion: '1.0.0' },
      code: '211',
      tags: ['frontend', 'qiwi'],
    })

    assert.ok(res.stacktrace.length > 1)
    assert.match(res.message, 'is not a function')

    res.details.appContextId = ''
    res.details.clientId = ''
    res.stacktrace = ''
    res.message = ''

    assert.equal(res, {
      message: '',
      details: {
        'my-custom-info': 'foo',
        appContextId: '',
        clientId: '',
      },
      ttl: 14,
      meta: { appVersion: '1.0.0', appName: 'testApp' },
      code: '211',
      tags: ['frontend', 'qiwi'],
      level: 'info',
      stacktrace: '',
    })
  }
})

test('createFrontLogProxyTransmitter does not throw an error on several calls', async () => {
  const transmitter = createFrontLogProxyTransmitter({
    appName: 'testApp',
    url: 'https://reqres.in/api/users/2',
  })

  const callAndCheck = async (message: string) => {
    const [err, res] = await transmitter.info({ message })
    assert.equal(res.message, message)
    assert.equal(err, null)
  }

  await callAndCheck('foo')
  await callAndCheck('bar')
  await callAndCheck('baz')
})

test('createFrontLogProxyTransmitter accepts error as input', async () => {
  const transmitter = createFrontLogProxyTransmitter({
    appName: 'testApp',
    url: 'https://reqres.in/api/users/2',
  })

  const error = new Error('foo')
  const [err, res] = await transmitter.error(error)
  assert.equal(err, null)
  assert.equal(res.message, error.message)
  assert.equal(res.stacktrace, error.stack)
  assert.ok(res.details.clientId)
  assert.ok(res.details.appContextId)
  assert.equal(res.meta, { appName: 'testApp' })
  assert.equal(res.level, 'error')
})

test('createFrontLogProxyTransmitter does not throw on invalid arg type', async () => {
  const transmitter = createFrontLogProxyTransmitter({
    appName: 'testApp',
    url: 'https://reqres.in/api/users/2',
  })

  await assert.not.throws(async () => {
    // @ts-ignore
    await transmitter.info(undefined) // eslint-disable-line unicorn/no-useless-undefined
  })
  await assert.not.throws(async () => {
    // @ts-ignore
    await transmitter.info(null)
  })
})

test('createFrontLogProxyTransmitter accepts string', async () => {
  const transmitter = createFrontLogProxyTransmitter({
    appName: 'testApp',
    url: 'https://reqres.in/api/users/2',
  })

  const [err, res] = await transmitter.info('string')
  assert.equal(err, null)
  assert.equal(res.message, 'string')
  assert.ok(res.details.clientId)
  assert.ok(res.details.appContextId)
  assert.equal(res.meta, { appName: 'testApp' })
  assert.equal(res.level, 'info')
})

test('createFrontLogProxyTransmitter accepts number', async () => {
  const transmitter = createFrontLogProxyTransmitter({
    appName: 'testApp',
    url: 'https://reqres.in/api/users/2',
  })

  const [err, res] = await transmitter.info(42)
  assert.equal(err, null)
  assert.equal(res.message, 42)
  assert.ok(res.details.clientId)
  assert.ok(res.details.appContextId)
  assert.equal(res.meta, { appName: 'testApp' })
  assert.equal(res.level, 'info')
})

test('createFrontLogProxyTransmitter accepts boolean', async () => {
  const transmitter = createFrontLogProxyTransmitter({
    appName: 'testApp',
    url: 'https://reqres.in/api/users/2',
  })

  const [err, res] = await transmitter.info(true)
  assert.equal(err, null)
  assert.equal(res.message, 'true')
  assert.ok(res.details.clientId)
  assert.ok(res.details.appContextId)
  assert.equal(res.meta, { appName: 'testApp' })
  assert.equal(res.level, 'info')
})

test.run()
