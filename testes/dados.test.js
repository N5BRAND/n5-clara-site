import { describe, it, expect } from 'vitest'
import { CENAS } from '../src/dia/dados.js'

describe('um dia com a Clara', () => {
  it('tem seis momentos pela ordem do dia', () => {
    expect(CENAS.map(c => c.id)).toEqual(['plano', 'lead', 'chamada', 'voz', 'angariacao', 'relatorio'])
    const horas = CENAS.map(c => c.hora)
    expect([...horas].sort()).toEqual(horas)
  })
  it('cada mensagem e cada cartão aparecem num passo que existe', () => {
    for (const c of CENAS) {
      for (const m of c.mensagens) expect(m.p).toBeGreaterThanOrEqual(1), expect(m.p).toBeLessThanOrEqual(c.passos)
      for (const k of c.cartoes) expect(k.p).toBeGreaterThanOrEqual(1), expect(k.p).toBeLessThanOrEqual(c.passos)
    }
  })
  it('o texto não fala em aprovação, ilustrativo, gravação avisada nem usa travessões', () => {
    expect(JSON.stringify(CENAS)).not.toMatch(/aprovação|aprovar|ilustrativ|consentimento|aviso de grava|—/i)
  })
})
