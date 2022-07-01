import { ICallable } from '@qiwi/substrate'
import { test } from 'uvu'
import * as assert from 'uvu/assert'

import {
  createTransmittable,
  execute,
  getPipelineId,
  IPipe,
  TPipeline,
} from '../../../main/ts/index'

test('pipes', () => {
  test('getPipelineId works correctly', () => {
    const pipe1: IPipe = {
      type: 'pipe1',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      execute(data: any, _pipeid: any) {
        return Promise.resolve([null, data])
      },
    }

    const pipe2: IPipe = {
      type: 'pipe2',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      execute(data, _pipeid) {
        return Promise.resolve([null, data])
      },
    }

    const pipeline1: TPipeline = [pipe1, pipe2]
    const pipeline2: TPipeline = [pipe1, [pipeline1, pipe2]]

    assert.is(getPipelineId(pipeline1), '{0-pipe1}{1-pipe2}')
    assert.is(
      getPipelineId(pipeline2),
      '{0-pipe1}{1-[{0-[{0-pipe1}{1-pipe2}]}{1-pipe2}]}',
    )
  })

  test('execute works correctly', async () => {
    const upper: IPipe = {
      type: 'upper',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async execute(data, next: ICallable) {
        data.data.message = data.data.message.toUpperCase()
        await next([null, data.data])
        data.data.message = data.data.message.toUpperCase()
        return Promise.resolve([null, data])
      },
    }

    const foo: IPipe = {
      type: 'foo',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async execute(data, next: ICallable) {
        data.data.message = 'foo'
        return next([null, data])
      },
    }

    const pipeline2: TPipeline = [upper, foo]

    const res = await execute(
      createTransmittable({
        message: 'baz',
      }),
      pipeline2,
    )

    assert.equal(res, [
      null,
      {
        data: { message: 'FOO' },
        err: null,
        meta: {
          history: [
            {
              pipelineId: '{0-upper}{1-foo}',
              pipeId: '1',
              pipeType: 'foo',
              err: null,
              res: false,
            },
            {
              pipelineId: '{0-upper}{1-foo}',
              pipeId: '0',
              pipeType: 'upper',
              err: null,
              res: true,
            },
          ],
        },
      },
    ])
  })
})

test.run()
