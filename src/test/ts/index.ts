import { foo } from '../../main/ts'

describe('index', () => {
  it('foo', ()=>{
    expect(foo).not.toBeUndefined()
  })
})
