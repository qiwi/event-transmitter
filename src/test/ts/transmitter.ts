import { createTransmitter } from '../../main/ts/transmitter'
import { createHttpPipe } from '../../main/ts/pipes/http'
import { HttpMethod } from '@qiwi/substrate-types'

import 'cross-fetch/polyfill'

describe('transmitter', () => {
  it('processes input through a pipeline', async () => {
    const batchUrl = 'https://reqres.in/api/unknown'
    const httpPipe = createHttpPipe({ url: 'https://reqres.in/api/users', batchUrl, method: HttpMethod.POST })
    const transmitter = createTransmitter({
      pipeline: [httpPipe],
    })
    const data = {
      name: 'morpheus',
      job: 'leader',
    }
    const [err, json] = await transmitter.push(data)

    expect(err).toBeNull()
    expect(json).toMatchObject({
      id: expect.any(String),
      createdAt: expect.any(String),
    })
  })
})
