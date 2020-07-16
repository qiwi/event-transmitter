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
    }

    if (Array.isArray(data)) {
      if (data.length === 0) {
        return [new Error('Events array must not be empty'), null]
      }

      const batched = await Promise.all(data
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .map((data) => eventifyPipe.execute({ data }, () => {})))

      const [arrayRejected, arrayResolved] = batched.reduce((acc, [res, rej]) => {
        res && acc[0].push(res)
        rej && acc[1].push(rej)
        return acc
      }, [[], []])

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
        event.stacktrace = frames.map(v => v.toString()).join('\n')
      } catch {} // eslint-disable-line no-empty
    } else if (typeof data === 'object') {
      Object.assign(event, data)
    }

    if (!event.message) {
      return [new Error('Event message must not be empty'), null]
    }

    return [null, event]
  },
}

export const createFlpPipeline = (opts: IHttpPipeOpts, batchUrl?: string): TPipeline => {
  const httpPipe = createHttpPipe(opts)
  const httpPipeBatch = batchUrl ? createHttpPipe({ ...opts, url: batchUrl }) : httpPipe

  const httpPipeResolver: IPipe = ({
    type: httpPipe.type,
    execute (...args) {
      return Array.isArray(args[0].data.events)
        ? httpPipeBatch.execute(...args)
        : httpPipe.execute(...args)
    },
  })

  return [panMaskerPipe, eventifyPipe, httpPipeResolver]
}
