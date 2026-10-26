/* converte o progresso do scroll (0 a 1) na cena ativa e no avanço dentro dela */
export function cenaDe(progresso, total) {
  const p = Math.min(1, Math.max(0, Number.isFinite(progresso) ? progresso : 0))
  const pos = p * total
  const indice = Math.min(total - 1, Math.floor(pos))
  return { indice, avanco: Math.min(1, pos - indice) }
}

/* quantos passos de uma cena estão à vista: o primeiro logo à entrada, o último antes do fim da cena */
export function passoDe(avanco, passos) {
  const a = Math.min(1, Math.max(0, Number.isFinite(avanco) ? avanco : 0))
  return Math.min(passos, Math.floor(a * passos) + 1)
}
