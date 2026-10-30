/* Contagem do programa «Passa a Clara» a partir das sessões de pagamento da Stripe (só leitura).
   Conta, por código (client_reference_id), as pré-reservas pagas e não reembolsadas até ao fim do programa.
   Devolve só números: nunca nomes nem emails. */
export const LINK_CLARA = 'plink_1UVEbARxjA6FBfLNUUGWxa0b'
export const FIM = Date.parse('2026-12-01T00:00:00Z') // fim de 30 de novembro em Lisboa (em novembro, Lisboa está em UTC)
const FORMATO = /^[A-HJ-NP-Z2-9]{6}$/

const reembolsada = s => {
  const cobranca = s.payment_intent?.latest_charge
  return !!(cobranca && typeof cobranca === 'object' && cobranca.refunded)
}

/* { código: quantas } e, para os desempates, quando cada código chegou ao número que tem */
export function contarPreReservas(sessoes, fim = FIM) {
  const porCodigo = {}
  const chegou = {}
  const validas = sessoes
    .filter(s => s.status === 'complete' && s.payment_status === 'paid' && FORMATO.test(String(s.client_reference_id || '')))
    .filter(s => s.created * 1000 < fim && !reembolsada(s))
    .sort((a, b) => a.created - b.created)
  for (const s of validas) {
    const c = s.client_reference_id
    porCodigo[c] = (porCodigo[c] || 0) + 1
    chegou[c] = s.created
  }
  return { porCodigo, chegou }
}

/* o que a página mostra a quem tem o código: a contagem, a posição e o corte do top 10 de hoje */
export function resumoContagem({ porCodigo, chegou }, codigo, vencedores = 10) {
  const ranking = Object.keys(porCodigo).sort((a, b) => porCodigo[b] - porCodigo[a] || chegou[a] - chegou[b])
  const meu = FORMATO.test(String(codigo || '')) ? codigo : null
  const contagem = meu ? porCodigo[meu] || 0 : null
  const posicao = meu && contagem ? ranking.indexOf(meu) + 1 : null
  return {
    contagem,
    posicao,
    participantes: ranking.length,
    corte: ranking.length >= vencedores ? porCodigo[ranking[vencedores - 1]] : 1,
    top: ranking.slice(0, vencedores).map(c => porCodigo[c]),
  }
}

/* todas as sessões do Payment Link da Clara, com a cobrança para ver reembolsos */
export async function listarSessoes(chave, pedir = fetch, maxPaginas = 30) {
  const sessoes = []
  let depois = null
  for (let i = 0; i < maxPaginas; i++) {
    const q = new URLSearchParams({ limit: '100', payment_link: LINK_CLARA, status: 'complete' })
    q.append('expand[]', 'data.payment_intent.latest_charge')
    if (depois) q.set('starting_after', depois)
    const r = await pedir(`https://api.stripe.com/v1/checkout/sessions?${q}`, { headers: { Authorization: `Bearer ${chave}` } })
    if (!r.ok) throw new Error(`Stripe ${r.status}`)
    const pagina = await r.json()
    sessoes.push(...pagina.data)
    if (!pagina.has_more || !pagina.data.length) break
    depois = pagina.data[pagina.data.length - 1].id
  }
  return sessoes
}
