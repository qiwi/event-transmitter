import { IPromise } from '@qiwi/substrate'

import { IPipe, IPipeOutput, ITransmittable } from '../interfaces'
import { clone, set } from '../utils'

export const type = 'user-agent'

export const userAgentPipe: IPipe = {
  type,
  execute({ data }: ITransmittable): IPromise<IPipeOutput> {
    const output = set(
      clone(data),
      'meta.userAgent',
      window.navigator.userAgent,
    )
    return Promise.resolve([null, output])
  },
}
