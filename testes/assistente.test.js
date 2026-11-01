import { describe, it, expect } from 'vitest'
import { SAUDACAO, SUGESTOES, conversaValida, paraModelo, contactoDe, juntarContacto, temContacto, transcricao } from '../src/assistente/conversa.js'
import { instrucoes, ESQUEMA, MODELO } from '../netlify/assistente/conhecimento.js'
import { pedirAoModelo, limparResposta, respostaSemModelo } from '../netlify/assistente/responder.js'
import { registarConversa } from '../netlify/ghl.js'
import { PRECOS, PRE_RESERVA } from '../src/logica/pagamento.js'
import { PROGRAMA } from '../src/logica/indicacoes.js'

const PROIBIDO = /aprovação|aprovar|ilustrativ|IVA\b|—|–/

const v = texto => ({ de: 'visitante', texto })
const c = texto => ({ de: 'clara', texto })

describe('conversa do assistente', () => {
  it('a Clara abre com a pergunta de ajuda e 4 sugestões, sem palavras proibidas', () => {
    expect(SAUDACAO).toMatch(/Precisas de ajuda/)
    expect(SUGESTOES).toHaveLength(4)
    expect(SAUDACAO + SUGESTOES.join(' ')).not.toMatch(PROIBIDO)
  })
  it('só aceita conversas que acabam no visitante e não são enormes', () => {
    expect(conversaValida([c(SAUDACAO), v('Olá')])).toBe(true)
    expect(conversaValida([c(SAUDACAO)])).toBe(false)
    expect(conversaValida([v('x'.repeat(5000))])).toBe(false)
    expect(conversaValida(Array.from({ length: 41 }, () => v('a')))).toBe(false)
    expect(conversaValida('olá')).toBe(false)
  })
  it('para a API começa no visitante e junta mensagens seguidas', () => {
    expect(paraModelo([c(SAUDACAO), v('Quanto custa?'), v('E a Elite?'), c('147 €'), v('Ok')])).toEqual([
      { role: 'user', content: 'Quanto custa?\n\nE a Elite?' },
      { role: 'assistant', content: '147 €' },
      { role: 'user', content: 'Ok' },
    ])
  })
  it('o contacto passa pela validação do formulário e o novo não apaga o antigo', () => {
    expect(contactoDe({ nome: 'Rui', email: 'rui@', telefone: '912 345 678' })).toEqual({ nome: 'Rui', email: '', telefone: '912 345 678' })
    expect(juntarContacto({ nome: 'Rui', telefone: '912345678' }, { nome: '', email: 'rui@rede.pt' })).toEqual({ nome: 'Rui', email: 'rui@rede.pt', telefone: '912345678' })
    expect(temContacto({ nome: 'Rui', email: '' })).toBe(false)
    expect(temContacto({ nome: 'Rui', telefone: '912345678' })).toBe(true)
  })
  it('a transcrição tem a página e as falas de cada lado', () => {
    const t = transcricao([c(SAUDACAO), v('Quanto custa?')], { pagina: '/leads/', quando: new Date('2026-11-01T15:00:00Z') })
    expect(t).toContain('Página: /leads/')
    expect(t).toContain(`Clara: ${SAUDACAO}`)
    expect(t).toContain('Visitante: Quanto custa?')
  })
})

describe('o que a Clara sabe', () => {
  const texto = instrucoes()
  it('usa os preços e a oferta do site', () => {
    for (const p of Object.values(PRECOS)) expect(texto).toContain(p.mensal)
    expect(texto).toContain(PRE_RESERVA)
    expect(texto).toContain(`${PROGRAMA.vencedores} consultores`)
    expect(texto).toContain(PROGRAMA.fim)
  })
  it('pede o nome e o contacto e cumpre as regras da casa', () => {
    expect(texto).toMatch(/como te chamas/)
    expect(texto).toMatch(/telemóvel ou o email/)
    expect(texto).toMatch(/Nunca fales em IVA/)
    expect(texto).toMatch(/precisam de aprovação/)
  })
  it('com as vagas esgotadas fala da lista de espera', () => {
    expect(instrucoes({ esgotado: true })).toMatch(/lista de espera/)
    expect(instrucoes()).toBe(instrucoes())
  })
  it('o esquema obriga a todos os campos', () => {
    expect(ESQUEMA.required.sort()).toEqual(['email', 'nome', 'resposta', 'sugestoes', 'telefone'])
    expect(ESQUEMA.additionalProperties).toBe(false)
  })
})

