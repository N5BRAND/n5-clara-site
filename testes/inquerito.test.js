import { describe, it, expect, vi } from 'vitest'
import { PERGUNTAS, limparRespostas, lerRespostas, planoDoConsultor, resumoInquerito } from '../src/logica/inquerito.js'
import { codigoVoucher, emailVoucher, enviarEmailVoucher, REMETENTE } from '../netlify/voucher.js'
import { paraGhl } from '../netlify/ghl.js'
import { INQUERITO } from '../src/landing/paginas.js'

const RESPOSTAS = {
  experiencia: '2-5', rede: 'remax', leads: '10-30', resposta: 'horas', admin: '6-10',
  dores: ['crm', 'angariar', 'proprietarios'], perdes: 'lead-fria', uteis: ['copiloto', 'particulares'],
  resolver: '  quero   menos papelada ', objetivo: 'tempo', valor: '50-100',
}

describe('inquérito: perguntas e respostas', () => {
  it('cada pergunta tem id único e as de escolha têm opções', () => {
    const ids = PERGUNTAS.map(p => p.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const p of PERGUNTAS.filter(q => q.tipo !== 'texto')) expect(p.opcoes.length).toBeGreaterThan(1)
  })

  it('só guarda respostas que existem: valores inventados, a mais ou vazios ficam de fora', () => {
    const r = limparRespostas({ rede: 'inventada', leads: '10-30', dores: ['crm', 'crm', 'x', 'leads', 'base', 'chamadas'], resolver: '   ', lixo: 'sim' })
    expect(r).toEqual({ leads: '10-30', dores: ['crm', 'leads', 'base'] })
  })

  it('o texto livre fica limpo e com 300 letras no máximo', () => {
    expect(limparRespostas({ resolver: '  menos   papelada ' }).resolver).toBe('menos papelada')
    expect(limparRespostas({ resolver: 'a'.repeat(400) }).resolver).toHaveLength(300)
  })

  it('lê as respostas do formulário e ignora o que não é JSON', () => {
    expect(lerRespostas(JSON.stringify({ leads: '10-30' }))).toEqual({ leads: '10-30' })
    expect(lerRespostas('<script>')).toEqual({})
    expect(lerRespostas(undefined)).toEqual({})
  })

  it('o resumo para o GHL tem cada pergunta e a resposta', () => {
    const t = resumoInquerito(RESPOSTAS)
    expect(t).toContain('Em que marca ou rede trabalhas? RE/MAX')
    expect(t).toContain('Preencher o CRM; Angariar imóveis; Manter os proprietários informados')
    expect(t).toContain('quero menos papelada')
  })
})

describe('inquérito: o plano', () => {
  it('monta o dia, as 4 semanas e o plano a partir das respostas', () => {
    const p = planoDoConsultor(RESPOSTAS)
    expect(p.titulo).toBe('O teu plano com a Clara, para teres mais tempo, a faturar o mesmo')
    expect(p.dia.map(m => m.id)).toEqual(['plano', 'leads', 'voz', 'copiloto', 'particulares'])
    expect(p.semanas).toHaveLength(4)
    // as semanas 2 e 3 seguem o que a pessoa disse que custa mais: o CRM e depois a angariação
    expect(p.semanas[1].titulo).toBe('O CRM da tua marca preenchido')
    expect(p.semanas[2].titulo).toBe('Particulares para angariar')
    expect(p.plano).toBe('elite')
    expect(p.pedidos).toEqual(['Manter os proprietários informados'])
    expect(p.pontos.map(x => x.id)).toEqual(['resposta', 'admin', 'leads'])
  })

  it('escolhe o plano que cobre o que a pessoa quer: Pro para particulares, Clara para o essencial', () => {
    expect(planoDoConsultor({ uteis: ['particulares'] }).plano).toBe('pro')
    expect(planoDoConsultor({ dores: ['base'] }).plano).toBe('pro')
    expect(planoDoConsultor({ uteis: ['chamadas'] }).plano).toBe('elite')
    expect(planoDoConsultor({ dores: ['leads', 'organizar'] }).plano).toBe('clara')
  })

  it('sem respostas, o plano é o dia por ordem e o plano Clara', () => {
    const p = planoDoConsultor({})
    expect(p.dia.map(m => m.id)).toEqual(['plano'])
    expect(p.plano).toBe('clara')
    expect(p.semanas).toHaveLength(4)
  })

  it('o copiloto só entra para quem tem CRM da marca ou o escolheu', () => {
    expect(planoDoConsultor({ rede: 'independente', dores: ['crm'] }).dia.map(m => m.id)).not.toContain('copiloto')
    expect(planoDoConsultor({ rede: 'kw', dores: ['crm'] }).dia.map(m => m.id)).toContain('copiloto')
  })

  it('o desconto depois dos 2 meses oferecidos é o da oferta: 50% na primeira mensalidade', () => {
    expect(planoDoConsultor({ uteis: ['chamadas'] }).depois).toContain('73,50 € em vez de 147 €')
    expect(planoDoConsultor({ uteis: ['particulares'] }).depois).toContain('48,50 € em vez de 97 €')
  })
})

