import { describe, it, expect } from 'vitest'
import { CHAVE, VERSAO, lerConsentimento, novoConsentimento, guardarConsentimento } from '../src/legal/consentimento.js'

/* armazenamento falso, como o localStorage */
const memoria = (inicial = {}) => {
  const d = { ...inicial }
  return { getItem: k => (k in d ? d[k] : null), setItem: (k, v) => { d[k] = String(v) }, dados: d }
}

describe('consentimento de cookies', () => {
  it('sem escolha guardada devolve null (mostra o aviso)', () => {
    expect(lerConsentimento(memoria())).toBeNull()
  })
  it('guarda e lê a escolha', () => {
    const m = memoria()
    const c = novoConsentimento({ marketing: true }, new Date('2026-10-27T10:00:00Z'))
    expect(c).toEqual({ versao: VERSAO, data: '2026-10-27T10:00:00.000Z', necessarios: true, marketing: true })
    expect(guardarConsentimento(m, c)).toBe(true)
    expect(lerConsentimento(m)).toEqual(c)
  })
  it('rejeitar guarda marketing desligado', () => {
    expect(novoConsentimento({}, new Date()).marketing).toBe(false)
  })
  it('escolhas antigas ou estragadas pedem de novo', () => {
    expect(lerConsentimento(memoria({ [CHAVE]: '{nada' }))).toBeNull()
    expect(lerConsentimento(memoria({ [CHAVE]: JSON.stringify({ versao: VERSAO - 1, marketing: true }) }))).toBeNull()
  })
  it('se o navegador bloquear o armazenamento, não rebenta', () => {
    const partido = { getItem: () => { throw new Error('bloqueado') }, setItem: () => { throw new Error('bloqueado') } }
    expect(lerConsentimento(partido)).toBeNull()
    expect(guardarConsentimento(partido, novoConsentimento({}, new Date()))).toBe(false)
  })
})
