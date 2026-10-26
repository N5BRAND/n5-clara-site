const minutos = hhmm => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
const formatar = min => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`

/* relógio da demo: a meio de cada cena mostra a hora dela; começa às 07:30, acaba às 20:00 e avança aos 5 minutos */
export function horaDe(progresso, horas) {
  const p = Math.min(1, Math.max(0, Number.isFinite(progresso) ? progresso : 0))
  const n = horas.length
  const pontos = [[0, 450], ...horas.map((h, i) => [(i + 0.5) / n, minutos(h)]), [1, 1200]]
  let i = 0
  while (i < pontos.length - 2 && p > pontos[i + 1][0]) i++
  const [p0, m0] = pontos[i]
  const [p1, m1] = pontos[i + 1]
  const m = m0 + ((p - p0) / (p1 - p0)) * (m1 - m0)
  return formatar(Math.floor(m / 5) * 5)
}
