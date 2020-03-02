const {
  createTransmitter,
  createHttpPipe
} = require('../../../target/es5')

describe('index.js (target)', () => {
  it('has proper export', () => {
    expect(createTransmitter).toEqual(expect.any(Function))
    expect(createHttpPipe).toEqual(expect.any(Function))
  })
})
