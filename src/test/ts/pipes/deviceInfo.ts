import { createDeviceInfoPipe, getDeviceInfo, IDeviceInfo } from '../../../main/ts'

describe('deviceInfoPipe', () => {
  it('is returned by factory', () => {
    const maskerPipe = createDeviceInfoPipe()

    expect(maskerPipe.type).toBe('device-info')
    expect(maskerPipe.execute).toEqual(expect.any(Function))
  })
})

describe('getDeviceInfo', () => {
  it('returns device info', () => {
    const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
    const expected: IDeviceInfo = {
      browser: {
        name: 'Chrome',
        version: '83.0.4103.116',
        layout: 'Blink'
      },
      environment: {
        device: null,
        manufacturer: null,
        os: {
          architecture: 64,
          family: 'OS X',
          version: '10.14.6'
        }
      }
    }
    expect<IDeviceInfo>(getDeviceInfo(userAgent)).toMatchObject(expected)
  })
})
