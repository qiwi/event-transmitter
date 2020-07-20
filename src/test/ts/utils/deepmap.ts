import { deepMap } from '../../../main/ts/utils'

describe('deepMap', () => {
  it('handle object', () => {
    const testObj = {
      a: 1,
      b: [
        1,
        2,
        {
          c: 4,
          d: {
            e: 6,
            f: [7, 8],
          },
        },
      ],
    }

    expect(deepMap(testObj, el => Number(el) * 10)).toMatchObject({
      a: 10,
      b: [
        10,
        20,
        {
          c: 40,
          d: {
            e: 60,
            f: [70, 80],
          },
        },
      ],
    })
  })

  it('handle circular deps', () => {
    const testObj: Record<string, any> = {
      a: 1,
      b: 2,
    }
    testObj.foo = testObj

    const resObj: Record<string, any> = {
      a: 10,
      b: 20,
    }
    resObj.foo = resObj

    expect(deepMap(testObj, el => Number(el) * 10)).toMatchObject(resObj)
  })

  it('handle error objects', () => {
    const testObj = new Error('1')

    expect(deepMap(testObj, el => Number(el) * 10)).toMatchObject(new Error('10'))
  })
})
