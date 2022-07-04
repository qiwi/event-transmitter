import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { createHttpPipe,createTransmitter } from '../../../target/es5/index.js'

test('index.js (target)', () => {
  test('has proper export', () => {
    assert.instance(createTransmitter, Function)
    assert.instance(createHttpPipe, Function)
  })
})

test.run()
