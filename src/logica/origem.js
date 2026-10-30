/* de onde veio a inscrição: a página do site e, quando há, o anúncio (utm_content); não leva dados de ninguém */
export function origemDe(caminho = '/', pesquisa = '') {
  const anuncio = new URLSearchParams(pesquisa).get('utm_content')
  const limpo = String(anuncio || '').replace(/[^\w-]/g, '').slice(0, 60)
  return [caminho || '/', limpo].filter(Boolean).join(' · ')
}

/* etiqueta do GHL para a página: «pagina-leads», «pagina-inicio», ... */
export function etiquetaPagina(origem) {
  const caminho = String(origem || '').split(' · ')[0]
  const pasta = caminho.split('/').filter(Boolean)[0]
  if (!caminho) return null
  return `pagina-${(pasta || 'inicio').toLowerCase().replace(/[^a-z0-9-]/g, '')}`
}
