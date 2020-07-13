import StackTrace from 'stacktrace-js'
import { IClientEventDto, LogLevel } from '@qiwi/substrate'
import { IPipe, ITransmittable, TPipeline } from '../interfaces'
import { panMaskerPipe } from './masker'
import { createHttpPipe, IHttpPipeOpts } from './http'

const DEFAULT_LEVEL = LogLevel.INFO

export const type = 'flp-eventify'

export const eventifyPipe: IPipe = {
  type,
  async execute ({ data }: ITransmittable) {
    const event: IClientEventDto = {
      message: '',
      meta: {},
    }

    if (data === null || data === undefined) {
      return [new Error('Event message must not be empty'), null]
    } else if (typeof data === 'string' || typeof data === 'number') {
      event.level = DEFAULT_LEVEL
      event.message = '' + data
    } else if (data instanceof Error) {
      event.message = data.message
      event.level = LogLevel.ERROR
      try {
        const frames = await StackTrace.fromError(data)
        event.stacktrace = frames.map(v => v.toString()).join('\n')
      } catch {} // eslint-disable-line no-empty
    } else if (Array.isArray(data)) {
      return [new Error('Event batches are not supported yet'), null]
    } else if (typeof data === 'object') {
      Object.assign(event, data)
    }

    if (!event.message) {
      return [new Error('Event message must not be empty'), null]
    }

    return [null, event]
  },
}

export const createFlpPipeline = (opts: IHttpPipeOpts): TPipeline => {
  const httpPipe = createHttpPipe(opts)

  return [panMaskerPipe, eventifyPipe, httpPipe]
}
