// import 'cross-fetch/polyfill'

import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { createHttpPipe, createTransmitter } from '../../main/ts/index'

// @ts-ignore
global.fetch = async (...data: any[]) => ({
  ok: data,
  json: async () => ({ data }),
})

test('transmitter processes input through a pipeline', async () => {
  // @ts-ignore
  global.fetch = async (...data: any[]) => ({
    ok: data,
    json: async () => ({ data }),
  })

  const httpPipe = createHttpPipe({
    url: 'https://reqres.in/api/users',
    // @ts-ignore
    method: 'POST',
  })
  const transmitter = createTransmitter({
    pipeline: [httpPipe],
  })
  const data = {
    name: 'morpheus',
    job: 'leader',
  }
  const [err, json] = await transmitter.push(data)

  assert.equal(err, null)
  assert.is(json.data[1].body, '{"name":"morpheus","job":"leader"}')
})

test.run()
