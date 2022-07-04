import { test } from 'uvu'
import * as assert from 'uvu/assert'

import {
  createFlpPipeline,
  createTransmittable,
  createTransmitter,
  eventifyPipe,
} from '../../../main/ts/index'

const noop = () => {
  /* noop */
}

const stacktracer = (el: any) => {
  if (el) {
    if (Array.isArray(el)) {
      el.forEach((el: any) => el.stacktrace)
    } else if (el.stacktrace) {
      el.stacktrace = ''
    }
  }
  return el
}

const cases: Array<[string, any, any, any]> = [
  [
    'processes string input',
    'foo',
    null,
    { level: 'info', message: 'foo', meta: {} },
  ],
  [
    'processes error as input',
    new Error('foobar'),
    null,
    { level: 'error', message: 'foobar', meta: {}, stacktrace: '' },
  ],
  [
    'returns err if no arg passed',
    undefined,
    new Error('Event message must not be empty'),
    null,
  ],
  [
    'verifies events batch not to be empty',
    [],
    new Error('Events array must not be empty'),
    null,
  ],
  [
    'supports events batches',
    ['foo', { level: 'info', message: 'bar', meta: {} }],
    null,
    {
      events: [
        { level: 'info', message: 'foo', meta: {} },
        { level: 'info', message: 'bar', meta: {} },
      ],
    },
  ],
  [
    'assures message not to be empty',
    '',
    new Error('Event message must not be empty'),
    null,
  ],
]

cases.forEach(([name, input, err, data]) => {
  test(name, async () => {
    const res = await eventifyPipe.execute(createTransmittable(input), noop)
    assert.equal([stacktracer(res[0]), stacktracer(res[1])], [err, data])
  })
})

test('eventifyPipe adds stack trace when processes error', async () => {
  const error = new Error('bar')
  const [, output] = await eventifyPipe.execute(
    createTransmittable(error),
    noop,
  )

  assert.ok(output.stacktrace)
})

test('flpPipeline createFlpPipeline factory returns a pipeline', () => {
  const batchUrl = 'https://reqres.in/api/unknown'

  assert.instance(
    createFlpPipeline({
      url: 'https://reqres.in/api/users/2',
      // @ts-ignore
      method: 'GET',
      batchUrl,
    }),
    Array,
  )
})

test('flpPipeline executes eventify, masker and http pipes consequentially with batch', async () => {
  const batchUrl = 'https://reqres.in/api/unknown'
  const url = 'https://reqres.in/api/unknown'

  const flpPipeline = createFlpPipeline({
    url,
    // @ts-ignore
    method: 'POST',
    batchUrl,
  })
  const transmitter = createTransmitter({
    pipeline: flpPipeline,
  })

  const res = await transmitter.push(['4539246180805047', '5101754226671617'])
  assert.equal(res, [null, ['4539 **** **** 5047', '5101 **** **** 1617']])
})

test('flpPipeline executes eventify, masker and http pipes consequentially', async () => {
  const batchUrl = 'https://reqres.in/api/unknown'
  const url = 'https://reqres.in/api/unknown'

  const flpPipeline = createFlpPipeline({
    url,
    // @ts-ignore
    method: 'POST',
    batchUrl,
  })
  const transmitter = createTransmitter({
    pipeline: flpPipeline,
  })
  const res = await transmitter.push('0000000000000000')
  assert.equal(res, [null, '0000 **** **** 0000'])
})

test('flpPipeline executes eventify, masker and http pipes consequentially with object', async () => {
  const batchUrl = 'https://reqres.in/api/unknown'
  const url = 'https://reqres.in/api/unknown'

  const flpPipeline = createFlpPipeline({
    url,
    // @ts-ignore
    method: 'POST',
    batchUrl,
  })
  const transmitter = createTransmitter({
    pipeline: flpPipeline,
  })
  const res = await transmitter.push({ data: 'data', message: 'message' })

  assert.equal(res, [null, { data: 'data', message: 'message' }])
})

test('flpPipeline executes eventify, masker and http pipes consequentially with Error', async () => {
  const batchUrl = 'https://reqres.in/api/unknown'
  const url = 'https://reqres.in/api/unknown'

  const flpPipeline = createFlpPipeline({
    url,
    // @ts-ignore
    method: 'POST',
    batchUrl,
  })
  const transmitter = createTransmitter({
    pipeline: flpPipeline,
  })
  const res = await transmitter.push(new Error('0000000000000000'))
  assert.equal(res, [null, new Error('0000 **** **** 0000')])
})

test.run()
