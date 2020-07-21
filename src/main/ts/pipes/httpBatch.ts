import { IPipe } from '../interfaces'
import { createHttpPipeFallback } from './httpFallback'
import { HttpMethod } from '@qiwi/substrate'
import { IHttpHeaders } from './http'

export type IHttpBatchPipeOpts = {
  url: string | string[],
  method: HttpMethod,
  batchUrl?: string | string [],
  headers?: IHttpHeaders,
}

export const createHttpBatchPipe = ({ url, batchUrl, headers, method }: IHttpBatchPipeOpts): IPipe => {
  const opts = ([] as string[])
    .concat(url)
    .map(url => ({ url, headers, method }))

  const batchOpts = batchUrl
    ? ([] as string[])
      .concat(batchUrl)
      .map(url => ({ url, headers, method }))
    : opts

  const httpPipe = createHttpPipeFallback(opts)
  const httpPipeBatch = createHttpPipeFallback(batchOpts)

  return ({
    type: httpPipe.type,
    execute (...args) {
      return Array.isArray(args[0].data.events)
        ? httpPipeBatch.execute(...args)
        : httpPipe.execute(...args)
    },
  })
}
