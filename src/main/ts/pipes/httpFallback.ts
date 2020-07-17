import { IPipe, IPipeOutput, ITransmittable } from '../interfaces'
import { IPromise } from '@qiwi/substrate'
import { createHttpPipe, IHttpPipeOpts } from './http'
import { executePipeline } from '../utils'

export const type = 'http-fallback'

export const createHttpPipeFallback = (opts: IHttpPipeOpts[]): IPipe => {
  if (opts.length === 0) {
    throw new Error('createHttpPipeFallback opts must not be empty')
  }

  const httpPipes = opts.map(createHttpPipe)
  return {
    type,
    execute (transmittable : ITransmittable): IPromise<IPipeOutput> {
      return executePipeline(transmittable, httpPipes)
    },
  }
}
