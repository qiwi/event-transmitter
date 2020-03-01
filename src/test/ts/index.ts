import {
  createTransmitter,
  createHttpPipe
} from '../../main/ts'

describe('index', () => {
  it('has propes export', () => {
    expect(createTransmitter).toEqual(expect.any(Function))
    expect(createHttpPipe).toEqual(expect.any(Function))
  })
})
