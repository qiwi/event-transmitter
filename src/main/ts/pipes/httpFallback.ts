import { IPipe, IPipeOutput, ITransmittable } from '../interfaces'
import { IPromise } from '@qiwi/substrate'
import { createHttpPipe, IHttpPipeOpts } from './http'
import { identity } from '../utils'

export const type = 'http-fallback'

export const createHttpPipeFallback = (opts: IHttpPipeOpts[]): IPipe => {
  const httpPipes = opts.map(createHttpPipe)
  return {
    type,
    execute ({ data }: ITransmittable): IPromise<IPipeOutput> {
      async function executeHttpPipe (httpPipe: IPipe, restPipes: IPipe[], err: any[] = []): Promise<IPipeOutput> {
        if (!httpPipe) {
          return [err, null]
        }
        // @ts-ignore
        const res = await httpPipe.execute({ data }, identity)
        if (res[1]) {
          return res
        }

        return executeHttpPipe(restPipes[0], restPipes.slice(1), [...err, res[0]])
      }

      return executeHttpPipe(httpPipes[0], httpPipes.slice(1))
    },
  }
}
