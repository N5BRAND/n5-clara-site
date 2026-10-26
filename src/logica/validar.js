const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const vazio = v => String(v ?? '').trim() === ''

export const PLANOS = [
  { id: 'clara', nome: 'Clara' },
  { id: 'pro', nome: 'Clara Pro' },
  { id: 'elite', nome: 'Clara Elite' },
  { id: 'nao-sei', nome: 'Ainda não sei' },
]

/* valida a inscrição na lista de espera; devolve { ok, erros } com uma mensagem por campo */
export function validarInscricao(d) {
  const erros = {}
  if (vazio(d.nome)) erros.nome = 'Diz-nos o teu nome.'
  if (!EMAIL.test(String(d.email ?? '').trim())) erros.email = 'Este email não parece válido.'
  if (!vazio(d.telefone)) {
    const digitos = String(d.telefone).replace(/\D/g, '')
    if (digitos.length < 9 || digitos.length > 15) erros.telefone = 'O telefone tem de ter entre 9 e 15 dígitos.'
  }
  if (vazio(d.agencia)) erros.agencia = 'Em que agência ou rede trabalhas?'
  if (!PLANOS.some(p => p.id === d.plano)) erros.plano = 'Escolhe o plano que te interessa.'
  if (d.consentimento !== true) erros.consentimento = 'Precisamos da tua autorização para te contactar.'
  return { ok: Object.keys(erros).length === 0, erros }
}
