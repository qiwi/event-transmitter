import { HttpMethod } from '@qiwi/substrate-types'
import { createHttpPipeFallback, ITransmittable } from '../../../main/ts'

import 'cross-fetch/polyfill'

const noop = () => { /* noop */ }

describe('httpPipe', () => {
  it('factory returns IPipe', () => {
    const httpPipeFallback = createHttpPipeFallback([{ url: 'https://reqres.in/api/users/2', method: HttpMethod.GET }])
    expect(httpPipeFallback.type).toBe('http-fallback')
    expect(httpPipeFallback.execute).toEqual(expect.any(Function))
  })

  it('returns remote data if succeeds', async () => {
    const httpPipe = createHttpPipeFallback([{ url: 'https://reqres.in/api/users/2', method: HttpMethod.GET }])
    const transmittable: ITransmittable = { data: null, meta: { history: [] } }

    return expect(httpPipe.execute(transmittable, noop))
      .resolves.toMatchObject([null, {
        data: {
          id: 2,
          email: 'janet.weaver@reqres.in',
          first_name: 'Janet',
          last_name: 'Weaver',
          avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg',
        },
      }])
  })

  it('uses fallback urls', () => {
    const httpPipe = createHttpPipeFallback([
      { url: 'https://reqres.in/api/users/23', method: HttpMethod.GET },
      { url: 'https://reqres.in/api/unknown/23', method: HttpMethod.GET },
      { url: 'https://reqres.in/api/users/2', method: HttpMethod.GET },
    ])
    const transmittable: ITransmittable = { data: null, meta: { history: [] } }

    return expect(httpPipe.execute(transmittable, noop))
      .resolves.toMatchObject([null, {
        data: {
          id: 2,
          email: 'janet.weaver@reqres.in',
          first_name: 'Janet',
          last_name: 'Weaver',
          avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg',
        },
      }])
  })

  it('handle errors', () => {
    const httpPipe = createHttpPipeFallback([
      { url: 'https://reqres.in/api/users/23', method: HttpMethod.GET },
      { url: 'https://reqres.in/api/unknown/23', method: HttpMethod.GET },
      { url: 'https://reqres.in/api/users/23', method: HttpMethod.GET },
    ])
    const transmittable: ITransmittable = { data: null, meta: { history: [] } }

    return expect(httpPipe.execute(transmittable, noop))
      .resolves.toEqual([new Error('Not Found'), null])
  })

  it('throw error when opts is empty', () => {
    return expect(() => createHttpPipeFallback([]))
      .toThrow(new Error('createHttpPipeFallback opts must not be empty'))
  })
})
