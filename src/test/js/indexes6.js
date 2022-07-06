import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { createHttpPipe,createTransmitter, createFrontLogProxyTransmitter } from '../../../target/es6/index.mjs'

test('index es6.js (target)', () => {
  test('has proper export', () => {
    assert.instance(createTransmitter, Function)
    assert.instance(createHttpPipe, Function)
    assert.instance(createFrontLogProxyTransmitter, Function)
  })
})

test.run()
