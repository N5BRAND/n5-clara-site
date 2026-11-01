import { ESGOTADO } from './pagamento.js'

/* o primeiro nome, com maiúscula, para a Clara tratar a pessoa pelo nome nas perguntas seguintes */
export function primeiroNome(nome) {
  const p = String(nome ?? '').trim().split(/\s+/)[0] || ''
  return p ? p.charAt(0).toLocaleUpperCase('pt-PT') + p.slice(1) : ''
}

/* a inscrição é uma conversa: a Clara pergunta só o nome, o email e o telemóvel, uma coisa de cada vez.
   fala(n): o que a Clara diz, com o primeiro nome da pessoa; campo: os atributos do input */
export const PERGUNTAS = [
  {
    id: 'nome',
    rotulo: 'O teu nome',
    fala: () => 'Olá! Sou a Clara. Como é que te devo chamar?',
    campo: { type: 'text', autoComplete: 'name', autoCapitalize: 'words', placeholder: 'O teu nome' },
  },
  {
    id: 'email',
    rotulo: 'O teu email',
    fala: n => `Prazer, ${n}! Qual é o teu email?`,
    ajuda: ESGOTADO ? 'É por lá que te aviso quando chegar a tua vez.' : 'É por lá que te mando tudo sobre a tua vaga.',
    campo: { type: 'email', inputMode: 'email', autoComplete: 'email', autoCapitalize: 'none', spellCheck: false, placeholder: 'nome@exemplo.pt' },
  },
  {
    id: 'telefone',
    rotulo: 'O teu número de telemóvel',
    fala: n => `E o teu número de telemóvel, ${n}?`,
    ajuda: 'Para falarmos contigo antes do lançamento.',
    campo: { type: 'tel', inputMode: 'tel', autoComplete: 'tel', placeholder: 'Ex.: 912 345 678' },
  },
]