describe('inquérito: voucher e email', () => {
  it('o mesmo email dá sempre o mesmo voucher', () => {
    const a = codigoVoucher('Rui@Rede.pt ')
    expect(a).toMatch(/^ELITE-[A-HJ-NP-Z2-9]{6}$/)
    expect(codigoVoucher('rui@rede.pt')).toBe(a)
    expect(codigoVoucher('ana@rede.pt')).not.toBe(a)
  })

  it('o email tem o voucher, o plano e as condições, sem o texto livre e sem falar em IVA', () => {
    const { assunto, html } = emailVoucher({ nome: '<b>Rui</b> Silva', codigo: 'ELITE-ABC234', respostas: RESPOSTAS })
    expect(assunto).toBe('O teu voucher: 2 meses da Clara Elite oferecidos')
    expect(html).toContain('ELITE-ABC234')
    expect(html).toContain('Olá &lt;b&gt;Rui&lt;/b&gt;,')
    expect(html).toContain('O CRM da tua marca preenchido')
    expect(html).toContain('Ativa-se entre 1 e 31 de dezembro de 2026.')
    expect(html).not.toContain('papelada')
    expect(html).not.toMatch(/\bIVA\b/)
  })

  it('em modo de teste o assunto diz que é um teste', () => {
    expect(emailVoucher({ nome: 'Teste', codigo: 'ELITE-ABC234', respostas: {}, teste: true }).assunto.startsWith('[Teste] ')).toBe(true)
  })

  it('envia o email pelo GHL, a partir do email do Pedro, para o contacto do inquérito', async () => {
    const pedir = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) })
    await enviarEmailVoucher({ contactId: 'c1', nome: 'Rui', email: 'rui@rede.pt', respostas: RESPOSTAS, token: 'tk', pedir })
    const [url, opcoes] = pedir.mock.calls[0]
    expect(url).toBe('https://services.leadconnectorhq.com/conversations/messages')
    const corpo = JSON.parse(opcoes.body)
    expect(corpo).toMatchObject({ type: 'Email', contactId: 'c1', emailFrom: REMETENTE })
    expect(REMETENTE).toBe('pedro.ferreira@numerocinco.pt')
    expect(corpo.html).toContain(codigoVoucher('rui@rede.pt'))
  })

  it('um erro do GHL no envio não passa calado', async () => {
    const pedir = vi.fn().mockResolvedValue({ ok: false, status: 401 })
    await expect(enviarEmailVoucher({ contactId: 'c1', email: 'rui@rede.pt', respostas: {}, token: 'tk', pedir })).rejects.toThrow('401')
  })

  it('o contacto do inquérito fica no GHL com o voucher, o plano e as respostas', () => {
    const r = paraGhl('inquerito-clara', { nome: 'Rui Silva', email: 'rui@rede.pt', telefone: '912345678', respostas: JSON.stringify(RESPOSTAS), voucher: 'ELITE-ABC234', origem: '/inquerito/' })
    expect(r.contacto).toEqual({ firstName: 'Rui', lastName: 'Silva', email: 'rui@rede.pt', phone: '+351912345678', source: 'Inquérito N5 Clara' })
    expect(r.etiquetas).toEqual(['n5-clara', 'inquerito-clara', 'voucher-elite-2-meses', 'plano-elite', 'pagina-inquerito'])
    expect(r.nota).toContain('Voucher: ELITE-ABC234')
    expect(r.nota).toContain('quero menos papelada')
  })

  it('um inquérito de teste fica só com a etiqueta «teste»', () => {
    const r = paraGhl('inquerito-clara', { nome: 'Teste', email: 'teste@exemplo.pt', respostas: '{}', voucher: 'ELITE-ABC234', teste: '1' })
    expect(r.etiquetas).toEqual(['n5-clara', 'teste'])
  })
})

describe('inquérito: a página', () => {
  it('diz o número certo de perguntas e não fala em IVA', () => {
    expect(INQUERITO.voucher.titulo.startsWith(`${PERGUNTAS.length} perguntas`)).toBe(true)
    expect(JSON.stringify(INQUERITO)).not.toMatch(/\bIVA\b/)
  })
})
