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
  // quem te indicou é opcional: o nome, o email ou o código de 6 letras de quem indicou; nunca o próprio email
  const indicou = String(d.indicado_por ?? '').trim()
  if (indicou.length > 120) erros.indicado_por = 'Escreve só o nome, o email ou o código de quem te indicou.'
  else if (indicou.includes('@') && !EMAIL.test(indicou)) erros.indicado_por = 'Este email não parece válido.'
  else if (indicou && indicou.toLowerCase() === String(d.email ?? '').trim().toLowerCase()) erros.indicado_por = 'Põe quem te indicou, não o teu email.'
  if (d.consentimento !== true) erros.consentimento = 'Precisamos da tua autorização para te contactar.'
  return { ok: Object.keys(erros).length === 0, erros }
}
