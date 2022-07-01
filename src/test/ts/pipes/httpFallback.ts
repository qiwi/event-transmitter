import { test } from 'uvu'
import * as assert from 'uvu/assert'

import {
  createHttpPipeFallback,
  ITransmittable,
} from '../../../main/ts/index'

const noop = () => {
  /* noop */
}

// @ts-ignore
global.fetch = async (...data: any[]) => ({
  ok: data,
  json: async () => ({ data }),
})

test('factory returns IPipe', () => {
  const httpPipeFallback = createHttpPipeFallback([
    {
      url: 'https://reqres.in/api/users/2',
      // @ts-ignore
      method: 'GET',
    },
  ])
  assert.is(httpPipeFallback.type, 'http-fallback')
  assert.instance(httpPipeFallback.execute, Function)
})

test('returns remote data if succeeds', async () => {
  // @ts-ignore
  global.fetch = async (...data: any[]) => ({
    ok: data,
    json: async () => ({ data }),
  })

  const httpPipe = createHttpPipeFallback([
    {
      url: 'https://reqres.in/api/users/2',
      // @ts-ignore
      method: 'GET',
    },
  ])
  const transmittable: ITransmittable = { data: null, meta: { history: [] } }

  return assert.equal(await httpPipe.execute(transmittable, noop), [
    null,
    {
      data: [
        'https://reqres.in/api/users/2',
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          body: null,
        },
      ],
    },
  ])
})

test('uses fallback urls', async () => {
  const httpPipe = createHttpPipeFallback([
    {
      url: 'https://reqres.in/api/users/23',
      // @ts-ignore
      method: 'GET',
    },
    {
      url: 'https://reqres.in/api/unknown/23',
      // @ts-ignore
      method: 'GET',
    },
    {
      url: 'https://reqres.in/api/users/2',
      // @ts-ignore
      method: 'GET',
    },
  ])
  const transmittable: ITransmittable = { data: null, meta: { history: [] } }

  return assert.equal(await httpPipe.execute(transmittable, noop), [null,{"data":["https://reqres.in/api/users/2",{"method":"GET","headers":{"Content-Type":"application/json"},"body":null}]}])
})


test('throw error when opts is empty', () => {
  return assert.throws(() => createHttpPipeFallback([]), new Error('createHttpPipeFallback opts must not be empty'))
})

test.run()
