import { IClientEventDto, LogLevel } from '@qiwi/substrate'
import { nanoid } from 'nanoid'

import { createFlpPipeline, eventifyPipe } from './pipes/flp'
import { createTransmittable, createTransmitter } from './transmitter'
import { getCookie, setCookie } from './utils/cookie'
export { createHttpPipe } from './pipes/http'
export { createHttpPipeFallback } from './pipes/httpFallback'
export { createMaskerPipe, panMaskerPipe } from './pipes/masker'
export { createHttpBatchPipe } from './pipes/httpBatch'
export { createDeviceInfoPipe } from './pipes/deviceInfo'
export * from './interfaces'
export * from './pipes/index'

const getClientId = (appName: string): string => {
  const clientIdStorageKey = `${appName}-client-id`

  let clientId = getCookie(clientIdStorageKey)
  if (!clientId) {
    clientId = nanoid()
    setCookie(clientIdStorageKey, clientId)
  }
  return clientId
}

type IClientEventDtoFlp = Omit<
  IClientEventDto,
  'level' | 'stacktrace' | 'message'
> & { message: Error | string }

const createFrontLogProxyTransmitter = ({
  appName,
  url,
}: {
  appName: string
  url: string
}) => {
  const appContextId = nanoid()
  const clientId = getClientId(appName)
  if (!url) {
    return console
  }

  const transmitter = createTransmitter({
    pipeline: createFlpPipeline({
      url,
      method: 'POST' as any,
    }),
  })

  return [
    LogLevel.INFO,
    LogLevel.TRACE,
    LogLevel.ERROR,
    LogLevel.DEBUG,
    LogLevel.WARN,
  ].reduce((acc, level) => {
    acc[level] = (data: IClientEventDtoFlp) => {
      const { details, meta } = data

      return transmitter.push({
        ...data,
        level,
        details: { ...details, appContextId, clientId },
        meta: { ...meta, appName },
      })
    }
    return acc
  }, {} as Record<LogLevel, (data: IClientEventDtoFlp) => Promise<any>>)
}

export {
  getCookie,
  setCookie,
  createTransmitter,
  createTransmittable,
  createFlpPipeline,
  eventifyPipe,
  createFrontLogProxyTransmitter,
}
