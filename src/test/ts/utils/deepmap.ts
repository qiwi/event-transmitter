import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { deepMap } from '../../../main/ts/utils/index'

test('deepMap handle object', () => {
  const testObj = {
    a: 1,
    length: 9,
    b: [
      1,
      2,
      {
        c: 4,
        d: {
          e: 6,
          f: [7, 8],
        },
      },
    ],
  }

  assert.equal(
    deepMap(testObj, (el) => Number(el) * 10),
    {
      a: 10,
      length: 90,
      b: [
        10,
        20,
        {
          c: 40,
          d: {
            e: 60,
            f: [70, 80],
          },
        },
      ],
    },
  )
})

test('deepMap handle error objects', () => {
  const testObj = new Error('1')

  assert.equal(
    deepMap(testObj, (el) => Number(el) * 10),
    new Error('10'),
  )
})

test('deepMap handles accessor property descriptor', async () => {
  const objectWithDataPropertyDescriptor = {}
  Object.defineProperty(objectWithDataPropertyDescriptor, 'bar', { value: 42  })
  assert.equal(
    deepMap(objectWithDataPropertyDescriptor, (el) => el + 'foo').bar,
    '42foo',
  )

  const objectWithAccessorPropertyDescriptor = {}
  Object.defineProperty(objectWithAccessorPropertyDescriptor, 'bar', { get: () => 42  })
  assert.equal(
    deepMap(objectWithAccessorPropertyDescriptor, (el) => el + 'foo').bar,
    '42foo',
  )
})

test.run()
