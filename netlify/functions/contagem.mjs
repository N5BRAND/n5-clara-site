import { contarPreReservas, listarSessoes, resumoContagem } from '../contagem.js'

/* GET /.netlify/functions/contagem?codigo=ABC234 → a contagem do programa «Passa a Clara» para esse código.
   Precisa de STRIPE_CHAVE_LEITURA (chave restrita da Stripe, só leitura) nas variáveis do site; sem ela,
   responde { disponivel: false } e a página diz que a contagem aparece em breve. */
export const handler = async event => {
  const cabecalhos = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=120' }
  const responder = corpo => ({ statusCode: 200, headers: cabecalhos, body: JSON.stringify(corpo) })
  const chave = process.env.STRIPE_CHAVE_LEITURA
  if (!chave) return responder({ disponivel: false })
  try {
    const codigo = String(event.queryStringParameters?.codigo || '').trim().toUpperCase()
    const contagens = contarPreReservas(await listarSessoes(chave))
    return responder({ disponivel: true, ...resumoContagem(contagens, codigo), atualizado: new Date().toISOString() })
  } catch (e) {
    console.error('contagem falhou:', e.message)
    return responder({ disponivel: false })
  }
}
