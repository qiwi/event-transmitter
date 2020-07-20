import { eventifyPipe, createFlpPipeline, createTransmittable, createTransmitter } from '../../../main/ts'

import { HttpMethod } from '@qiwi/substrate'
import StackTrace from 'stacktrace-js'

import 'cross-fetch/polyfill'

const noop = () => { /* noop */ }

describe('eventifyPipe', () => {
  const cases: Array<[string, any, any, any]> = [
    ['processes string input', 'foo', null, { level: 'info', message: 'foo', meta: {} }],
    ['processes error as input', new Error('foobar'), null, { level: 'error', message: 'foobar', meta: {} }],
    ['returns err if no arg passed', undefined, new Error('Event message must not be empty'), null],
    ['verifies events batch not to be empty', [], new Error('Events array must not be empty'), null],
    ['errors in array', [undefined, []], [
      new Error('Event message must not be empty'),
      new Error('Events array must not be empty'),
    ], null],
    ['supports events batches', ['foo', { level: 'info', message: 'bar', meta: {} }], null, {
      events: [
        { level: 'info', message: 'foo', meta: {} },
        { level: 'info', message: 'bar', meta: {} },
      ],
    }],
    ['assures message not to be empty', '', new Error('Event message must not be empty'), null],
  ]

  cases.forEach(([name, input, err, data]) => {
    it(name, async () => {
      expect(await eventifyPipe.execute(createTransmittable(input), noop)).toMatchObject([err, data])
    })
  })

  it('adds stack trace when processes error', async () => {
    const spy = jest.spyOn(StackTrace, 'fromError')

    const error = new Error('bar')
    const [, output] = await eventifyPipe.execute(createTransmittable(error), noop)
    expect(output.stacktrace).toBeDefined()
    expect(output.stacktrace).not.toHaveLength(0)
    expect(spy).toHaveBeenCalledWith(error)

    spy.mockClear()
  })
})

describe('flpPipeline', () => {
  const url = 'https://reqres.in/api/users/'
  const batchUrl = 'https://reqres.in/api/unknown'

  it('createFlpPipeline factory returns a pipeline', () => {
    expect(createFlpPipeline(
      { url: 'https://reqres.in/api/users/2', method: HttpMethod.GET, batchUrl })).toEqual(expect.any(Array))
  })

  it('executes eventify, masker and http pipes consequentially with batch', async () => {
    const spy = jest.spyOn(window, 'fetch')
    const flpPipeline = createFlpPipeline({ url, method: HttpMethod.POST, batchUrl })
    const transmitter = createTransmitter({
      pipeline: flpPipeline,
    })
    const res = await transmitter.push(['4539246180805047', '5101754226671617'])

    expect(res).toEqual([null, ['4539 **** **** 5047', '5101 **** **** 1617']])
    expect(spy).toHaveBeenCalledWith(batchUrl, {
      method: HttpMethod.POST,
      body: JSON.stringify({
        events: [{
          message: '4539 **** **** 5047',
          meta: {},
          level: 'info',
        }, {
          message: '5101 **** **** 1617',
          meta: {},
          level: 'info',
        }],
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    spy.mockClear()
  })

  it('executes eventify, masker and http pipes consequentially', async () => {
    const spy = jest.spyOn(window, 'fetch')
    const flpPipeline = createFlpPipeline({ url, method: HttpMethod.POST, batchUrl })
    const transmitter = createTransmitter({
      pipeline: flpPipeline,
    })
    const res = await transmitter.push('0000000000000000')

    expect(res).toEqual([null, '0000 **** **** 0000'])
    expect(spy).toHaveBeenCalledWith(url, {
      method: HttpMethod.POST,
      body: JSON.stringify({
        message: '0000 **** **** 0000',
        meta: {},
        level: 'info',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    spy.mockClear()
  })

  it('executes eventify, masker and http pipes consequentially with object', async () => {
    const spy = jest.spyOn(window, 'fetch')
    const flpPipeline = createFlpPipeline({ url, method: HttpMethod.POST, batchUrl })
    const transmitter = createTransmitter({
      pipeline: flpPipeline,
    })
    const res = await transmitter.push({ data: 'data', message: 'message' })

    expect(res).toEqual([null, { data: 'data', message: 'message' }])
    expect(spy).toHaveBeenCalledWith(url, {
      method: HttpMethod.POST,
      body: JSON.stringify({
        message: 'message',
        meta: {},
        level: 'info',
        data: 'data',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    spy.mockClear()
  })

  it('executes eventify, masker and http pipes consequentially with Error', async () => {
    const flpPipeline = createFlpPipeline({ url, method: HttpMethod.POST, batchUrl })
    const transmitter = createTransmitter({
      pipeline: flpPipeline,
    })
    const res = await transmitter.push(new Error('0000000000000000'))
    expect(res).toMatchObject([null, new Error('0000 **** **** 0000')])
  })
})
