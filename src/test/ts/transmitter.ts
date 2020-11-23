import 'cross-fetch/polyfill'

import { HttpMethod } from '@qiwi/substrate'

import { createHttpPipe } from '../../main/ts/pipes/http'
import { createTransmitter } from '../../main/ts/transmitter'

describe('transmitter', () => {
  it('processes input through a pipeline', async () => {
    const httpPipe = createHttpPipe({ url: 'https://reqres.in/api/users', method: HttpMethod.POST })
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
