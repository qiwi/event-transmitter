import { createTransmitter, userAgentPipe } from '../../../main/ts'


describe('deviceInfoPipe', () => {
  it('is returned by factory', () => {
    expect(userAgentPipe.type).toBe('user-agent')
    expect(userAgentPipe.execute).toEqual(expect.any(Function))
  })
})

describe('getDeviceInfo', () => {
  beforeAll(()=>{
    // @ts-ignore
    navigator.__defineGetter__('userAgent', function () {
      return 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
    })
  })

  it('returns device info', async () => {
    const userAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
    const transmitter = createTransmitter({
      pipeline: [userAgentPipe],
    })

    const res = await transmitter.push({})

    expect(res).toMatchObject([null, { meta: { userAgent } }])
  })
})
