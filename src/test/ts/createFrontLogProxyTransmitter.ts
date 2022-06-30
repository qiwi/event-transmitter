import 'cross-fetch/polyfill'

import { createFrontLogProxyTransmitter } from '../../main/ts'

describe('createFrontLogProxyTransmitter', () => {
  jest.setTimeout(20000)

  // beforeAll(()=>{
  //   // @ts-ignore
  //   // eslint-disable-next-line no-global-assign
  //   fetch = async (...args) => {
  //     console.log('this fetch2', args)
  //     return args
  //   }
  // })

  it('correctly call fetch with data', async () => {
    const transmitter = createFrontLogProxyTransmitter('testApp', 'https://reqres.in/api/users/2')
    const [, res] = await transmitter.info({
      message: 'my-info-message',
      details: { 'my-custom-info': 'foo' },
      ttl: 14,
      meta: { appVersion: '1.0.0' },
      code: '211',
      tags: ['frontend', 'qiwi'],
    })

    expect(res).toMatchObject({
        message: 'my-info-message',
        details: {
          'my-custom-info': 'foo',
          appContextId: expect.any(String),
          clientId: expect.any(String),
        },
        ttl: '14',
        meta: { appVersion: '1.0.0', appName: 'testApp' },
        code: '211',
        tags: [ 'frontend', 'qiwi' ],
        level: 'info'
      }
    )
  })

  it('correctly call fetch with Error', async () => {
    const transmitter = createFrontLogProxyTransmitter('testApp', 'https://reqres.in/api/users/2')
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

      expect(res).toMatchObject({
        message: 'undefined is not a function',
        details: {
          'my-custom-info': 'foo',
          appContextId: expect.any(String),
          clientId: expect.any(String),
        },
        ttl: '14',
        meta: { appVersion: '1.0.0', appName: 'testApp' },
        code: '211',
        tags: [ 'frontend', 'qiwi' ],
        level: 'info',
        stacktrace: expect.any(String)
      })
    }
  })
})
