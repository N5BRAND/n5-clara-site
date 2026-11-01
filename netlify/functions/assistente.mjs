import Anthropic from '@anthropic-ai/sdk'
import { conversaValida, juntarContacto, temContacto, transcricao } from '../../src/assistente/conversa.js'
import { pedirAoModelo, limparResposta, respostaSemModelo } from '../assistente/responder.js'
import { registarConversa } from '../ghl.js'

/* POST /api/assistente { mensagens, contacto, ghl: { contacto, nota }, pagina, teste } → a resposta da Clara.
   ANTHROPIC_API_KEY nas variáveis do site liga o modelo (ASSISTENTE_MODELO troca-o); sem ela, a Clara responde às
   sugestões com o que o site diz e pede o contacto. Com nome e contacto, a conversa vai para uma nota do contacto no GHL
   (GHL_TOKEN e GHL_LOCATION_ID, as mesmas do formulário). */
const ORIGENS = /^(https:\/\/(clara\.numerocinco\.pt|([\w-]+--)?n5-clara-site\.netlify\.app)|http:\/\/localhost(:\d+)?)$/

const json = (corpo, estado = 200) => new Response(JSON.stringify(corpo), { status: estado, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } })

export default async req => {
  if (req.method !== 'POST') return json({ erro: 'metodo' }, 405)
  const origem = req.headers.get('origin')
  if (origem && !ORIGENS.test(origem)) return json({ erro: 'origem' }, 403)
  let corpo
  try { corpo = await req.json() } catch { return json({ erro: 'corpo' }, 400) }
  const { mensagens, contacto = {}, ghl = {}, pagina = '', teste = false } = corpo || {}
  if (!conversaValida(mensagens)) return json({ erro: 'conversa' }, 400)

  const { ANTHROPIC_API_KEY: chave, ASSISTENTE_MODELO: modelo, GHL_TOKEN: token, GHL_LOCATION_ID: localizacao } = process.env
  const esgotado = process.env.VITE_ESGOTADO === '1'
  let saida = null
  if (chave) {
    try {
      const cliente = new Anthropic({ apiKey: chave, timeout: 9000, maxRetries: 0 })
      saida = await pedirAoModelo({ cliente, mensagens, esgotado, ...(modelo ? { modelo } : {}) })
    } catch (e) {
      console.error('assistente: o modelo falhou:', e.status || e.message)
    }
  }
  const r = limparResposta(saida || respostaSemModelo(mensagens, { esgotado, contacto }))
  if (!r.resposta) Object.assign(r, limparResposta(respostaSemModelo(mensagens, { esgotado, contacto })))
  const pessoa = juntarContacto(contacto, r.contacto)

  let registo = { contacto: String(ghl.contacto || ''), nota: String(ghl.nota || '') }
  if (temContacto(pessoa) && token && localizacao) {
    try {
      const pag = String(pagina).slice(0, 200)
      registo = await registarConversa({
        contacto: pessoa, conversa: transcricao([...mensagens, { de: 'clara', texto: r.resposta }], { pagina: pag }), pagina: pag,
        teste: teste === true, contactoId: registo.contacto, notaId: registo.nota, token, localizacao,
      })
    } catch (e) {
      console.error('assistente: GHL falhou:', e.message)
    }
  }
  return json({ resposta: r.resposta, sugestoes: r.sugestoes, contacto: pessoa, ghl: registo, modelo: !!saida })
}

/* contra abusos: cada visitante pode mandar até 20 mensagens por minuto */
export const config = { path: '/api/assistente', rateLimit: { windowLimit: 20, windowSize: 60, aggregateBy: ['ip', 'domain'] } }
