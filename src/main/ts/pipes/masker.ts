import luhn from 'fast-luhn'

import { IPipe } from '../interfaces'
import { deepMap } from '../utils'
const type = 'masker'

export const createMaskerPipe = (
  fn: (el: any, key?: string) => string,
): IPipe => ({
  type,
  async execute ({ data }) {
    try {
      const maskedData = deepMap(data, fn)
      return [null, maskedData]
    } catch (e) {
      return [e, null]
    }
  },
})

export const panMaskerFn = (input: string | number): string => {
  return (input + '').replace(/\d{13,19}/g, v =>
    luhn(v)
      ? `${v.slice(0, 4)} **** **** ${v.slice(-4)}`
      : '' + input,
  )
}

export const panMaskerPipe = createMaskerPipe(panMaskerFn)
