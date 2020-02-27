import { IPipe, TPipeline, execute, createTransmittable } from '../../../main/ts/pipes'

// xdescribe('pipes', ()=>{
//   describe('getPipelineId', ()=>{
//     it('getPipelineId works correctly', ()=> {
//       const pipe1: IPipe = {
//         type: 'pipe1',
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//         execute (data, _pipeid) { return Promise.resolve(data) }
//       }
//
//       const pipe2: IPipe = {
//         type: 'pipe2',
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//         execute (data, _pipeid) { return Promise.resolve(data) }
//       }
//
//       const pipeline1: TPipeline = [pipe1, pipe2]
//       const pipeline2: TPipeline = [pipe1, [pipeline1, pipe2]]
//
//       expect(getPipelineId(pipeline1)).toBe('|0-pipe1||1-pipe2|')
//       expect(getPipelineId(pipeline2)).toBe('|0-pipe1||1-[|0-[|0-pipe1||1-pipe2|]||1-pipe2|]|')
//     })
//   })
// })

describe('pipes', () => {
  describe('execute', () => {
    it('execute works correctly', async (done) => {
      const upper: IPipe = {
        type: 'upper',
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async execute (data, _next: Function) {
          data.data.message = data.data.message.toUpperCase()

          return Promise.resolve([null, data])
        }
      }

      const foo: IPipe = {
        type: 'foo',
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async execute (data, next: Function) {
          data.data.message = 'foo'
          return next([null, data])
        }
      }

      const pipeline: TPipeline = [foo, upper]

      const [err, data] = await execute(createTransmittable({
        message: 'bar'
      }), pipeline)

      console.log(err, data)

      done()
    })
  })
})
