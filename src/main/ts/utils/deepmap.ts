export function deepMap(
  input: any,
  fn: (input: Record<string, any>, key?: string) => any,
  refs = new WeakMap(),
  key?: string,
) {
  if (typeof input === 'object' && input !== null) {
    const ref = refs.get(input)
    if (ref) {
      return ref
    }

    const isArr = Array.isArray(input)
    const n: Record<string, any> = Array.isArray(input) ? [] : {}
    refs.set(input, n)
    const descriptors = Object.getOwnPropertyDescriptors(input)

    Object.entries(descriptors).forEach(([key, descriptor]) => {
      if (isArr && key === 'length') {
        return
      }

      // descriptor cannot contain both accessor method and value
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#description
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { get, set, ...rest } = descriptor
      const value = get ? get() : descriptor.value

      Object.defineProperty(n, key, {
        ...rest,
        value: deepMap(value, fn, refs, key),
      })
    })

    Object.setPrototypeOf(n, Object.getPrototypeOf(input))

    return n
  }
  return fn(input, key)
}
