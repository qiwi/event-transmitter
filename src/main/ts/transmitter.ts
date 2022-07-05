import { ITransmittable, ITransmitter, TPipeline } from './interfaces'
import { execute } from './pipes/index'

export type ITransmitterOpts = {
  pipeline: TPipeline
}

export const createTransmittable = (event: any): ITransmittable => ({
  data: event,
  err: null,
  meta: { history: [] },
})

export const createTransmitter = (opts: ITransmitterOpts): ITransmitter => ({
  push(data) {
    const transmittable = createTransmittable(data)

    return execute(transmittable, opts.pipeline)
  },
})
