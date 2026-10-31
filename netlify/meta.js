/* Cada inscrição segue para o N5 Controlo, que guarda de que página e anúncio veio (para ligar as compras da Stripe
   aos anúncios). Só com os cookies de marketing aceites no site (meta_consentimento = '1') seguem também os dados para
   a API de Conversões da Meta (telefone, nome, IP, navegador, _fbp e _fbc), com o event_id que o píxel usou.
   Precisa de N5_CONTROLO_URL e N5_CONTROLO_CHAVE nas variáveis do site. */
export const SITE = 'https://clara.numerocinco.pt'
const INSCRICOES = new Set(['lista-clara', 'lista-espera'])

/* a página da inscrição, a partir do campo origem («/leads/ · cla_n2_leads») */
export function paginaDaInscricao(origem) {
  const caminho = String(origem || '').split(' · ')[0].trim()
  return SITE + (caminho.startsWith('/') ? caminho : '/')
}

/* o anúncio de onde veio, a partir do campo origem («/leads/ · cla_n2_leads») */
export function anuncioDaInscricao(origem) {
  const anuncio = String(origem || '').split(' · ')[1]
  return anuncio ? anuncio.trim().slice(0, 150) : undefined
}

/* o pedido para o N5 Controlo, ou null quando não há nada a enviar */
export function paraConversoes(formulario, d) {
  if (!INSCRICOES.has(formulario) || !d || !d.email) return null
  const aceite = d.meta_consentimento === '1'
  const id = String(d.meta_evento || `sem-id-${Date.now().toString(36)}`).slice(0, 100)
  const corpo = {
    event: 'Lead',
    event_id: id.length >= 8 ? id : `${id}-inscricao`,
    email: String(d.email).trim(),
    source_url: paginaDaInscricao(d.origem),
    ad: anuncioDaInscricao(d.origem),
    consent: aceite,
    // só com o marketing aceite: o que serve à Meta para reconhecer a pessoa
    ...(aceite ? {
      phone: d.telefone || undefined,
      name: d.nome || undefined,
      fbp: d.meta_fbp || undefined,
      fbc: d.meta_fbc || undefined,
      client_ip: d.ip || undefined,
      user_agent: d.user_agent || undefined,
    } : {}),
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
