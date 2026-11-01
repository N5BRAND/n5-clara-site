import { describe, it, expect } from 'vitest'
import { LINK_PRE_RESERVA as LINK_DO_SITE } from '../src/logica/pagamento.js'
import {
  LINK_PRE_RESERVA, novoRegisto, proximoPasso, ligacaoDoEmail, textosDoEmail, emailSeguimento, motivoParaParar,
  registarSeguimento, marcarPago, correr,
} from '../netlify/seguimento.js'

const MIN = 60 * 1000
const HORA = 60 * MIN
const t0 = Date.parse('2026-11-01T10:00:00Z')

/* um Netlify Blobs em memória */
const loja = () => {
  const dados = new Map()
  return {
    dados,
    async get(k) { return dados.has(k) ? structuredClone(dados.get(k)) : null },
    async setJSON(k, v) { dados.set(k, structuredClone(v)) },
    async list({ prefix = '' } = {}) { return { blobs: [...dados.keys()].filter(k => k.startsWith(prefix)).map(key => ({ key })) } },
  }
}
/* o GHL a fingir: guarda os pedidos e devolve o contacto com as etiquetas dadas */
const ghl = (contacto = { tags: ['n5-clara'] }) => {
  const pedidos = []
  const pedir = async (url, o = {}) => {
    pedidos.push({ url, metodo: o.method || 'GET', corpo: o.body ? JSON.parse(o.body) : null })
    return { ok: true, status: 200, json: async () => ({ contact: contacto }) }
  }
  return { pedidos, pedir }
}
const base = { contactId: 'abc123XYZ', email: 'ana@rede.pt', nome: 'Ana Silva', tipo: 'inscricao', codigo: 'ABC234', agora: t0 }

describe('seguimento: quando sai cada email', () => {
  it('inscrição: 1 h, 24 h e 72 h depois de entrar', () => {
    const r = novoRegisto(base)
    expect(proximoPasso(r, t0 + 59 * MIN)).toBeNull()
    expect(proximoPasso(r, t0 + HORA)).toBe(0)
    const r1 = { ...r, enviados: [t0 + HORA] }
    expect(proximoPasso(r1, t0 + 23 * HORA)).toBeNull()
    expect(proximoPasso(r1, t0 + 24 * HORA)).toBe(1)
    const r2 = { ...r, enviados: [t0 + HORA, t0 + 24 * HORA] }
    expect(proximoPasso(r2, t0 + 72 * HORA)).toBe(2)
    expect(proximoPasso({ ...r, enviados: [1, 2, 3] }, t0 + 999 * HORA)).toBeNull()
  })
  it('assistente: o primeiro email sai 15 minutos depois', () => {
    expect(proximoPasso(novoRegisto({ ...base, tipo: 'assistente' }), t0 + 15 * MIN)).toBe(0)
  })
  it('nunca dois emails seguidos: pelo menos 20 h entre eles, mesmo com atrasos', () => {
    const r = { ...novoRegisto(base), enviados: [t0 + 50 * HORA] }
    expect(proximoPasso(r, t0 + 60 * HORA)).toBeNull()
    expect(proximoPasso(r, t0 + 70 * HORA)).toBe(1)
  })
  it('em modo de teste anda em minutos; quem já acabou não recebe mais', () => {
    expect(proximoPasso(novoRegisto({ ...base, teste: true }), t0 + MIN)).toBe(0)
    expect(proximoPasso({ ...novoRegisto(base), fim: 'pre-reserva-paga' }, t0 + 99 * HORA)).toBeNull()
  })
})

describe('seguimento: o email', () => {
  it('a ligação é o Payment Link do site, com o email preenchido e o código de quem indicou', () => {
    expect(LINK_PRE_RESERVA).toBe(LINK_DO_SITE)
    const u = new URL(ligacaoDoEmail(novoRegisto({ ...base, indicado: 'XYZ789' })))
    expect(u.origin + u.pathname).toBe(LINK_DO_SITE)
    expect(u.searchParams.get('prefilled_email')).toBe('ana@rede.pt')
    expect(u.searchParams.get('client_reference_id')).toBe('XYZ789')
    expect(new URL(ligacaoDoEmail(novoRegisto(base))).searchParams.get('client_reference_id')).toBeNull()
  })
  it('três emails, sem IVA, travessões nem aprovações; o primeiro muda para quem só falou com a Clara', () => {
    for (const tipo of ['inscricao', 'assistente']) {
      for (const passo of [0, 1, 2]) {
        const t = JSON.stringify(textosDoEmail(tipo, passo))
        expect(t).not.toMatch(/IVA\b|—|–|aprovação|aprovar|ilustrativ/)
        expect(t).toMatch(/27 €|25 pré-reservas|1 de dezembro/)
      }
    }
    expect(textosDoEmail('assistente', 0).assunto).not.toBe(textosDoEmail('inscricao', 0).assunto)
    expect(textosDoEmail('assistente', 1)).toEqual(textosDoEmail('inscricao', 1))
  })
  it('o nome entra escapado, o teste leva [Teste] e há sempre como sair', () => {
    const e = emailSeguimento(novoRegisto({ ...base, nome: '<b>Ana</b> Silva', teste: true }), 0)
    expect(e.assunto).toMatch(/^\[Teste\] /)
    expect(e.html).toContain('Olá &lt;b&gt;Ana&lt;/b&gt;,')
    expect(e.html).toMatch(/Responde «sair»/)
    expect(e.html).toContain('prefilled_email=ana%40rede.pt')
  })
})

