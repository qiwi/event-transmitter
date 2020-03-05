import {eventifyPipe} from '../../../main/ts/pipes/flp'
import {createTransmittable} from '../../../main/ts/transmitter'

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
