import { IDeviceInfo, IPipe, IPipeOutput, ITransmittable } from '../interfaces'
import { IPromise } from '@qiwi/substrate'
import platform from 'platform'

export const type = 'device-info'

export const getDeviceInfo = (userAgent?: string): IDeviceInfo => {
  const parser = userAgent ? platform.parse(userAgent) : platform
  return {
    browser: {
      name: parser.name,
      version: parser.version,
      layout: parser.layout
    },
    environment: {
      device: parser.product,
      manufacturer: parser.manufacturer,
      os: parser.os
    }
  }
}

export const createDeviceInfoPipe = (): IPipe => ({
  type,
  execute ({ data }: ITransmittable): IPromise<IPipeOutput> {
    data.meta.deviceInfo = getDeviceInfo()
    return Promise.resolve([null, data])
  }
})