describe('pedirAoModelo', () => {
  const resposta = JSON.stringify({ resposta: 'Olá!', nome: '', email: '', telefone: '', sugestoes: [] })
  const falso = (r = { stop_reason: 'end_turn', content: [{ type: 'thinking', thinking: '' }, { type: 'text', text: resposta }] }) => {
    const pedidos = []
    const criar = async p => { pedidos.push(p); return r }
    return { pedidos, beta: { messages: { create: criar } }, messages: { create: criar } }
  }
  it('pede JSON com o esquema, pouco esforço, cache e modelo de reserva', async () => {
    const cliente = falso()
    expect(await pedirAoModelo({ cliente, mensagens: [c(SAUDACAO), v('Olá')] })).toEqual(JSON.parse(resposta))
    const p = cliente.pedidos[0]
    expect(p.model).toBe(MODELO)
    expect(p.output_config).toEqual({ effort: 'low', format: { type: 'json_schema', schema: ESQUEMA } })
    expect(p.system[0].cache_control).toEqual({ type: 'ephemeral' })
    expect(p.fallbacks).toBe('default')
    expect(p.betas).toEqual(['server-side-fallback-2026-07-01'])
    expect(p.messages).toEqual([{ role: 'user', content: 'Olá' }])
  })
  it('com o Haiku não pede modelo de reserva', async () => {
    const cliente = falso()
    await pedirAoModelo({ cliente, mensagens: [v('Olá')], modelo: 'claude-haiku-5-5' })
    expect(cliente.pedidos[0].fallbacks).toBeUndefined()
  })
  it('recusa ou resposta cortada dão null', async () => {
    expect(await pedirAoModelo({ cliente: falso({ stop_reason: 'refusal', content: [] }), mensagens: [v('x')] })).toBeNull()
    expect(await pedirAoModelo({ cliente: falso({ stop_reason: 'max_tokens', content: [{ type: 'text', text: '{"resp' }] }), mensagens: [v('x')] })).toBeNull()
  })
  it('limparResposta tira travessões, valida o contacto e corta as sugestões', () => {
    const r = limparResposta({ resposta: 'Sim — claro', nome: 'Ana', email: 'ana@', telefone: '', sugestoes: ['a', 'b', 'c', 'd'] })
    expect(r).toEqual({ resposta: 'Sim, claro', sugestoes: ['a', 'b', 'c'], contacto: { nome: 'Ana', email: '', telefone: '' } })
  })
})

describe('respostaSemModelo (sem chave da API)', () => {
  it('responde às sugestões e pede o nome', () => {
    const r = respostaSemModelo([c(SAUDACAO), v('Quanto custa?')])
    expect(r.resposta).toContain('53 €')
    expect(r.resposta).toMatch(/como te chamas\?$/)
    expect(r.resposta).not.toMatch(PROIBIDO)
  })
  it('guarda o nome, pede o contacto e agradece quando o recebe', () => {
    const m = [c(SAUDACAO), v('Quanto custa?'), c('… Já agora, como te chamas?'), v('Ana Silva')]
    const r1 = respostaSemModelo(m)
    expect(r1.nome).toBe('Ana Silva')
    expect(r1.resposta).toMatch(/Prazer, Ana! .*telemóvel ou email/)
    const r2 = respostaSemModelo([...m, c(r1.resposta), v('o meu é 912 345 678')], { contacto: { nome: 'Ana Silva' } })
    expect(r2).toMatchObject({ nome: 'Ana Silva', telefone: '912 345 678' })
    expect(r2.resposta).toMatch(/Obrigada, Ana/)
  })
  it('com as vagas esgotadas a pré-reserva fala da lista de espera', () => {
    expect(respostaSemModelo([v('Como funciona a pré-reserva?')], { esgotado: true }).resposta).toMatch(/lista de espera/)
  })
})

describe('registarConversa no GHL', () => {
  const ghl = (respostas = {}) => {
    const pedidos = []
    const pedir = async (url, o) => {
      pedidos.push({ url: url.replace('https://services.leadconnectorhq.com', ''), metodo: o.method, corpo: JSON.parse(o.body) })
      const chave = `${o.method} ${url.split('/').slice(3, 6).join('/')}`
      const r = respostas[chave] || { ok: true, status: 200, json: { contact: { id: 'abcDEF12345' }, note: { id: 'nota1234567' } } }
      return { ok: r.ok, status: r.status, json: async () => r.json }
    }
    return { pedidos, pedir }
  }
  const base = { contacto: { nome: 'Ana Silva', email: 'ana@rede.pt', telefone: '912345678' }, conversa: 'Visitante: Olá', pagina: '/leads/', token: 't', localizacao: 'loc' }

  it('primeira vez: contacto, etiquetas e uma nota nova', async () => {
    const { pedidos, pedir } = ghl()
    expect(await registarConversa({ ...base, pedir })).toEqual({ contacto: 'abcDEF12345', nota: 'nota1234567' })
    expect(pedidos.map(p => `${p.metodo} ${p.url}`)).toEqual(['POST /contacts/upsert', 'POST /contacts/abcDEF12345/tags', 'POST /contacts/abcDEF12345/notes'])
    expect(pedidos[0].corpo).toMatchObject({ locationId: 'loc', firstName: 'Ana', lastName: 'Silva', email: 'ana@rede.pt', phone: '+351912345678' })
    expect(pedidos[1].corpo.tags).toEqual(expect.arrayContaining(['n5-clara', 'assistente']))
  })
  it('a seguir: atualiza a mesma nota, sem repetir etiquetas', async () => {
    const { pedidos, pedir } = ghl()
    expect(await registarConversa({ ...base, contactoId: 'abcDEF12345', notaId: 'nota1234567', pedir })).toEqual({ contacto: 'abcDEF12345', nota: 'nota1234567' })
    expect(pedidos.map(p => `${p.metodo} ${p.url}`)).toEqual(['POST /contacts/upsert', 'PUT /contacts/abcDEF12345/notes/nota1234567'])
  })
  it('se a nota foi apagada no GHL, escreve outra', async () => {
    const { pedidos, pedir } = ghl({ 'PUT contacts/abcDEF12345/notes': { ok: false, status: 404, json: {} } })
    await registarConversa({ ...base, contactoId: 'abcDEF12345', notaId: 'nota1234567', pedir })
    expect(pedidos.at(-1)).toMatchObject({ metodo: 'POST', url: '/contacts/abcDEF12345/notes' })
  })
  it('conversa de teste: só a etiqueta teste', async () => {
    const { pedidos, pedir } = ghl()
    await registarConversa({ ...base, teste: true, pedir })
    expect(pedidos[1].corpo.tags).toEqual(['n5-clara', 'teste'])
    expect(pedidos[2].corpo.body).toMatch(/^Conversa de teste\./)
  })
})
