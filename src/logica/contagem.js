/* Lisboa está em UTC+0 em dezembro: meia-noite de 1/12 em Lisboa */
export const LANCAMENTO = new Date('2026-12-01T00:00:00Z')

export function tempoAte(alvo, agora = new Date()) {
  const falta = Math.max(0, Math.floor((alvo.getTime() - agora.getTime()) / 1000))
  return {
    dias: Math.floor(falta / 86400),
    horas: Math.floor((falta % 86400) / 3600),
    minutos: Math.floor((falta % 3600) / 60),
    segundos: falta % 60,
    terminou: falta === 0,
  }
}
