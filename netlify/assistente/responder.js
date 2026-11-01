import { SUGESTOES, paraModelo, contactoDe } from '../../src/assistente/conversa.js'
import { instrucoes, ESQUEMA, MODELO } from './conhecimento.js'

/* pede a resposta ao modelo; devolve null se ele recusar ou a resposta não vier em JSON.
   cliente: um Anthropic do SDK (os testes passam um falso) */
export async function pedirAoModelo({ cliente, mensagens, esgotado = false, modelo = MODELO }) {
  const pedido = {
    model: modelo,
    max_tokens: 4000,
    cache_control: { type: 'ephemeral' },
    system: [{ type: 'text', text: instrucoes({ esgotado }), cache_control: { type: 'ephemeral' } }],
    messages: paraModelo(mensagens),
    output_config: { effort: 'low', format: { type: 'json_schema', schema: ESQUEMA } },
  }
  /* se o modelo recusar, a API tenta outro modelo no mesmo pedido; o Haiku não tem esta opção */
  const r = modelo.startsWith('claude-haiku')
    ? await cliente.messages.create(pedido)
    : await cliente.beta.messages.create({ ...pedido, betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' })
  if (r.stop_reason === 'refusal' || r.stop_reason === 'max_tokens') return null
  const texto = r.content.find(b => b.type === 'text')?.text
  try { return JSON.parse(texto) } catch { return null }
}

/* o que sai para o navegador: texto aparado, contacto validado e no máximo 3 sugestões curtas */
export function limparResposta(s) {
  const resposta = String(s?.resposta || '').replace(/\s*[—–]\s*/g, ', ').trim().slice(0, 1200)
  const sugestoes = (Array.isArray(s?.sugestoes) ? s.sugestoes : []).map(x => String(x).trim()).filter(x => x && x.length <= 60).slice(0, 3)
  return { resposta, sugestoes, contacto: contactoDe(s) }
}

/* sem chave da API (ou se a API falhar), a Clara responde às sugestões com o que o site diz, pede o nome e o contacto
   e, ao resto, diz que a equipa da Nº5 responde */
const RESPOSTAS = esgotado => ({
  [SUGESTOES[0]]: 'Respondo e qualifico as tuas leads em minutos, faço os follow-ups, organizo o teu plano do dia e registo as tuas notas de voz na ficha certa. Tu ficas com o que só tu fazes: estar com clientes.',
  [SUGESTOES[1]]: 'O plano Clara fica a 53 € por mês, a Pro a 97 € e a Elite a 147 €, por consultor e sem fidelização. A pré-reserva é de 27 € e paga o teu primeiro mês, com a Clara Elite completa.',
  [SUGESTOES[2]]: esgotado
    ? 'As 25 vagas com pré-reserva já esgotaram. Se entrares na lista de espera, a partir de 1 de dezembro abrimos 30 vagas por semana, pela ordem da lista.'
    : 'Pagas 27 € e ficas com uma das 25 vagas para 1 de dezembro. Esses 27 € pagam o teu primeiro mês, com a Clara Elite completa, e se continuares na Pro ou na Elite tens 50% na primeira mensalidade.',
  [SUGESTOES[3]]: 'Sim: o copiloto preenche e grava o CRM da tua marca por ti. Vem incluído durante 3 meses com a pré-reserva e depois continua na Clara Elite.',
})

const PEDE_NOME = 'Já agora, como te chamas?'
const pedeContacto = nome => `Prazer, ${nome}! Deixas-me o teu telemóvel ou email? Assim a equipa da Nº5 pode enviar-te os detalhes.`
const EMAIL = /[^\s@]+@[^\s@]+\.[^\s@]{2,}/
const TELEFONE = /(?:\+|00)?\d[\d\s-]{7,16}\d/

export function respostaSemModelo(mensagens, { esgotado = false, contacto = {} } = {}) {
  const visitante = mensagens.filter(m => m.de === 'visitante')
  const ultima = visitante[visitante.length - 1].texto.trim()
  const anterior = [...mensagens].reverse().find(m => m.de === 'clara')?.texto || ''
  const c = contactoDe(contacto)
  for (const m of visitante) {
    c.email ||= contactoDe({ email: m.texto.match(EMAIL)?.[0] }).email
    c.telefone ||= contactoDe({ telefone: m.texto.match(TELEFONE)?.[0] }).telefone
  }
  /* a resposta à pergunta do nome: curta, sem números nem arrobas */
  if (!c.nome && anterior.endsWith(PEDE_NOME) && /^[\p{L}' .-]{2,60}$/u.test(ultima) && ultima.split(/\s+/).length <= 4) c.nome = ultima
  const base = { ...c, sugestoes: [] }
  const conhecida = RESPOSTAS(esgotado)[ultima]
  if (conhecida) return { ...base, resposta: c.nome ? conhecida : `${conhecida} ${PEDE_NOME}`, sugestoes: SUGESTOES.filter(s => s !== ultima).slice(0, 2) }
  if (c.nome && !c.email && !c.telefone && anterior.endsWith(PEDE_NOME)) return { ...base, resposta: pedeContacto(c.nome.split(' ')[0]) }
  if (c.nome && (c.email || c.telefone)) return { ...base, resposta: `Obrigada, ${c.nome.split(' ')[0]}! A equipa da Nº5 vai falar contigo. Entretanto, se tiveres mais perguntas, estou aqui.`, sugestoes: SUGESTOES.slice(0, 2) }
  return { ...base, resposta: `Boa pergunta! Essa não te sei responder aqui, mas a equipa da Nº5 responde-te.${c.nome ? '' : ` ${PEDE_NOME}`}`, sugestoes: SUGESTOES.slice(0, 2) }
}
