import { HttpMethod, IPromise } from '@qiwi/substrate'
import safeJsonStringify from 'safe-json-stringify'

import { IPipe, IPipeOutput, ITransmittable } from '../interfaces'

export type IHttpHeaders = Record<string, string | (() => string)>

export interface IHttpPipeOpts {
  method: HttpMethod
  url: string
  headers?: IHttpHeaders
}

export const type = 'http'

const getPlainHeaders = (headers: IHttpHeaders): Record<string, string> =>
  Object.entries(headers).reduce(
    (acc: Record<string, string>, [key, value]) => {
      acc[key] = typeof value === 'function' ? value() : value
      return acc
    },
    {},
  )

export const createHttpPipe = ({
  url,
  method,
  headers,
}: IHttpPipeOpts): IPipe => ({
  type,
  execute({ data }: ITransmittable): IPromise<IPipeOutput> {
    const defaultHeaders = {
      'Content-Type': 'application/json',
    }

    return fetch(url, {
      method,
      headers: {
        ...defaultHeaders,
        ...(headers && getPlainHeaders(headers)),
      },
      body: data && safeJsonStringify(data),
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(res.statusText)
        }

        return [null, await res.json()]
      })
      .catch((err) => [err, null]) as IPromise<IPipeOutput>
  },
})
