import { deepMap } from './deepmap'

export const clone = (src: any): any => deepMap(src, (v) => v)
