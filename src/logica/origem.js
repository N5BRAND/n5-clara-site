const CHAVE = 'n5-anuncio'
const limpar = a => String(a || '').replace(/[^\w-]/g, '').slice(0, 60)
const anuncioDe = pesquisa => limpar(new URLSearchParams(pesquisa).get('utm_content'))

/* o anúncio da chegada fica guardado durante a visita (sessionStorage): quem chega a /leads/ por um anúncio e se inscreve
   noutra página continua a contar para esse anúncio. Só o nome do anúncio, nunca dados de ninguém */
export function guardarAnuncio(pesquisa, arm) {
  const anuncio = anuncioDe(pesquisa)
  if (!anuncio) return null
  try { arm?.setItem(CHAVE, anuncio) } catch { /* sem armazenamento: conta só o anúncio do endereço */ }
  return anuncio
}

export function anuncioGuardado(arm) {
  try { return limpar(arm?.getItem(CHAVE)) || null } catch { return null }
}

/* ao abrir qualquer página */
export function iniciarOrigem() {
  try { guardarAnuncio(window.location.search, window.sessionStorage) } catch { /* sem armazenamento */ }
}

const sessao = () => { try { return window.sessionStorage } catch { return null } }

/* de onde veio a inscrição: a página do site e o anúncio (utm_content do endereço ou o da chegada); não leva dados de ninguém.
   O formato «página · anúncio» é o que o servidor lê (netlify/meta.js) */
export function origemDe(caminho = '/', pesquisa = '', arm = typeof window === 'undefined' ? null : sessao()) {
  const anuncio = anuncioDe(pesquisa) || anuncioGuardado(arm)
  return [caminho || '/', anuncio].filter(Boolean).join(' · ')
}

/* etiqueta do GHL para a página: «pagina-leads», «pagina-inicio», ... */
export function etiquetaPagina(origem) {
  const caminho = String(origem || '').split(' · ')[0]
  const pasta = caminho.split('/').filter(Boolean)[0]
  if (!caminho) return null
  return `pagina-${(pasta || 'inicio').toLowerCase().replace(/[^a-z0-9-]/g, '')}`
}
