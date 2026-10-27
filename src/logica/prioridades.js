/* passo 2 da inscrição: em que é que a Clara mais ajudava, em palavras simples.
   Escolhe-se até MAX_PRIORIDADES, para obrigar a escolher a sério. */
export const MAX_PRIORIDADES = 3

export const PRIORIDADES = [
  { id: 'leads', texto: 'Responder às minhas leads por mim' },
  { id: 'plano', texto: 'Ter o dia organizado logo de manhã' },
  { id: 'chamadas', texto: 'Coaching das minhas chamadas' },
  { id: 'voz', texto: 'Notas de voz que vão sozinhas para o CRM' },
  { id: 'documentos', texto: 'Pedir documentos aos proprietários' },
  { id: 'compradores', texto: 'Encontrar compradores na minha carteira' },
  { id: 'previsao', texto: 'Saber quanto vou vender este mês' },
  { id: 'marketing', texto: 'Anúncios e marketing com IA' },
]

/* na Clara não se pergunta o CRM: cada consultor usa o da sua rede */
export const CRMS = null

/* liga ou desliga uma prioridade; com o máximo atingido, não acrescenta mais */
export function alternarPrioridade(escolhidas, id, max = MAX_PRIORIDADES) {
  if (escolhidas.includes(id)) return escolhidas.filter(x => x !== id)
  if (escolhidas.length >= max || !PRIORIDADES.some(p => p.id === id)) return escolhidas
  return [...escolhidas, id]
}

/* texto que segue no envio: as escolhas pela ordem em que foram feitas */
export const textoPrioridades = escolhidas =>
  escolhidas.map(id => PRIORIDADES.find(p => p.id === id)?.texto).filter(Boolean).join('; ')
