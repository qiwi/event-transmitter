import luhn from 'fast-luhn'

import { IPipe } from '../interfaces'
import { deepMap } from '../utils/index'
const type = 'masker'

export const createMaskerPipe = (
  fn: (el: any, key?: string) => string | number,
): IPipe => ({
  type,
  async execute({ data }) {
    try {
      const maskedData = deepMap(data, fn)
      return [null, maskedData]
    } catch (e) {
      return [e, null]
    }
  },
})

export const panMaskerFn = (input: string | number): string | number => {
  return typeof input === 'number' && input < 9999_9999_9999
    ? input
    : (input + '').replace(/\d{13,19}/g, (v) =>
        luhn(v) ? `${v.slice(0, 4)} **** **** ${v.slice(-4)}` : '' + input,
      )
}

export const panMaskerPipe = createMaskerPipe(panMaskerFn)
