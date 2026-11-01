import { getStore } from '@netlify/blobs'
import { marcarPago, juntarEtiquetas } from '../seguimento.js'

/* POST /api/pagou { codigo } — a página de confirmação da pré-reserva avisa que esta pessoa pagou: os emails de
   seguimento param e o contacto fica com a etiqueta pre-reserva-paga no GHL. O código é o do Passa a Clara, guardado no
   navegador onde a pessoa se inscreveu. */
const ORIGENS = /^(https:\/\/(clara\.numerocinco\.pt|([\w-]+--)?n5-clara-site\.netlify\.app)|http:\/\/localhost(:\d+)?)$/

export default async req => {
  if (req.method !== 'POST') return new Response('', { status: 405 })
  const origem = req.headers.get('origin')
  if (origem && !ORIGENS.test(origem)) return new Response('', { status: 403 })
  let codigo = ''
  try { codigo = String((await req.json())?.codigo || '').toUpperCase() } catch { return new Response('', { status: 400 }) }
  try {
    const pagos = await marcarPago(getStore({ name: 'seguimento', consistency: 'strong' }), codigo)
    const token = process.env.GHL_TOKEN
    if (token) await Promise.all(pagos.map(contactId => juntarEtiquetas({ contactId, tags: ['pre-reserva-paga'], token }).catch(e => console.error('pagou: GHL falhou:', e.message))))
    console.log('pagou:', pagos.length, 'contacto(s) fora do seguimento')
  } catch (e) {
    console.error('pagou: falhou:', e.message)
  }
  return new Response(null, { status: 204 }) // um 204 não pode ter corpo, nem vazio
}

export const config = { path: '/api/pagou', rateLimit: { windowLimit: 30, windowSize: 60, aggregateBy: ['ip', 'domain'] } }
