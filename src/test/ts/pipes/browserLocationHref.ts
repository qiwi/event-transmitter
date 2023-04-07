import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { createBrowserLocationHrefPipe } from '../../../main/ts/index'

test('browserLocationHref is returned by factory', async () => {
  const browserLocationHrefPipe = createBrowserLocationHrefPipe()
  const res = await browserLocationHrefPipe.execute(
    { data: {}, err: null, meta: { history: [] } },
    () => {
      /* noop */
    },
  )
  assert.equal(res, [
    null,
    { meta: { location: 'https://github.com/qiwi/event-transmitter' } },
  ])
})

test.run()
