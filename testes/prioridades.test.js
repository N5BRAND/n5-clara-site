import { describe, it, expect } from 'vitest'
import { PRIORIDADES, MAX_PRIORIDADES, alternarPrioridade, textoPrioridades } from '../src/logica/prioridades.js'

describe('prioridades', () => {
  it('há 8 opções e escolhem-se até 3', () => {
    expect(PRIORIDADES).toHaveLength(8)
    expect(MAX_PRIORIDADES).toBe(3)
  })
  it('liga e desliga uma prioridade', () => {
    const [a, b] = PRIORIDADES.map(p => p.id)
    expect(alternarPrioridade([], a)).toEqual([a])
    expect(alternarPrioridade([a, b], a)).toEqual([b])
  })
  it('não passa do máximo nem aceita opções que não existem', () => {
    const ids = PRIORIDADES.map(p => p.id)
    const tres = ids.slice(0, 3)
    expect(alternarPrioridade(tres, ids[3])).toEqual(tres)
    expect(alternarPrioridade([], 'inventada')).toEqual([])
  })
  it('o envio leva os textos pela ordem da escolha', () => {
    const [a, b] = PRIORIDADES
    expect(textoPrioridades([b.id, a.id])).toBe(`${b.texto}; ${a.texto}`)
  })
})
