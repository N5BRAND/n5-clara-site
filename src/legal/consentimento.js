/* escolha de cookies do visitante, guardada no próprio navegador.
   Versão 2 (30/10): junta a estatística (PostHog); quem escolheu na versão 1 volta a ver o aviso. */
export const CHAVE = 'n5-consentimento'
export const VERSAO = 2

export function lerConsentimento(armazenamento) {
  try {
    const c = JSON.parse(armazenamento.getItem(CHAVE))
    return c && c.versao === VERSAO ? c : null
  } catch {
    return null
  }
}

export function novoConsentimento({ marketing = false, estatistica = false }, agora = new Date()) {
  return { versao: VERSAO, data: agora.toISOString(), necessarios: true, estatistica: !!estatistica, marketing: !!marketing }
}

export function guardarConsentimento(armazenamento, c) {
  try {
    armazenamento.setItem(CHAVE, JSON.stringify(c))
    return true
  } catch {
    return false
  }
}
