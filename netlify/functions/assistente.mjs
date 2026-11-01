import { createHash } from 'node:crypto'
import { getStore } from '@netlify/blobs'
import { conversaValida, juntarContacto, temContacto, transcricao } from '../../src/assistente/conversa.js'
import { pedirAoModelo, limparResposta, respostaSemModelo } from '../assistente/responder.js'
import { consumir, limitesDoAmbiente } from '../assistente/limites.js'
import { registarConversa } from '../ghl.js'

/* POST /api/assistente { mensagens, contacto, ghl: { contacto, nota }, pagina, teste } → a resposta da Clara.
   OPENAI_API_KEY nas variáveis do site liga o modelo; sem ela, a Clara responde às sugestões com o que o site diz e pede
   o contacto. Com nome e contacto, a conversa vai para uma nota do contacto no GHL (GHL_TOKEN e GHL_LOCATION_ID).
   Contra abusos, sem nunca travar uma conversa normal (quem conversa nunca vê um limite):
   1. a Netlify só trava inundações: mais de 60 pedidos por minuto do mesmo IP (config no fim do ficheiro); o navegador,
      se for travado, tenta outra vez e, se não der, responde com os textos fixos;
   2. só respondem pedidos do próprio site, com conversas de 40 mensagens e 800 caracteres por mensagem, no máximo;
   3. cada IP (guardado cifrado) chama o modelo no máximo 30 vezes em 10 minutos e 150 por dia, e o site todo 3000 por dia
      (Netlify Blobs; ver netlify/assistente/limites.js). Acima disso, a conversa segue com os textos fixos;
   4. cada pedido ao modelo leva só as últimas 16 mensagens e a resposta tem um teto de tokens. */
const ORIGENS = /^(https:\/\/(clara\.numerocinco\.pt|([\w-]+--)?n5-clara-site\.netlify\.app)|http:\/\/localhost(:\d+)?)$/

const json = (corpo, estado = 200) => new Response(JSON.stringify(corpo), { status: estado, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } })

/* o IP nunca se guarda: só um resumo cifrado, que não volta atrás */
const cifrarIp = (ip, sal) => createHash('sha256').update(`${sal}|${ip}`).digest('hex').slice(0, 32)

/* pede ao modelo se ainda houver quota; devolve { saida, limitado } */
async function perguntar({ mensagens, esgotado, context, env }) {
  const { OPENAI_API_KEY: chave, OPENAI_MODELO: modelo, OPENAI_ESFORCO: esforco } = env
  if (!chave) return { saida: null, limitado: false }
  const id = cifrarIp(context?.ip || 'sem-ip', context?.site?.id || 'n5-clara-site')
  let quota = { permitido: false, motivo: 'sem-contadores' }
  try {
    quota = await consumir({ loja: getStore({ name: 'assistente-limites', consistency: 'strong' }), id, limites: limitesDoAmbiente(env) })
  } catch (e) {
    console.error('assistente: contadores indisponíveis, sem modelo:', e.message)
  }
  /* sem contadores não se chama o modelo, mas a pessoa não passou limite nenhum: recebe a resposta normal sem modelo */
  if (!quota.permitido) {
    if (quota.motivo !== 'sem-contadores') console.log('assistente: limite atingido:', quota.motivo)
    return { saida: null, limitado: quota.motivo !== 'sem-contadores' }
  }
  if (quota.limpar) context?.waitUntil?.(quota.limpar().catch(e => console.error('assistente: limpeza falhou:', e.message)))
  try {
    return { saida: await pedirAoModelo({ chave, mensagens, esgotado, identificador: id, ...(modelo ? { modelo } : {}), ...(esforco ? { esforco } : {}) }), limitado: false }
  } catch (e) {
    console.error('assistente: a OpenAI falhou:', e.status || e.message)
    return { saida: null, limitado: false }
  }
}

export default async (req, context) => {
  if (req.method !== 'POST') return json({ erro: 'metodo' }, 405)
  const origem = req.headers.get('origin')
  if (origem && !ORIGENS.test(origem)) return json({ erro: 'origem' }, 403)
  let corpo
  try { corpo = await req.json() } catch { return json({ erro: 'corpo' }, 400) }
  const { mensagens, contacto = {}, ghl = {}, pagina = '', teste = false } = corpo || {}
  if (!conversaValida(mensagens)) return json({ erro: 'conversa' }, 400)

  const env = process.env
  const esgotado = env.VITE_ESGOTADO === '1'
  const { saida, limitado } = await perguntar({ mensagens, esgotado, context, env })
  let r = limparResposta(saida || respostaSemModelo(mensagens, { esgotado, contacto }))
  if (!r.resposta) r = limparResposta(respostaSemModelo(mensagens, { esgotado, contacto }))
  const pessoa = juntarContacto(contacto, r.contacto)

  let registo = { contacto: String(ghl.contacto || ''), nota: String(ghl.nota || '') }
  if (temContacto(pessoa) && env.GHL_TOKEN && env.GHL_LOCATION_ID) {
    try {
      const pag = String(pagina).slice(0, 200)
      registo = await registarConversa({
        contacto: pessoa, conversa: transcricao([...mensagens, { de: 'clara', texto: r.resposta }], { pagina: pag }), pagina: pag,
        teste: teste === true, contactoId: registo.contacto, notaId: registo.nota, token: env.GHL_TOKEN, localizacao: env.GHL_LOCATION_ID,
      })
    } catch (e) {
      console.error('assistente: GHL falhou:', e.message)
    }
  }
  return json({ resposta: r.resposta, sugestoes: r.sugestoes, contacto: pessoa, ghl: registo, modelo: !!saida, limitado })
}

/* camada 1: a Netlify bloqueia com 429 quem passar de 60 pedidos por minuto (por IP, neste domínio): só inundações */
export const config = { path: '/api/assistente', rateLimit: { windowLimit: 60, windowSize: 60, aggregateBy: ['ip', 'domain'] } }
