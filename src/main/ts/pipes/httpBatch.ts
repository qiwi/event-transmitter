import { Extends, HttpMethod } from '@qiwi/substrate'

import { IPipe } from '../interfaces'
import { IHttpHeaders } from './http'
import { createHttpPipeFallback } from './httpFallback'

export type IHttpBatchPipeOpts = {
  url: string | string[]
  method: HttpMethod
  batchUrl?: string | string[]
  headers?: IHttpHeaders
}

const asArray = <T>(value: T): Extends<T, any[], T, T[]> =>
  (Array.isArray(value) ? value : [value]) as Extends<T, any[], T, T[]>

export const createHttpBatchPipe = ({
  url,
  batchUrl,
  headers,
  method,
}: IHttpBatchPipeOpts): IPipe => {
  const opts = ([] as string[])
    .concat(url)
    .map((url) => ({ url, headers, method }))

  const batchOpts = batchUrl
    ? (asArray(batchUrl) as string[]).map((url) => ({ url, headers, method }))
    : opts

  const httpPipe = createHttpPipeFallback(opts)
  const httpPipeBatch = createHttpPipeFallback(batchOpts)

  return {
    type: httpPipe.type,
    execute(...args) {
      return Array.isArray(args[0]?.data?.events)
        ? httpPipeBatch.execute(...args)
        : httpPipe.execute(...args)
    },
  }
}
