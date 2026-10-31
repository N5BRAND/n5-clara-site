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

import { linkValido, VALOR_PRE_RESERVA, VALOR_EUROS, PRE_RESERVA, TOTAL_PRE_RESERVA, OFERTA, LINK_PRE_RESERVA } from '../src/logica/pagamento.js'

describe('link da pré-reserva', () => {
  it('a pré-reserva da Clara é de 27 € + IVA, com o total à vista antes de pagar', () => {
    expect(VALOR_PRE_RESERVA).toBe('27 €')
    expect(VALOR_EUROS).toBe(27)
    expect(PRE_RESERVA).toBe('27 € + IVA')
    expect(TOTAL_PRE_RESERVA).toBe('33,21 €')
    expect(OFERTA.resumo).toContain('paga o teu primeiro mês')
    expect(OFERTA.meses.at(-1).valor).toBe('Sem fidelização')
  })
  it('só aceita links de pagamento da Stripe', () => {
    expect(linkValido(LINK_PRE_RESERVA)).toBe(true)
    expect(linkValido('https://buy.stripe.com/abc123XYZ')).toBe(true)
    expect(linkValido('')).toBe(false)
    expect(linkValido('https://buy.stripe.com.exemplo.pt/abc')).toBe(false)
  })
})
