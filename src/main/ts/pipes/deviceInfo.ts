import { IDeviceInfo, IPipe, IPipeOutput } from '../interfaces'
import { IPromise } from '@qiwi/substrate'
import platform from 'platform'
import { IClientEventDto } from './flp'

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
  execute (): IPromise<IPipeOutput> {
    const event: IClientEventDto = {
      message: '',
      meta: {
        deviceInfo: getDeviceInfo()
      }
    }
    return Promise.resolve([null, event])
  }
})
