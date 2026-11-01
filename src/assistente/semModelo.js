import { SUGESTOES, contactoDe } from './conversa.js'

/* quando o modelo não responde (sem chave, quota gasta, a API ou a rede a falhar), a Clara responde às sugestões com o
   que o site diz, pede o nome e o contacto e, ao resto, diz que a equipa da Nº5 responde. Nunca fala em limites.
   Serve a função do servidor e o navegador (se o pedido falhar mesmo depois de tentar outra vez) */
const RESPOSTAS = esgotado => ({
  [SUGESTOES[0]]: 'Respondo e qualifico as tuas leads em minutos, faço os follow-ups, organizo o teu plano do dia e registo as tuas notas de voz na ficha certa. Tu ficas com o que só tu fazes: estar com clientes.',
  [SUGESTOES[1]]: 'O plano Clara fica a 53 € por mês, a Pro a 97 € e a Elite a 147 €, por consultor e sem fidelização. A pré-reserva é de 27 € e paga o teu primeiro mês, com a Clara Elite completa.',
  [SUGESTOES[2]]: esgotado
    ? 'As 25 vagas com pré-reserva já esgotaram. Se entrares na lista de espera, a partir de 1 de dezembro abrimos 30 vagas por semana, pela ordem da lista.'
    : 'Pagas 27 € e ficas com uma das 25 vagas para 1 de dezembro. Esses 27 € pagam o teu primeiro mês, com a Clara Elite completa, e se continuares na Pro ou na Elite tens 50% na primeira mensalidade.',
  [SUGESTOES[3]]: 'Sim: o copiloto preenche e grava o CRM da tua marca por ti. Vem incluído durante 3 meses com a pré-reserva e depois continua na Clara Elite.',
})

export const PEDE_NOME = 'Já agora, como te chamas?'
const pedeContacto = nome => `Prazer, ${nome}! Deixas-me o teu telemóvel ou email? Assim a equipa da Nº5 pode enviar-te os detalhes.`
const EMAIL = /[^\s@]+@[^\s@]+\.[^\s@]{2,}/
const TELEFONE = /(?:\+|00)?\d[\d\s-]{7,16}\d/

/* «o meu nome é Pedro», «chamo-me Pedro», «sou o Pedro» */
const APRESENTA = /(?:o meu nome é|chamo-me|sou (?:o|a)|trata-me por|podes chamar-me)\s+(\p{L}[\p{L}'-]*(?:\s+\p{L}[\p{L}'-]*){0,2})/iu
/* «Pedro, enganei-me», «enganei-me, é Pedro», «desculpa, Pedro» */
const CORRIGE = /engan|desculp|corrij|corrig|afinal|queria dizer|ups|oops/iu
const NAO_NOME = new Set(['é', 'e', 'o', 'a', 'me', 'nome', 'meu', 'era', 'sou', 'escrevi', 'mal', 'sorry'])

/* o nome que a pessoa diz numa apresentação ou numa correção; vazio se a mensagem não for isso.
   Uma correção é curta e sem pergunta («Desculpa, quanto custa?» não é uma correção) */
export function nomeDito(texto) {
  const t = String(texto || '').trim()
  const a = t.match(APRESENTA)
  if (a) return a[1].trim()
  if (!CORRIGE.test(t) || t.includes('?') || t.split(/\s+/).length > 5) return ''
  const palavras = t.replace(/[,.!;:]/g, ' ').split(/\s+/).filter(p => p && !CORRIGE.test(p) && !NAO_NOME.has(p.toLowerCase()) && /^\p{L}[\p{L}'-]*$/u.test(p))
  return palavras.slice(0, 3).join(' ')
}

export function respostaSemModelo(mensagens, { esgotado = false, contacto = {} } = {}) {
  const visitante = mensagens.filter(m => m.de === 'visitante')
  const ultima = visitante[visitante.length - 1].texto.trim()
  const anterior = [...mensagens].reverse().find(m => m.de === 'clara')?.texto || ''
  const c = contactoDe(contacto)
  for (const m of visitante) {
    c.email ||= contactoDe({ email: m.texto.match(EMAIL)?.[0] }).email
    c.telefone ||= contactoDe({ telefone: m.texto.match(TELEFONE)?.[0] }).telefone
  }
  /* a resposta à pergunta do nome: curta, sem números nem arrobas, ou uma apresentação («chamo-me Pedro») */
  const dito = nomeDito(ultima)
  const pediuNome = /como te chamas\?$/i.test(anterior)
  if (!c.nome && pediuNome && dito) c.nome = dito
  else if (!c.nome && pediuNome && /^[\p{L}' .-]{2,60}$/u.test(ultima) && ultima.split(/\s+/).length <= 4) c.nome = ultima
  /* a pessoa corrigiu o nome que já tinha dado: aceita-se e segue */
  const corrigiu = !!(contactoDe(contacto).nome && dito && dito.toLowerCase() !== contactoDe(contacto).nome.toLowerCase())
  if (corrigiu) c.nome = dito
  const primeiro = c.nome.split(' ')[0]
  const base = { ...c, sugestoes: [] }
  if (corrigiu) {
    return { ...base, resposta: c.email || c.telefone ? `Ah, ${primeiro}! Desculpa. Em que mais te posso ajudar?` : `Ah, ${primeiro}! Desculpa. Deixas-me o teu telemóvel ou email? Assim a equipa da Nº5 pode enviar-te os detalhes.`, sugestoes: SUGESTOES.slice(0, 2) }
  }
  const conhecida = RESPOSTAS(esgotado)[ultima]
  if (conhecida) return { ...base, resposta: c.nome ? conhecida : `${conhecida} ${PEDE_NOME}`, sugestoes: SUGESTOES.filter(s => s !== ultima).slice(0, 2) }
  if (c.nome && !c.email && !c.telefone && /como te chamas\?$/i.test(anterior)) return { ...base, resposta: pedeContacto(primeiro) }
  /* o contacto chegou nesta conversa e ainda não se tinha agradecido */
  const antes = contactoDe(contacto)
  if (c.nome && ((c.email && !antes.email) || (c.telefone && !antes.telefone))) {
    return { ...base, resposta: `Obrigada, ${primeiro}! A equipa da Nº5 vai falar contigo. Entretanto, se tiveres mais perguntas, estou aqui.`, sugestoes: SUGESTOES.slice(0, 2) }
  }
  if (c.nome && (c.email || c.telefone)) return { ...base, resposta: `Boa pergunta, ${primeiro}! Quero dar-te a resposta certa, por isso a equipa da Nº5 responde-te a isso pelo contacto que deixaste.`, sugestoes: SUGESTOES.slice(0, 2) }
  if (c.nome) return { ...base, resposta: `Boa pergunta! Quero dar-te a resposta certa, por isso a equipa da Nº5 responde-te a isso. Deixas-me o teu telemóvel ou email?`, sugestoes: SUGESTOES.slice(0, 2) }
  return { ...base, resposta: `Boa pergunta! Quero dar-te a resposta certa, por isso a equipa da Nº5 responde-te a isso. ${PEDE_NOME}`, sugestoes: SUGESTOES.slice(0, 2) }
}
