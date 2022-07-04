import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { createHttpPipe, ITransmittable } from '../../../main/ts/index'

const noop = () => {
  /* noop */
}

// @ts-ignore
global.fetch = async (...data: any[]) => ({
  ok: data,
  json: async () => ({ data }),
})

test('httpPipe factory returns IPipe', () => {
  const httpPipe = createHttpPipe({
    url: 'https://reqres.in/api/users/2',
    // @ts-ignore
    method: 'GET',
  })

  assert.is(httpPipe.type, 'http')
  assert.instance(httpPipe.execute, Function)
})

test('httpPipe returns remote data if succeeds', async () => {
  const httpPipe = createHttpPipe({
    url: 'https://reqres.in/api/users/2',
    // @ts-ignore
    method: 'GET',
  })
  const transmittable: ITransmittable = { data: null, meta: { history: [] } }

  assert.equal(await httpPipe.execute(transmittable, noop), [
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

test('httpPipe execute functions passed in header', async () => {
  const httpPipe = createHttpPipe({
    url: 'https://reqres.in/api/users/1',
    // @ts-ignore
    method: 'GET',
    headers: {
      a: 'foo',
      b: () => 'bar',
    },
  })
  const transittable: ITransmittable = {
    data: { message: 'bar' },
    meta: { history: [] },
  }

  assert.equal(await httpPipe.execute(transittable, noop), [
    null,
    {
      data: [
        'https://reqres.in/api/users/1',
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', a: 'foo', b: 'bar' },
          body: '{"message":"bar"}',
        },
      ],
    },
  ])
})

test('httpPipe returns an error otherwise', async () => {
  const error = new Error('test')
  // @ts-ignore
  global.fetch = async () => Promise.reject(error)

  const httpPipe = createHttpPipe({
    url: 'foobar',
    // @ts-ignore
    method: 'GET',
  })
  const transittable: ITransmittable = { data: null, meta: { history: [] } }

  const res = await httpPipe.execute(transittable, noop)
  assert.is(res[0], error)
})

test.run()
