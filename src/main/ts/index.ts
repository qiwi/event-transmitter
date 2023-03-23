import { IClientEventDto, LogLevel } from '@qiwi/substrate'
import { nanoid } from 'nanoid'

import { IPipeOutput } from './interfaces'
import { createFlpPipeline, eventifyPipe } from './pipes/flp'
import { createTransmittable, createTransmitter } from './transmitter'
import { getCookie, setCookie } from './utils/cookie'
export { createHttpPipe } from './pipes/http'
export { createHttpPipeFallback } from './pipes/httpFallback'
export { createMaskerPipe, panMaskerPipe } from './pipes/masker'
export { createHttpBatchPipe } from './pipes/httpBatch'
export { createDeviceInfoPipe } from './pipes/deviceInfo'
export { createBrowserLocationHrefPipe } from './pipes/browserLocationHref'
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
  url?: string
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
    acc[level] = (data: IClientEventDtoFlp | Error | string | number) => {
      if (
        typeof data === 'string' ||
        typeof data === 'number' ||
        typeof data === 'boolean' ||
        data === null ||
        data === undefined
      ) {
        return transmitter.push(({
          message: data,
          details: { appContextId, clientId },
          meta: { appName },
          level,
        }))
      }

      if (data instanceof Error) {
        return transmitter.push({
          message: data,
          level,
          details: { appContextId, clientId },
          meta: { appName },
        })
      }

      return transmitter.push({
        ...data,
        level,
        details: { ...data.details, appContextId, clientId },
        meta: { ...data.meta, appName },
      })
    }
    return acc
  }, {} as Record<LogLevel, (data: IClientEventDtoFlp | Error | string | number) => Promise<IPipeOutput>>)
}

export {
  createTransmitter,
  createTransmittable,
  createFlpPipeline,
  eventifyPipe,
  createFrontLogProxyTransmitter,
}

export type { IClientEventDtoFlp }
