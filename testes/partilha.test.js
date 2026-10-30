import { describe, it, expect } from 'vitest'
import { TEXTOS, REDES, ligacao, post, urlPartilha } from '../src/logica/partilha.js'

describe('partilha do site', () => {
  it('três redes: LinkedIn, Facebook e Instagram', () => {
    expect(REDES.map(r => r.id)).toEqual(['linkedin', 'facebook', 'instagram'])
  })
  it('as ligações marcam a partilha e a rede, sem se confundirem com os anúncios da Meta', () => {
    const u = new URL(ligacao('facebook'))
    expect(u.origin).toBe('https://clara.numerocinco.pt')
    expect(u.searchParams.get('utm_source')).toBe('partilha')
    expect(u.searchParams.get('utm_medium')).toBe('facebook')
    expect(u.searchParams.get('utm_source')).not.toBe('meta')
  })
  it('o LinkedIn abre com o post escrito, com a ligação no fim', () => {
    const u = new URL(urlPartilha('linkedin', TEXTOS.geral))
    expect(u.hostname).toBe('www.linkedin.com')
    expect(u.searchParams.get('shareActive')).toBe('true')
    expect(u.searchParams.get('text')).toBe(`${TEXTOS.geral}\n\n${ligacao('linkedin')}`)
  })
  it('o Facebook recebe só o endereço (o texto vai copiado)', () => {
    const u = new URL(urlPartilha('facebook', TEXTOS.geral))
    expect(u.hostname).toBe('www.facebook.com')
    expect(u.searchParams.get('u')).toBe(ligacao('facebook'))
    expect(u.searchParams.has('quote')).toBe(false)
  })
  it('o Instagram não tem janela de partilha e a legenda leva só o domínio', () => {
    expect(urlPartilha('instagram', TEXTOS.geral)).toBeNull()
    expect(post(TEXTOS.geral, 'instagram').endsWith('\n\nclara.numerocinco.pt')).toBe(true)
  })
  it('os textos seguem a voz da marca: sem travessões e sem dados de ninguém', () => {
    for (const t of Object.values(TEXTOS)) {
      expect(t).not.toMatch(/[—–]/)
      expect(t).not.toMatch(/@/)
    }
  })
})
