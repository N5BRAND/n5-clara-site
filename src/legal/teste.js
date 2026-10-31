/* Modo de teste: visitas e inscrições de teste não chegam à Meta nem aos números. Uma inscrição de teste com o píxel ou
   a API de Conversões passa por uma lead verdadeira, e a Meta chega a atribuí-la a um anúncio (31/10: uma lead falsa
   num anúncio da Clara, feita pelo browser do Claude). Liga-se, e fica ligado neste navegador, com:
   - ?teste=1 em qualquer página (?teste=0 desliga, também para o browser do Claude);
   - utm_source=teste-interno no endereço;
   - o browser do Claude, que as sessões usam para testar as páginas (o navegador diz «Claude/…»).
   Em modo de teste o píxel da Meta não carrega, o PostHog não regista nada e a inscrição segue com teste=1: o servidor
   não a envia à Meta e no GHL o contacto fica só com a etiqueta «teste». */
const CHAVE = 'n5-teste'

export function modoTeste({ pesquisa = '', agente = '', arm = null } = {}) {
  const p = new URLSearchParams(pesquisa)
  const pedido = p.get('teste')
  const marcado = pedido === '1' || p.get('utm_source') === 'teste-interno'
  try {
    if (pedido === '0') arm?.setItem(CHAVE, '0')
    else if (marcado) arm?.setItem(CHAVE, '1')
    const guardado = arm?.getItem(CHAVE)
    if (guardado === '0') return false
    if (guardado === '1') return true
  } catch { /* sem armazenamento: decide só por este endereço */ }
  if (pedido === '0') return false
  return marcado || /\bClaude\/\d/.test(agente)
}

let decidido = null
/* uma decisão por página */
export function emTeste() {
  if (decidido !== null) return decidido
  if (typeof window === 'undefined') return false
  let arm = null
  try { arm = window.localStorage } catch { arm = null }
  decidido = modoTeste({ pesquisa: window.location.search, agente: (typeof navigator !== 'undefined' && navigator.userAgent) || '', arm })
  return decidido
}
