/* escolha de cookies do visitante, guardada no próprio navegador */
export const CHAVE = 'n5-consentimento'
export const VERSAO = 1

export function lerConsentimento(armazenamento) {
  try {
    const c = JSON.parse(armazenamento.getItem(CHAVE))
    return c && c.versao === VERSAO ? c : null
  } catch {
    return null
  }
}

export function novoConsentimento({ marketing = false }, agora = new Date()) {
  return { versao: VERSAO, data: agora.toISOString(), necessarios: true, marketing: !!marketing }
}

export function guardarConsentimento(armazenamento, c) {
  try {
    armazenamento.setItem(CHAVE, JSON.stringify(c))
    return true
  } catch {
    return false
  }
}
