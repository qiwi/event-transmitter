import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { createFrontLogProxyTransmitter,createHttpPipe,createTransmitter } from '../../../target/es6/index'

test('index es6 (target)', () => {
  test('has proper export', () => {
    assert.instance(createTransmitter, Function)
    assert.instance(createHttpPipe, Function)
    assert.instance(createFrontLogProxyTransmitter, Function)
  })
})

test.run()
