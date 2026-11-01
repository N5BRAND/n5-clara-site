const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const PLANOS = [
  { id: 'clara', nome: 'Clara' },
  { id: 'pro', nome: 'Clara Pro' },
  { id: 'elite', nome: 'Clara Elite' },
  { id: 'nao-sei', nome: 'Ainda não sei' },
]

/* o erro de uma das três perguntas da Clara (nome, email, telemóvel), dito por ela; null se estiver certo */
export function erroDoCampo(campo, d) {
  const v = String(d[campo] ?? '').trim()
  if (campo === 'nome') return v ? null : 'Preciso de um nome para saber como te tratar.'
  if (campo === 'email') return EMAIL.test(v) ? null : 'Este email não me parece certo. Confirmas?'
  if (campo === 'telefone') {
    if (!v) return 'Preciso do teu número para falarmos contigo.'
    const digitos = v.replace(/\D/g, '')
    return digitos.length < 9 || digitos.length > 15 ? 'O número tem de ter entre 9 e 15 dígitos.' : null
  }
  return null
}

/* valida a inscrição; devolve { ok, erros } com uma mensagem por campo */
export function validarInscricao(d) {
  const erros = {}
  for (const campo of ['nome', 'email', 'telefone']) {
    const e = erroDoCampo(campo, d)
    if (e) erros[campo] = e
  }
  // o plano não se pergunta: vem da página, do diagnóstico ou dos botões dos planos; sem nenhum, segue vazio
  // quem te indicou é opcional: o nome, o email ou o código de 6 letras de quem indicou; nunca o próprio email
  const indicou = String(d.indicado_por ?? '').trim()
  if (indicou.length > 120) erros.indicado_por = 'Escreve só o nome, o email ou o código de quem te indicou.'
  else if (indicou.includes('@') && !EMAIL.test(indicou)) erros.indicado_por = 'Este email não parece válido.'
  else if (indicou && indicou.toLowerCase() === String(d.email ?? '').trim().toLowerCase()) erros.indicado_por = 'Põe quem te indicou, não o teu email.'
  return { ok: Object.keys(erros).length === 0, erros }
}
