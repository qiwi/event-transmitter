import { IDeviceInfo, IPipe, IPipeOutput, ITransmittable } from '../interfaces'
import { IPromise } from '@qiwi/substrate'
import platform from 'platform'
import { set, clone } from '../utils'

export const type = 'device-info'

export const getDeviceInfo = (userAgent?: string): IDeviceInfo => {
  const parsedData = userAgent ? platform.parse(userAgent) : platform
  const { name, version, layout, product, manufacturer, os } = parsedData
  return {
    browser: {
      name,
      version,
      layout
    },
    model: {
      product,
      manufacturer
    },
    os
  }
}

export const createDeviceInfoPipe = (): IPipe => ({
  type,
  execute ({ data }: ITransmittable): IPromise<IPipeOutput> {
    const output = set(clone(data), 'meta.deviceInfo', getDeviceInfo())

    return Promise.resolve([null, output])
  }
})
