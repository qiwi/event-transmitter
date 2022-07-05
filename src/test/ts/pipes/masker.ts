import { test } from 'uvu'
import * as assert from 'uvu/assert'

import {
  createMaskerPipe,
  ITransmittable,
  panMaskerPipe,
} from '../../../main/ts/index'

const noop = () => {
  /* noop */
}

test('maskerPipe factory returns IPipe', () => {
  const maskerPipe = createMaskerPipe((el: any) => el)

  assert.is(maskerPipe.type, 'masker')
  assert.instance(maskerPipe.execute, Function)
})

test('maskerPipe returns masked elements', async () => {
  const maskerPipe = createMaskerPipe(
    (el: { toString: () => string }) => el.toString() + 'masked',
  )
  const transmittable: ITransmittable = {
    data: ['foo', 'bar', ['foo2', ['foo3']]],
    meta: { history: [] },
  }
  assert.equal(await maskerPipe.execute(transmittable, noop), [
    null,
    ['foomasked', 'barmasked', ['foo2masked', ['foo3masked']]],
  ])
})

test('maskerPipe returns masked elements', async () => {
  const transmittable: ITransmittable = {
    data: [
      '4111111111111111',
      'bar',
      ['4111111111111111', ['foo3', '0000000000000000']],
    ],
    meta: { history: [] },
  }
  assert.equal(await panMaskerPipe.execute(transmittable, noop), [
    null,
    [
      '4111 **** **** 1111',
      'bar',
      ['4111 **** **** 1111', ['foo3', '0000 **** **** 0000']],
    ],
  ])
})

test.run()
