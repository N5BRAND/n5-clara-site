/* API de Conversões da Meta: a inscrição segue para o N5 Controlo, que guarda o consentimento e a envia à Meta.
   Só com os cookies de marketing aceites no site (meta_consentimento = '1'). O event_id é o mesmo que o píxel usou,
   para a Meta juntar os dois eventos. Precisa de N5_CONTROLO_URL e N5_CONTROLO_CHAVE nas variáveis do site. */
export const SITE = 'https://clara.numerocinco.pt'
const INSCRICOES = new Set(['lista-clara', 'lista-espera'])

/* a página da inscrição, a partir do campo origem («/leads/ · cla_n2_leads») */
export function paginaDaInscricao(origem) {
  const caminho = String(origem || '').split(' · ')[0].trim()
  return SITE + (caminho.startsWith('/') ? caminho : '/')
}

/* o pedido para o N5 Controlo, ou null quando não há nada a enviar */
export function paraConversoes(formulario, d) {
  if (!INSCRICOES.has(formulario) || !d) return null
  if (d.meta_consentimento !== '1' || !d.meta_evento || !d.email) return null
  const corpo = {
    event: 'Lead',
    event_id: String(d.meta_evento).slice(0, 100),
    email: String(d.email).trim(),
    phone: d.telefone || undefined,
    name: d.nome || undefined,
    fbp: d.meta_fbp || undefined,
    fbc: d.meta_fbc || undefined,
    client_ip: d.ip || undefined,
    user_agent: d.user_agent || undefined,
    source_url: paginaDaInscricao(d.origem),
    consent: true,
  }
  return Object.fromEntries(Object.entries(corpo).filter(([, v]) => v !== undefined))
}

export async function enviarConversao({ corpo, url, chave, pedir = fetch }) {
  const r = await pedir(`${String(url).replace(/\/+$/, '')}/api/v1/conversions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${chave}` },
    body: JSON.stringify(corpo),
  })
  const resposta = await r.json().catch(() => ({}))
  return { ok: r.ok, estado: r.status, enviado: !!resposta.sent, motivo: resposta.reason || resposta.error?.message }
}
