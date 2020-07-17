import { IPipe, TPipeline, createTransmittable } from '../../../main/ts'
import { execute, getPipelineId } from '../../../main/ts/pipes'
import { ICallable } from '@qiwi/substrate'

describe('pipes', () => {
  describe('getPipelineId', () => {
    it('getPipelineId works correctly', () => {
      const pipe1: IPipe = {
        type: 'pipe1',
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        execute (data, _pipeid) { return Promise.resolve([null, data]) },
      }

      const pipe2: IPipe = {
        type: 'pipe2',
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        execute (data, _pipeid) { return Promise.resolve([null, data]) },
      }

      const pipeline1: TPipeline = [pipe1, pipe2]
      const pipeline2: TPipeline = [pipe1, [pipeline1, pipe2]]

      expect(getPipelineId(pipeline1)).toBe('{0-pipe1}{1-pipe2}')
      expect(getPipelineId(pipeline2)).toBe('{0-pipe1}{1-[{0-[{0-pipe1}{1-pipe2}]}{1-pipe2}]}')
    })
  })
})

describe('pipes', () => {
  describe('execute', () => {
    it('execute works correctly', async () => {
      const upper: IPipe = {
        type: 'upper',
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async execute (data, next: ICallable) {
          data.data.message = data.data.message.toUpperCase()
          await next([null, data.data])
          data.data.message = data.data.message.toUpperCase()
          return Promise.resolve([null, data])
        },
      }

      const foo: IPipe = {
        type: 'foo',
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async execute (data, next: ICallable) {
          data.data.message = 'foo'
          return next([null, data])
        },
      }

      const pipeline2: TPipeline = [upper, foo]

      const res = await execute(createTransmittable({
        message: 'baz',
      }), pipeline2)

      expect(res).toMatchObject([
        null,
        {
          data: { message: 'FOO' },
          err: null,
          meta:
            {
              history:
                [
                  { pipelineId: '{0-upper}{1-foo}', pipeId: '1', pipeType: 'foo', err: null, res: false },
                  { pipelineId: '{0-upper}{1-foo}', pipeId: '0', pipeType: 'upper', err: null, res: true }],
            },
        },
      ])
    })
  })
})
