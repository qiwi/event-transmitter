import { IClientEventDto, LogLevel } from '@qiwi/substrate'
import StackTrace from 'stacktrace-js'

import { IPipe, ITransmittable, TPipeline } from '../interfaces'
import { identity } from '../utils'
import { createDeviceInfoPipe } from './deviceInfo'
import { createHttpBatchPipe, IHttpBatchPipeOpts } from './httpBatch'
import { panMaskerPipe } from './masker'

const DEFAULT_LEVEL = LogLevel.INFO

export const type = 'flp-eventify'

export const eventifyPipe: IPipe = {
  type,
  async execute({ data }: ITransmittable) {
    const event: IClientEventDto = {
      message: '',
      meta: {},
      level: DEFAULT_LEVEL,
    }

    if (data === null || data === undefined) {
      return [new Error('Event message must not be empty'), null]
    }

    if (Array.isArray(data)) {
      if (data.length === 0) {
        return [new Error('Events array must not be empty'), null]
      }

      const batched = await Promise.all(
        data.map((data) =>
          eventifyPipe.execute({ data } as ITransmittable, identity),
        ),
      )

      const [arrayRejected, arrayResolved] = batched.reduce(
        (acc, [res, rej]) => {
          res && acc[0].push(res)
          rej && acc[1].push(rej)
          return acc
        },
        [[], []],
      )

      if (arrayRejected.length > 0) {
        return [arrayRejected, null]
      }

      return [null, { events: arrayResolved }]
    }

    if (typeof data === 'string' || typeof data === 'number') {
      event.level = DEFAULT_LEVEL
      event.message = '' + data
    } else if (data instanceof Error) {
      event.message = data.message
      event.level = LogLevel.ERROR
      try {
        const frames = await StackTrace.fromError(data)
        event.stacktrace = frames.map((v) => v.toString()).join('\n')
      } catch {} // eslint-disable-line no-empty
    } else if (typeof data === 'object') {
      if (data.message instanceof Error) {
        const frames = await StackTrace.fromError(data.message)
        data.stacktrace = frames.map((v) => v.toString()).join('\n')
        data.message = data.message.message
      }
      Object.assign(event, data)
    }

    if (!event.message) {
      return [new Error('Event message must not be empty'), null]
    }

    return [null, event]
  },
}

export const createFlpPipeline = ({
  url,
  batchUrl,
  headers,
  method,
}: IHttpBatchPipeOpts): TPipeline => [
  panMaskerPipe,
  eventifyPipe,
  createDeviceInfoPipe(),
  createHttpBatchPipe({ url, batchUrl, headers, method }),
]
