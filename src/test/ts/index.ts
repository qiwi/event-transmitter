import {
  createFlpPipeline,
  createHttpPipe,
  createMaskerPipe,
  createTransmittable,
  createTransmitter,
} from '../../main/ts'

describe('index', () => {
  it('has proper export', () => {
    expect(createTransmitter).toEqual(expect.any(Function))
    expect(createHttpPipe).toEqual(expect.any(Function))
    expect(createFlpPipeline).toEqual(expect.any(Function))
    expect(createTransmittable).toEqual(expect.any(Function))
    expect(createMaskerPipe).toEqual(expect.any(Function))
  })
})
