import { validarInscricao } from './validar.js'

/* a inscrição pergunta uma coisa de cada vez; cada passo valida só o seu campo */
export const PASSOS = [
  { id: 'nome', campo: 'nome' },
  { id: 'email', campo: 'email' },
  { id: 'telefone', campo: 'telefone', opcional: true },
  { id: 'agencia', campo: 'agencia' },
  { id: 'indicado', campo: 'indicado_por', opcional: true },
  { id: 'plano', campo: 'plano' },
  { id: 'autorizacao', campo: 'consentimento' },
]

export const erroDoPasso = (passo, d) => validarInscricao(d).erros[passo.campo] || ''

/* ao enviar, se algum campo ficou mal, volta-se ao primeiro passo com erro */
export function primeiroPassoComErro(d) {
  const erros = validarInscricao(d).erros
  return PASSOS.findIndex(p => erros[p.campo])
}

export const primeiroNome = n => String(n ?? '').trim().split(/\s+/)[0] || ''
