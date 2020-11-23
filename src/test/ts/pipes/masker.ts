import {
  createMaskerPipe,
  ITransmittable,
  panMaskerPipe,
} from '../../../main/ts'

const noop = () => { /* noop */ }

describe('maskerPipe', () => {
  it('factory returns IPipe', () => {
    const maskerPipe = createMaskerPipe(el => el)

    expect(maskerPipe.type).toBe('masker')
    expect(maskerPipe.execute).toEqual(expect.any(Function))
  })

  it('return masked elements', async () => {
    const maskerPipe = createMaskerPipe(el => el.toString() + 'masked')
    const transmittable: ITransmittable = {
      data: ['foo', 'bar', ['foo2', ['foo3']]],
      meta: { history: [] },
    }
    expect(await maskerPipe.execute(transmittable, noop)).toStrictEqual([
      null,
      ['foomasked', 'barmasked', ['foo2masked', ['foo3masked']]],
    ])
  })

  it('return masked elements', async () => {
    const transmittable: ITransmittable = {
      data: [
        '4111111111111111',
        'bar',
        ['4111111111111111', ['foo3', '0000000000000000']],
      ],
      meta: { history: [] },
    }
    expect(await panMaskerPipe.execute(transmittable, noop)).toStrictEqual([
      null,
      [
        '4111 **** **** 1111',
        'bar',
        ['4111 **** **** 1111', ['foo3', '0000 **** **** 0000']],
      ],
    ])
  })
})
