import { describe, it, expect } from 'vitest'
import { novoCodigo, codigoValido, meuCodigo, guardarMeuCodigo, lerRef, guardarRef, capturarRef, ligacaoPessoal, linkPagamento, PROGRAMA, mesesGanhos } from '../src/logica/indicacoes.js'
import { contarPreReservas, resumoContagem, listarSessoes } from '../netlify/contagem.js'

const memoria = (inicial = {}) => {
  const d = { ...inicial }
  return { getItem: k => (k in d ? d[k] : null), setItem: (k, v) => { d[k] = String(v) }, dados: d }
}
const DIA = 24 * 3600 * 1000

describe('Passa a Clara: códigos e ligações', () => {
  it('o código tem 6 letras sem I, O, 0 nem 1', () => {
    const c = novoCodigo(n => Uint8Array.from({ length: n }, (_, i) => i * 37))
    expect(c).toMatch(/^[A-HJ-NP-Z2-9]{6}$/)
    expect(codigoValido(novoCodigo())).toBe(true)
    expect(codigoValido('abc234')).toBe(true)
    expect(codigoValido('ABCI23')).toBe(false)
    expect(codigoValido('ana@rede.pt')).toBe(false)
  })
  it('guarda o meu código e o de quem me indicou, mas nunca o meu como indicação', () => {
    const m = memoria()
    guardarMeuCodigo(m, 'ABC234')
    expect(meuCodigo(m)).toBe('ABC234')
    expect(guardarRef(m, 'abc234', 0)).toBe(false)
    expect(capturarRef('?ref=xyz789', m, 0)).toBe('XYZ789')
    expect(lerRef(m, 5 * DIA)).toBe('XYZ789')
  })
  it('a indicação vale 30 dias e a última ligação aberta é a que conta', () => {
    const m = memoria()
    capturarRef('?ref=AAA222', m, 0)
    capturarRef('?ref=BBB333', m, DIA)
    expect(lerRef(m, 2 * DIA)).toBe('BBB333')
    expect(lerRef(m, 31 * DIA + 1)).toBeNull()
  })
  it('ignora ligações com códigos que não são válidos', () => {
    const m = memoria()
    expect(capturarRef('?ref=<script>', m, 0)).toBeNull()
    expect(capturarRef('?utm_source=meta', m, 0)).toBeNull()
    expect(lerRef(m, 0)).toBeNull()
  })
  it('a ligação pessoal leva só o código (e a origem quando é partilhada)', () => {
    expect(ligacaoPessoal('abc234')).toBe('https://clara.numerocinco.pt/?ref=ABC234')
    const u = new URL(ligacaoPessoal('ABC234', 'whatsapp'))
    expect(u.searchParams.get('utm_source')).toBe('partilha')
    expect(u.searchParams.get('utm_medium')).toBe('whatsapp')
    expect(u.searchParams.get('ref')).toBe('ABC234')
    expect(ligacaoPessoal(null)).toBe('https://clara.numerocinco.pt/')
  })
  it('o pagamento leva o código de quem indicou para a Stripe', () => {
    const base = 'https://buy.stripe.com/cNi8wRfFv4Cb1fN3DUgrS0a'
    expect(linkPagamento(base, 'abc234')).toBe(`${base}?client_reference_id=ABC234`)
    expect(linkPagamento(base, null)).toBe(base)
    expect(linkPagamento(base, 'ana@rede.pt')).toBe(base)
  })
})

describe('Passa a Clara: contagem das pré-reservas pagas', () => {
  const s = (codigo, created, extra = {}) => ({ status: 'complete', payment_status: 'paid', client_reference_id: codigo, created, ...extra })
  const fim = 1000

  it('conta só pré-reservas pagas, com código, antes do fim e sem reembolso', () => {
    const { porCodigo } = contarPreReservas([
      s('AAA222', 10), s('AAA222', 20), s('BBB333', 30),
      s('AAA222', 40, { payment_status: 'unpaid' }),
      s(null, 50), s('ana@rede.pt', 55),
      s('BBB333', 2000),
      s('BBB333', 60, { payment_intent: { latest_charge: { refunded: true } } }),
    ], fim * 1000)
    expect(porCodigo).toEqual({ AAA222: 2, BBB333: 1 })
  })
  it('posição, corte do top 10 e desempate por quem lá chegou primeiro', () => {
    const sessoes = []
    'CCC444 DDD555 EEE666 FFF777 GGG888 HHH999 JJJ222 KKK333 LLL444 MMM555 NNN666'.split(' ').forEach((c, i) => sessoes.push(s(c, 100 + i)))
    sessoes.push(s('CCC444', 200), s('DDD555', 150))
    const contagens = contarPreReservas(sessoes, fim * 1000)
    const r = resumoContagem(contagens, 'DDD555')
    expect(r.contagem).toBe(2)
    expect(r.posicao).toBe(1) // empatado com CCC444, mas chegou aos 2 primeiro
    expect(r.participantes).toBe(11)
    expect(r.corte).toBe(1)
    expect(r.top).toHaveLength(10)
    expect(resumoContagem(contagens, 'NNN666').posicao).toBe(11)
    expect(resumoContagem(contagens, 'ZZZ222')).toMatchObject({ contagem: 0, posicao: null })
  })
  it('com menos de 10 participantes, basta 1 pré-reserva paga para entrar', () => {
    expect(resumoContagem(contarPreReservas([s('AAA222', 1)], fim * 1000), null)).toMatchObject({ corte: 1, contagem: null })
  })
  it('lê a Stripe página a página, com a chave só no cabeçalho', async () => {
    const pedidos = []
    const pedir = async (url, op) => {
      pedidos.push({ url, op })
      const segunda = url.includes('starting_after')
      return { ok: true, json: async () => ({ data: [{ id: segunda ? 'cs_2' : 'cs_1' }], has_more: !segunda }) }
    }
    const r = await listarSessoes('rk_teste', pedir)
    expect(r.map(x => x.id)).toEqual(['cs_1', 'cs_2'])
    expect(pedidos[0].url).toContain('payment_link=plink_1UVEbARxjA6FBfLNUUGWxa0b')
    expect(pedidos[0].url).not.toContain('rk_teste')
    expect(pedidos[0].op.headers.Authorization).toBe('Bearer rk_teste')
    expect(pedidos[1].url).toContain('starting_after=cs_1')
  })
})

describe('prémio do Passa a Clara (desde 1/11/2026)', () => {
  it('1 mês da Clara Elite por cada pré-reserva paga, até 6; no top 10, os 6', () => {
    expect(PROGRAMA.plano).toBe('Clara Elite')
    expect(mesesGanhos(0, null)).toBe(0)
    expect(mesesGanhos(2, 25)).toBe(2)
    expect(mesesGanhos(9, 11)).toBe(6)
    expect(mesesGanhos(1, 10)).toBe(6)
    expect(mesesGanhos(1, 11)).toBe(1)
    expect(mesesGanhos(0, 3)).toBe(0)
  })

  it('os textos do programa falam da Clara Elite e já não do plano Clara', () => {
    expect(PROGRAMA.resumo).toContain('1 mês da Clara Elite')
    expect(PROGRAMA.resumo).toContain('os 6 meses')
    expect(JSON.stringify(PROGRAMA)).not.toMatch(/plano Clara|—|–/)
  })
})
