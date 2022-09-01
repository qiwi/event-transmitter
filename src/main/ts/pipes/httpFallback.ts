import { IPromise } from '@qiwi/substrate'

import { IPipe, IPipeOutput, ITransmittable } from '../interfaces'
import { executeFailproof } from '../utils/index'
import { createHttpPipe, IHttpPipeOpts } from './http'

export const type = 'http-fallback'

export const createHttpPipeFallback = (opts: IHttpPipeOpts[]): IPipe => {
  if (opts.length === 0) {
    throw new Error('createHttpPipeFallback opts must not be empty')
  }

  const httpPipes = opts.map(createHttpPipe)
  return {
    type,
    execute(transmittable: ITransmittable): IPromise<IPipeOutput> {
      return executeFailproof(transmittable, [...httpPipes])
    },
  }
}
