/* Cronómetro de uma visita à página: soma o tempo com o separador à vista, no total e por secção
   (a secção que está a atravessar o meio do ecrã), e lembra-se da última secção onde a pessoa estava.
   Só conta tempo à vista: com o separador escondido o relógio para. */
export function criarCronometro(agora, visivel = true) {
  let atual = null
  let aVista = visivel
  let desde = agora
  let total = 0
  let ultima = null
  const seccoes = {}

  const fechar = t => {
    const passou = Math.max(0, t - desde)
    if (aVista) {
      total += passou
      if (atual) seccoes[atual] = (seccoes[atual] || 0) + passou
    }
    desde = t
  }

  return {
    /* uma secção entrou na faixa do meio do ecrã */
    entrou(seccao, t) {
      fechar(t)
      atual = seccao
      ultima = seccao
    },
    /* uma secção saiu da faixa do meio; só conta se era a atual */
    saiu(seccao, t) {
      if (seccao !== atual) return
      fechar(t)
      atual = null
    },
    visibilidade(visivelAgora, t) {
      fechar(t)
      aVista = visivelAgora
    },
    /* segundos com uma casa decimal; ultima é a secção onde a pessoa estava (ou a última por onde passou) */
    resumo(t) {
      fechar(t)
      const s = ms => Math.round(ms / 100) / 10
      return {
        total: s(total),
        seccoes: Object.fromEntries(Object.entries(seccoes).map(([k, v]) => [k, s(v)])),
        ultima: atual || ultima,
      }
    },
  }
}
