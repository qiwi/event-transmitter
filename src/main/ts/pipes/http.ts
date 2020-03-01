import {IPipe, IPipeOutput, ITransmittable} from './interfaces'
import {HttpMethod, IPromise} from '@qiwi/substrate'

export interface IHttpPipeOpts {
  method: HttpMethod,
  url: string
}

export const type = 'http'

export const httpPipeFactory = ({url, method}: IHttpPipeOpts): IPipe => ({
  type,
  execute({data}: ITransmittable): IPromise<IPipeOutput> {
    return fetch(url, {method, body: data})
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(res.statusText)
        }

        return [null, await res.json()]
      })
      .catch(err => ([err, null])) as IPromise<IPipeOutput>
  }
})
