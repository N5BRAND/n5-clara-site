import { describe, it, expect } from 'vitest'
import { MARCA, EMPRESAS, NOMES_EMPRESAS } from '../src/legal/empresa.js'
import { PRODUTO } from '../src/legal/produto.js'

describe('quem responde pelo site e pelos dados', () => {
  it('os registos ficam em nome da marca, com um só contacto', () => {
    expect(MARCA.nome).toBe('Nº5')
    expect(MARCA.email).toMatch(/@numerocinco\.pt$/)
  })
  it('as duas empresas da marca aparecem com NIF e sede, como a lei pede', () => {
    expect(EMPRESAS.map(e => e.nome)).toEqual(['Os Caetanos, Lda', '4Improvements, Lda'])
    for (const e of EMPRESAS) {
      expect(e.nif).toMatch(/^\d{9}$/)
      expect(e.sede.length).toBeGreaterThan(10)
    }
    expect(NOMES_EMPRESAS).toBe('Os Caetanos, Lda e 4Improvements, Lda')
  })
  it('a oferta diz quem recebe o pagamento, como uma das empresas da marca', () => {
    expect(PRODUTO.oferta).toContain('recebido pela 4Improvements, Lda, uma das empresas da marca Nº5')
    expect(PRODUTO.oferta).not.toMatch(/4IMPROVEMENTS, LDA/)
  })
})
