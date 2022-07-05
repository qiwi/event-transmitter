import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { createDeviceInfoPipe } from '../../../main/ts/index'

test('deviceInfoPipe is returned by factory', () => {
  const maskerPipe = createDeviceInfoPipe()

  assert.is(maskerPipe.type, 'device-info')
  assert.instance(maskerPipe.execute, Function)
})

test.run()
