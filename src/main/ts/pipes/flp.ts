import {IClientEventDto, LogLevel} from '@qiwi/substrate'
import {IPipe, ITransmittable} from '../interfaces'

const DEFAULT_LEVEL = LogLevel.INFO

export const type = 'flp-eventify'

export const eventifyPipe: IPipe = {
  type,
  async execute (transmittable: ITransmittable) {
    const { data } = transmittable

    const event: IClientEventDto = {
      message: '',
      meta: {}
    }

    if (data === null || data === undefined) {
      return [new Error('Event message must not be empty'), null]

    } else if (typeof data === 'string' || typeof data === 'string') {
      event.level = DEFAULT_LEVEL
      event.message = '' + data

    } else if (data instanceof Error) {
      event.message = data.message
      event.level = LogLevel.ERROR
      // TODO process stack trace

    } else if (Array.isArray(data)) {
      return [new Error('Event batches are not supported yet'), null]

    } else if (typeof data === 'object') {
      Object.assign(event, data)
    }

    if (!event.message) {
      return [new Error('Event message must not be empty'), null]
    }

    return [null, event]
  }
}
