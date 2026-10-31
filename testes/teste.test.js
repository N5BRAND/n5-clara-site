import { describe, it, expect } from 'vitest'
import { modoTeste } from '../src/legal/teste.js'

const memoria = () => {
  const m = new Map()
  return { getItem: k => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)) }
}
const CLAUDE = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Claude/4.4212.0 Chrome/152.0.7977.167 Safari/537.36'
const CHROME = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36'

describe('modo de teste', () => {
  it('um visitante normal não está em teste', () => {
    expect(modoTeste({ pesquisa: '?utm_source=meta&fbclid=abc', agente: CHROME, arm: memoria() })).toBe(false)
  })
  it('o browser do Claude está sempre em teste', () => {
    expect(modoTeste({ pesquisa: '', agente: CLAUDE, arm: memoria() })).toBe(true)
  })
  it('?teste=1 e utm_source=teste-interno ligam e ficam ligados neste navegador', () => {
    const arm = memoria()
    expect(modoTeste({ pesquisa: '?teste=1', agente: CHROME, arm })).toBe(true)
    expect(modoTeste({ pesquisa: '', agente: CHROME, arm })).toBe(true)
    const outro = memoria()
    expect(modoTeste({ pesquisa: '?utm_source=teste-interno', agente: CHROME, arm: outro })).toBe(true)
    expect(modoTeste({ pesquisa: '/dia/', agente: CHROME, arm: outro })).toBe(true)
  })
  it('?teste=0 desliga, também no browser do Claude, e fica desligado', () => {
    const arm = memoria()
    expect(modoTeste({ pesquisa: '?teste=1', agente: CHROME, arm })).toBe(true)
    expect(modoTeste({ pesquisa: '?teste=0', agente: CHROME, arm })).toBe(false)
    expect(modoTeste({ pesquisa: '', agente: CHROME, arm })).toBe(false)
    expect(modoTeste({ pesquisa: '?teste=0', agente: CLAUDE, arm: memoria() })).toBe(false)
  })
  it('sem armazenamento decide só pelo endereço e pelo navegador', () => {
    const partido = { getItem: () => { throw new Error('bloqueado') }, setItem: () => { throw new Error('bloqueado') } }
    expect(modoTeste({ pesquisa: '?teste=1', agente: CHROME, arm: partido })).toBe(true)
    expect(modoTeste({ pesquisa: '', agente: CHROME, arm: partido })).toBe(false)
    expect(modoTeste({ pesquisa: '', agente: CLAUDE, arm: null })).toBe(true)
  })
})
