import { HttpMethod } from '@qiwi/substrate-types'
import { createHttpPipe, ITransmittable } from '../../../main/ts'

import 'cross-fetch/polyfill'

const noop = () => { /* noop */ }

describe('httpPipe', () => {
  const batchUrl = 'https://reqres.in/api/unknown'

  it('factory returns IPipe', () => {
    const httpPipe = createHttpPipe({ url: 'https://reqres.in/api/users/2', batchUrl, method: HttpMethod.GET })

    expect(httpPipe.type).toBe('http')
    expect(httpPipe.execute).toEqual(expect.any(Function))
  })

  it('returns remote data if succeeds', () => {
    const httpPipe = createHttpPipe({ url: 'https://reqres.in/api/users/2', batchUrl, method: HttpMethod.GET })
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

  it('execute functions passed in header', async () => {
    const spy = jest.spyOn(window, 'fetch')

    const httpPipe = createHttpPipe({
      url: 'https://reqres.in/api/users/1',
      batchUrl,
      method: HttpMethod.GET,
      headers: {
        a: 'foo',
        b: () => 'bar',
      },
    })
    const transittable: ITransmittable = { data: { message: 'bar' }, meta: { history: [] } }

    await httpPipe.execute(transittable, noop)
    expect(spy).toHaveBeenCalledWith('https://reqres.in/api/users/1', {
      method: HttpMethod.GET,
      body: '{"message":"bar"}',
      headers: {
        'Content-Type': 'application/json',
        a: 'foo',
        b: 'bar',
      },
    })

    spy.mockClear()
  })

  it('handles 4** status as error', () => {
    const httpPipe = createHttpPipe({ url: 'https://github.com', batchUrl, method: HttpMethod.POST })
    const transittable: ITransmittable = { data: 'test', meta: { history: [] } }

    return expect(httpPipe.execute(transittable, noop))
      .resolves.toEqual([new Error('Not Found'), null])
  })

  it('returns an error otherwise', () => {
    const httpPipe = createHttpPipe({ url: 'foobar', batchUrl, method: HttpMethod.GET })
    const transittable: ITransmittable = { data: null, meta: { history: [] } }

    return expect(httpPipe.execute(transittable, noop))
      .resolves.toEqual([new TypeError('Only absolute URLs are supported'), null])
  })
})