describe('seguimento: quem entra e quem sai', () => {
  it('pára com pre-reserva-paga, seguimento-parar ou «não contactar»', () => {
    expect(motivoParaParar({ tags: ['n5-clara', 'Pre-Reserva-Paga'] })).toBe('pre-reserva-paga')
    expect(motivoParaParar({ tags: ['seguimento-parar'] })).toBe('seguimento-parar')
    expect(motivoParaParar({ tags: [], dnd: true })).toBe('nao-contactar')
    expect(motivoParaParar({ tags: ['n5-clara'] })).toBe('')
  })
  it('entra só uma vez; quem falou com a Clara e depois se inscreve passa a inscrição', async () => {
    const l = loja()
    expect(await registarSeguimento(l, { ...base, tipo: 'assistente' })).toBe(true)
    expect(await registarSeguimento(l, { ...base, tipo: 'assistente' })).toBe(false)
    await registarSeguimento(l, { ...base, tipo: 'inscricao', codigo: 'QWE345' })
    expect(l.dados.get('c/abc123XYZ')).toMatchObject({ tipo: 'inscricao', codigo: 'QWE345' })
    expect(await registarSeguimento(l, { ...base, email: '' , contactId: 'outro123'})).toBe(false)
  })
  it('a confirmação do pagamento tira a pessoa do seguimento pelo código', async () => {
    const l = loja()
    await registarSeguimento(l, base)
    await registarSeguimento(l, { ...base, contactId: 'outro999', codigo: 'ZZZ222' })
    expect(await marcarPago(l, 'ABC234')).toEqual(['abc123XYZ'])
    expect(l.dados.get('c/abc123XYZ').fim).toBe('pre-reserva-paga')
    expect(l.dados.get('c/outro999').fim).toBe('')
    expect(await marcarPago(l, 'nada')).toEqual([])
  })
})

describe('seguimento: uma volta', () => {
  it('sem SEGUIMENTO_ATIVO só ensaia: não envia nem muda nada', async () => {
    const l = loja()
    await registarSeguimento(l, base)
    const { pedidos, pedir } = ghl()
    const r = await correr({ loja: l, token: 't', agora: t0 + 2 * HORA, pedir, log: () => {} })
    expect(r).toMatchObject({ vistos: 1, ensaiados: 1, enviados: 0 })
    expect(pedidos.some(p => p.url.endsWith('/conversations/messages'))).toBe(false)
    expect(l.dados.get('c/abc123XYZ').enviados).toEqual([])
  })
  it('ativo: envia o email certo, regista-o e junta a etiqueta do passo', async () => {
    const l = loja()
    await registarSeguimento(l, base)
    const { pedidos, pedir } = ghl()
    const r = await correr({ loja: l, token: 't', ativo: true, agora: t0 + 2 * HORA, pedir, log: () => {} })
    expect(r.enviados).toBe(1)
    const envio = pedidos.find(p => p.url.endsWith('/conversations/messages'))
    expect(envio.corpo).toMatchObject({ type: 'Email', contactId: 'abc123XYZ', emailFrom: 'pedro.ferreira@numerocinco.pt', subject: 'A tua vaga na N5 Clara ainda está por garantir' })
    expect(pedidos.find(p => p.url.endsWith('/tags')).corpo.tags).toEqual(['seguimento-1'])
    expect(l.dados.get('c/abc123XYZ').enviados).toEqual([t0 + 2 * HORA])
    /* na volta seguinte, logo a seguir, não há mais nada para enviar */
    expect((await correr({ loja: l, token: 't', ativo: true, agora: t0 + 2 * HORA + 15 * MIN, pedir, log: () => {} })).enviados).toBe(0)
  })
  it('quem já pagou no GHL sai sem receber nada; com as vagas esgotadas não corre', async () => {
    const l = loja()
    await registarSeguimento(l, base)
    const { pedidos, pedir } = ghl({ tags: ['n5-clara', 'pre-reserva-paga'] })
    const r = await correr({ loja: l, token: 't', ativo: true, agora: t0 + 2 * HORA, pedir, log: () => {} })
    expect(r).toMatchObject({ parados: 1, enviados: 0 })
    expect(pedidos.some(p => p.url.endsWith('/conversations/messages'))).toBe(false)
    expect(l.dados.get('c/abc123XYZ').fim).toBe('pre-reserva-paga')
    expect((await correr({ loja: loja(), token: 't', ativo: true, esgotado: true, pedir, log: () => {} })).vistos).toBe(0)
  })
})

describe('/api/pagou', () => {
  it('responde 204 sem corpo (um 204 com corpo rebenta a função), recusa outras origens e outros métodos', async () => {
    const { default: pagou } = await import('../netlify/functions/pagou.mjs')
    const pedido = (o = {}) => new Request('https://clara.numerocinco.pt/api/pagou', { method: 'POST', headers: { origin: 'https://clara.numerocinco.pt', 'content-type': 'application/json' }, body: JSON.stringify({ codigo: 'ABC234' }), ...o })
    const r = await pagou(pedido())
    expect(r.status).toBe(204)
    expect(await r.text()).toBe('')
    expect((await pagou(pedido({ headers: { origin: 'https://mau.example' } }))).status).toBe(403)
    expect((await pagou(new Request('https://clara.numerocinco.pt/api/pagou'))).status).toBe(405)
  })
})
