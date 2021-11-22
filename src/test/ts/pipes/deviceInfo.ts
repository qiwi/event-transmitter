import { createDeviceInfoPipe } from '../../../main/ts'

describe('deviceInfoPipe', () => {
  it('is returned by factory', () => {
    const maskerPipe = createDeviceInfoPipe()

    expect(maskerPipe.type).toBe('device-info')
    expect(maskerPipe.execute).toEqual(expect.any(Function))
  })
})
