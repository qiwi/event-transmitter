import { test } from 'uvu'
import * as assert from 'uvu/assert'

import {
  createFlpPipeline,
  createFrontLogProxyTransmitter,
  createHttpPipe,
  createMaskerPipe,
  createTransmittable,
  createTransmitter,
} from '../../main/ts/index'

test('index has proper export', () => {
  assert.instance(createTransmitter, Function)
  assert.instance(createHttpPipe, Function)
  assert.instance(createFlpPipeline, Function)
  assert.instance(createTransmittable, Function)
  assert.instance(createMaskerPipe, Function)
  assert.instance(createFrontLogProxyTransmitter, Function)
})

test.run()
