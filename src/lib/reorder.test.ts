import { describe, expect, it } from 'vitest'
import { reorderWithinFullList } from './reorder'

describe('reorderWithinFullList', () => {
  it('reordena todos los elementos', () => {
    expect(reorderWithinFullList(['a', 'b', 'c'], ['a', 'b', 'c'], 0, 2)).toEqual(['b', 'c', 'a'])
  })

  it('reordena solo los visibles manteniendo el resto en su posición', () => {
    expect(reorderWithinFullList(['a', 'x', 'b', 'y', 'c'], ['a', 'b', 'c'], 0, 2)).toEqual([
      'b',
      'x',
      'c',
      'y',
      'a',
    ])
  })
})
