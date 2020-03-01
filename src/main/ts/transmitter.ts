import {
  ITransmitter,
  ITransmittable,
  TPipeline,
  IPipeOutput,
} from './interfaces'

import {IPromise} from '@qiwi/substrate'

import {
  execute
} from './pipes'


export type ITransmitterOpts = {
  pipeline: TPipeline
}

export const createTransmittable = (event: any): ITransmittable => ({
  data: event,
  meta: { history: [] }
})

export const createTransmitter = ({pipeline}: ITransmitterOpts): ITransmitter => ({
  push(data: any): IPromise<IPipeOutput> {
    const transmittable = createTransmittable(data)

    return execute(transmittable, pipeline)
  }
})
