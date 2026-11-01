/* «Por onde começar», no topo da página inicial: as landing pages ativas, arrumadas pelo que o consultor procura.
   Primeiro os testes para ver se a Clara é para ele, depois uma página por dor, com a resposta da Clara.
   Uma página nova entra aqui: o teste em testes/mapa.test.js falha se alguma ficar de fora. */

export const COMECAR = [
  { href: '/diagnostico/', titulo: 'Diagnóstico de 2 minutos', texto: '10 perguntas sobre como trabalhas. Vês, com os teus números, onde a Clara te ajuda primeiro.' },
  { href: '/arquetipo/', titulo: 'Que tipo de consultor és?', texto: '8 perguntas. Ficas a saber onde perdes negócios e o plano da Clara que te serve.' },
]

/* plano: só quando a página é de um plano acima do plano Clara */
export const DORES = [
  { href: '/tudo/', dor: 'Tenho tudo espalhado entre o Excel, o WhatsApp e a cabeça', resposta: 'A Clara junta os teus contactos, os teus proprietários e o teu dia num sítio.' },
  { href: '/leads/', dor: 'Perco leads porque não consigo responder a tempo', resposta: 'A Clara responde em minutos, a qualquer hora, e qualifica com o teu guião.' },
  { href: '/angariacao/', dor: 'Faltam-me angariações', resposta: 'Os particulares a vender sem agência nas tuas freguesias, por prioridade.', plano: 'Pro e Elite' },
  { href: '/proprietarios/', dor: 'Os proprietários das campanhas chegam-me por qualificar', resposta: 'Qualificados antes da reunião e documentos acompanhados depois.' },
  { href: '/dia/', dor: 'O dia foge-me entre visitas e chamadas', resposta: 'As prioridades logo de manhã e notas de voz que ficam registadas.' },
  { href: '/crm/', dor: 'Perco horas a preencher o CRM da marca', resposta: 'O copiloto preenche e grava o CRM por ti.' },
  { href: '/reativar/', dor: 'Tenho contactos parados na base', resposta: 'A Clara volta a falar com eles, por grupos, de três em três meses.', plano: 'Pro e Elite' },
  { href: '/chamadas/', dor: 'Não sei o que corre mal nas minhas chamadas', resposta: 'Cada chamada analisada e coaching todas as manhãs.', plano: 'Elite' },
  { href: '/ia/', dor: 'Explico tudo outra vez ao ChatGPT e ao Claude', resposta: 'A Clara liga-se aos teus assistentes e eles passam a saber o mesmo.', plano: 'Pro e Elite' },
]

export const MAIS = [
  { href: '/inquerito/', titulo: 'Inquérito para consultores', texto: 'Responde a 11 perguntas e recebe no email o voucher de 2 meses da Clara Elite.' },
  { href: '/passa-a-clara/', titulo: 'Passa a Clara', texto: 'Indica colegas: 1 mês da Clara Elite por cada pré-reserva, até 6 meses.' },
]
