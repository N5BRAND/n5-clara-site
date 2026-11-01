import { paraModelo, contactoDe } from '../../src/assistente/conversa.js'
import { instrucoes, ESQUEMA, MODELO, ESFORCO } from './conhecimento.js'

/* o modelo só vê as últimas mensagens: cada pedido tem um tamanho máximo, e o custo também */
export const MENSAGENS_PARA_MODELO = 16

/* pede a resposta à OpenAI (API Responses); devolve null se o modelo recusar, cortar a resposta ou não devolver JSON.
   identificador: o IP cifrado, para a OpenAI detetar abusos sem saber quem é. pedir: fetch (os testes passam um falso) */
export async function pedirAoModelo({ chave, mensagens, esgotado = false, modelo = MODELO, esforco = ESFORCO, identificador = '', pedir = fetch }) {
  const corpo = {
    model: modelo,
    instructions: instrucoes({ esgotado }),
    input: paraModelo(mensagens.slice(-MENSAGENS_PARA_MODELO)),
    max_output_tokens: 800,
    store: false,
    reasoning: { effort: esforco },
    text: { format: { type: 'json_schema', name: 'resposta_clara', strict: true, schema: ESQUEMA } },
    prompt_cache_key: 'n5-clara-assistente',
    ...(identificador ? { safety_identifier: identificador } : {}),
  }
  const r = await pedir('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${chave}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(corpo),
    signal: AbortSignal.timeout(9000),
  })
  if (!r.ok) throw Object.assign(new Error(`a OpenAI respondeu ${r.status}`), { status: r.status })
  const d = await r.json()
  if (d.status !== 'completed') return null
  const conteudo = (d.output || []).filter(o => o.type === 'message').flatMap(o => o.content || [])
  if (conteudo.some(c => c.type === 'refusal')) return null
  try { return JSON.parse(conteudo.filter(c => c.type === 'output_text').map(c => c.text).join('')) } catch { return null }
}

/* o que sai para o navegador: texto aparado, contacto validado e no máximo 3 sugestões curtas */
export function limparResposta(s) {
  const resposta = String(s?.resposta || '').replace(/\s*[—–]\s*/g, ', ').trim().slice(0, 1200)
  const sugestoes = (Array.isArray(s?.sugestoes) ? s.sugestoes : []).map(x => String(x).trim()).filter(x => x && x.length <= 60).slice(0, 3)
  return { resposta, sugestoes, contacto: contactoDe(s) }
}

/* as respostas sem modelo vivem em src/, porque o navegador também as usa quando o pedido falha */
export { respostaSemModelo } from '../../src/assistente/semModelo.js'
