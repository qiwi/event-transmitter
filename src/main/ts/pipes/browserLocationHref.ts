import { IPromise } from '@qiwi/substrate'

import { IPipe, IPipeOutput, ITransmittable } from '../interfaces'
import { clone, set } from '../utils/index'

export const type = 'browser-location-href'

export const createBrowserLocationHrefPipe = (): IPipe => ({
  type,
  execute({ data }: ITransmittable): IPromise<IPipeOutput> {
    const output = set(clone(data), 'details.href', window.location.href)
    return Promise.resolve([null, output])
  },
})
