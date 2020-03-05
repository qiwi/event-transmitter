import {eventifyPipe, createFlpPipeline} from '../../../main/ts/pipes/flp'
import {createTransmittable, createTransmitter} from '../../../main/ts'
import {HttpMethod} from '@qiwi/substrate'

import 'cross-fetch/polyfill'

describe('eventifyPipe', () => {
  const noop = () => { /* noop */ }

  const cases: Array<[string, any, any, any]> = [
    ['processes string input', 'foo', null, {
      level: 'info',
      message: 'foo',
      meta: {},
    }],
    ['processes error as input', new Error('foobar'), null, {
      level: 'error',
      message: 'foobar',
      meta: {},
    }],
    ['returns err if no arg passed', undefined, new Error('Event message must not be empty'), null],
    ['does not processes arrays', [], new Error('Event batches are not supported yet'), null],
    ['assures message not to be empty', '', new Error('Event message must not be empty'), null],
  ]

  cases.forEach(([name, input, err, data]) => {
    it(name, async () => {
      expect(await eventifyPipe.execute(createTransmittable(input), noop)).toEqual([err, data])
    })
  })
})

describe('flpPipeline', () => {

  it('createFlpPipeline factory returns a pipeline', () => {
    expect(createFlpPipeline({ url: 'https://reqres.in/api/users/2', method: HttpMethod.GET })).toEqual(expect.any(Array))
  })

  it('executes eventify, masker and http pipes consequentially', async () => {
    const spy = jest.spyOn(window, 'fetch')
    const flpPipeline = createFlpPipeline({
      url: 'https://reqres.in/api/users/',
      method: HttpMethod.POST
    })
    const transmitter = createTransmitter({
      pipeline: flpPipeline
    })
    const res = await transmitter.push('0000000000000000')

    expect(res).toEqual([null, '0000 **** **** 0000'])
    expect(spy).toHaveBeenCalledWith('https://reqres.in/api/users/', {
      method: HttpMethod.POST,
      body: JSON.stringify({
        message: '0000 **** **** 0000',
        meta: {},
        level: 'info',
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    spy.mockClear()
  })
})
