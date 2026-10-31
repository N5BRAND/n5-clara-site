/* teste de arquétipos da landing page /arquetipo/: 8 perguntas sobre como o consultor trabalha no dia a dia (cada uma no
   período que faz sentido: ontem, esta manhã, a última semana), não sobre o que acha.
   As perguntas 1 a 6 dão pontos aos 4 arquétipos (máximo de 10 para cada um, para nenhum partir em vantagem);
   a 7 e a 8 só escolhem o plano. «Não sei» é sempre aceite, fica como null e não dá pontos.
   Especificação: docs/specs/2026-10-31-landing-arquetipo.md */
import { ESGOTADO, PRE_RESERVA, OFERTA } from './pagamento.js'

export const NAO_SEI = null

/* ordem de desempate quando a P1 não decide */
export const ORDEM = ['cacador', 'bombeiro', 'malabarista', 'maratonista']

/* os textos dos cartões dos criativos; «ver» leva às landing pages que já estão no ar */
export const ARQUETIPOS = {
  cacador: {
    id: 'cacador', nome: 'Caçador', feminino: 'Caçadora', dor: 'Angariação',
    frase: 'Vive à procura do próximo imóvel.',
    reconheces: 'Tens compradores à espera e poucas casas para lhes mostrar.',
    forte: 'Não tens medo de pegar no telefone.',
    perdes: 'Na angariação: o próximo imóvel demora a aparecer.',
    clara: 'Qualifica as tuas leads de proprietários (motivação, prazo, preço e documentos).',
    ver: [{ href: '/angariacao/', texto: 'Ver como a Clara faz isto' }],
    aviso: { titulo: 'Angariação', texto: 'No primeiro dia, a Clara qualifica as tuas leads de proprietários. A lista semanal de particulares a vender sem agência na tua zona, na Clara Pro e na Elite, chega depois do lançamento, primeiro para quem entra com as 25 vagas de lançamento.' },
  },
  bombeiro: {
    id: 'bombeiro', nome: 'Bombeiro', feminino: 'Bombeira', dor: 'Organização do dia',
    frase: 'Passa o dia a apagar fogos.',
    reconheces: 'São 19h e ainda estás a responder a mensagens e a pedir papéis.',
    forte: 'Ninguém fica sem resposta tua.',
    perdes: 'No tempo: as chamadas que dão negócio ficam para amanhã.',
    clara: 'Regista as tuas notas de voz, pede os documentos ao proprietário e monta o teu plano do dia.',
    ver: [{ href: '/dia/', texto: 'Ver como a Clara faz isto' }, { href: '/proprietarios/', texto: 'E como pede os documentos' }],
  },
  malabarista: {
    id: 'malabarista', nome: 'Malabarista', feminino: 'Malabarista', dor: 'Prioridades',
    frase: 'Tem sempre dez bolas no ar.',
    reconheces: 'Ligas primeiro a quem escreveu por último.',
    forte: 'Chegas a toda a gente.',
    perdes: 'Nas prioridades: o comprador que estava pronto fica para depois.',
    clara: 'Dá a cada lead uma pontuação de 0 a 100 e põe o teu dia por ordem de prioridade.',
    ver: [{ href: '/leads/', texto: 'Ver como a Clara faz isto' }],
  },
  maratonista: {
    id: 'maratonista', nome: 'Maratonista', feminino: 'Maratonista', dor: 'Performance e ritmo',
    frase: 'Tem um objetivo e quer lá chegar.',
    reconheces: 'Sabes o que queres faturar no ano, mas não quanto vais faturar este mês.',
    forte: 'Sabes o que queres faturar.',
    perdes: 'No ritmo: só dás por isso no fim do mês.',
    clara: 'Monta a tua semana em blocos de prospeção, posicionamento e reuniões, e ajusta-a todas as semanas com coaching.',
    ver: [{ href: '/chamadas/', texto: 'Ver o coaching das chamadas, na Elite' }],
    aviso: { titulo: 'Clara Pro e Elite', texto: 'O calendário de performance nasce na sessão de configuração: a Clara divide a tua semana em blocos de prospeção, posicionamento e reuniões, conforme a faturação e os objetivos que definires, e ajusta-o todas as semanas com coaching e dicas de prospeção e de chamadas. Faz parte da Clara Pro e da Clara Elite. ' + OFERTA.planoSuperior('pro-elite') },
  },
}

/* cada opção: [valor, texto, pontos por arquétipo] */
export const PERGUNTAS = [
  {
    id: 'ontem', texto: 'Ontem, o que te ocupou mais tempo?',
    opcoes: [
      ['papeis', 'Papéis, mensagens e registos', { bombeiro: 3 }],
      ['imoveis', 'Procurar imóveis e proprietários', { cacador: 3 }],
      ['contactos', 'Responder a contactos novos', { malabarista: 3 }],
      ['planeado', 'Chamadas e visitas que tinha planeado', { maratonista: 3 }],
    ],
  },
  {
    id: 'angariacoes', texto: 'Quantas angariações novas fizeste no último mês?',
    opcoes: [
      ['nenhuma', 'Nenhuma', { cacador: 3 }],
      ['1-2', '1 ou 2', { cacador: 1 }],
      ['3-5', '3 a 5', {}],
      ['mais-5', 'Mais de 5', { maratonista: 1 }],
    ],
  },
  {
    id: 'ligar', texto: 'Esta manhã, como decidiste a quem ligar primeiro?',
    opcoes: [
      ['whatsapp', 'Pelo que apareceu no WhatsApp', { malabarista: 3 }],
      ['lista', 'Tinha uma lista feita na véspera', { maratonista: 2 }],
      ['papeis', 'Não liguei, fui tratar de papéis', { bombeiro: 3 }],
      ['proprietarios', 'Liguei primeiro a proprietários', { cacador: 2 }],
    ],
  },
  {
    id: 'registo', texto: 'Onde ficou registada a tua última visita?',
    opcoes: [
      ['crm', 'No CRM, no próprio dia', { maratonista: 1 }],
      ['caderno', 'No telemóvel ou num caderno', { bombeiro: 2 }],
      ['por-registar', 'Ainda não a registei', { bombeiro: 2, malabarista: 1 }],
      ['sem-visitas', 'Não fiz visitas esta semana', { cacador: 2 }],
    ],
  },
  {
    id: 'resposta', texto: 'Na última semana, quanto tempo demoraste a responder a um contacto novo?',
    opcoes: [
      ['minutos', 'Menos de 15 minutos', {}],
      ['hora', 'Até 1 hora', {}],
      ['horas', 'Algumas horas', { malabarista: 2 }],
      ['dia', 'No dia seguinte ou mais', { malabarista: 3, bombeiro: 1 }],
    ],
  },
  {
    id: 'mes', texto: 'Sabes hoje quanto vais faturar este mês?',
    opcoes: [
      ['sei', 'Sim, sei ao certo', {}],
      ['objetivo', 'Tenho um objetivo, mas não sei se lá chego', { maratonista: 3 }],
      ['sem-objetivo', 'Não tenho um objetivo definido', { bombeiro: 1 }],
    ],
  },
  {
    id: 'telefone', texto: 'Quantas horas por dia passas ao telefone?',
    opcoes: [['menos-1', 'Menos de 1'], ['1-3', '1 a 3'], ['3-mais', '3 ou mais']],
  },
  {
    id: 'anuncios', texto: 'Pagas anúncios ou portais para ter contactos?',
    opcoes: [['sim', 'Sim, todos os meses'], ['as-vezes', 'Às vezes'], ['nao', 'Não']],
  },
]

/* o «?dor=» do anúncio: qual arquétipo e qual título no topo */
export const DOR_PARA_ARQUETIPO = { angariacao: 'cacador', organizacao: 'bombeiro', prioridades: 'malabarista', performance: 'maratonista' }

export const TITULOS = {
  geral: 'Que tipo de consultor és?',
  angariacao: 'Tens mais compradores do que casas para lhes mostrar?',
  organizacao: 'São 19h e ainda estás a pedir documentos por WhatsApp?',
  prioridades: '47 contactos por responder. Por qual começas?',
  performance: 'Sabes hoje quanto vais faturar este mês?',
}

/* sem Object.hasOwn: o navegador do Instagram em iPhones antigos não o tem */
const conhecida = dor => !!dor && Object.prototype.hasOwnProperty.call(DOR_PARA_ARQUETIPO, dor)

/* a dor do endereço, ou null se não houver ou for desconhecida */
export function lerDor(pesquisa = '') {
  const dor = new URLSearchParams(pesquisa).get('dor')
  return conhecida(dor) ? dor : null
}

export const tituloDe = dor => (conhecida(dor) ? TITULOS[dor] : TITULOS.geral)

const opcao = (id, valor) => PERGUNTAS.find(p => p.id === id)?.opcoes.find(([v]) => v === valor)

export function pontuar(respostas = {}) {
  const pontos = Object.fromEntries(ORDEM.map(a => [a, 0]))
  for (const p of PERGUNTAS) {
    const pts = opcao(p.id, respostas[p.id])?.[2] || {}
    for (const [a, n] of Object.entries(pts)) pontos[a] += n
  }
  return pontos
}

/* o arquétipo da resposta à P1, que desempata */
const daP1 = respostas => Object.keys(opcao('ontem', respostas.ontem)?.[2] || {})[0]

/* o que tem mais pontos; no empate, o da P1 e depois a ORDEM */
function primeiro(candidatos, pontos, p1) {
  const maximo = Math.max(...candidatos.map(a => pontos[a]))
  const empatados = candidatos.filter(a => pontos[a] === maximo)
  return empatados.includes(p1) ? p1 : empatados[0]
}

/* { arquetipo, segundo, pontos }; com zero pontos em todos não há perfil (null). O «?dor=» do anúncio muda só o título:
   não substitui as respostas (decisão do Pedro, 31/10) */
export function escolher(respostas = {}) {
  const pontos = pontuar(respostas)
  if (ORDEM.every(a => pontos[a] === 0)) return { arquetipo: null, segundo: null, pontos }
  const p1 = daP1(respostas)
  const arquetipo = primeiro(ORDEM, pontos, p1)
  const outro = primeiro(ORDEM.filter(a => a !== arquetipo), pontos, p1)
  return { arquetipo, segundo: pontos[outro] >= 3 ? outro : null, pontos }
}

/* Elite para quem passa 3 horas ou mais ao telefone; Pro para quem paga contactos e para o Maratonista
   (o calendário de performance só existe na Pro e na Elite); os outros, Clara */
export function planoDe(respostas = {}, arquetipo) {
  if (respostas.telefone === '3-mais') return 'elite'
  if (respostas.anuncios === 'sim' || respostas.anuncios === 'as-vezes' || arquetipo === 'maratonista') return 'pro'
  return 'clara'
}

export const NOMES_PLANO = { clara: 'Clara', pro: 'Clara Pro', elite: 'Clara Elite' }

export function porqueDoPlano(plano, arquetipo) {
  if (plano === 'elite') return 'Passas mais de 3 horas por dia ao telefone.'
  if (plano === 'pro') return arquetipo === 'maratonista' ? 'O calendário de performance faz parte da Pro.' : 'Pagas para ter contactos.'
  return 'Tudo o que precisas está no plano base.'
}

/* a Clara responde a cada resposta com uma frase só, mostrada no topo da pergunta seguinte */
export const REACOES = {
  ontem: {
    papeis: 'Papéis e mensagens comem o dia a muita gente, e é aí que eu entro.',
    imoveis: 'Sem imóveis para mostrar não há negócio, faz sentido que isso te ocupe.',
    contactos: 'Responder depressa conta muito, mas não tem de ser sempre por ti.',
    planeado: 'Um dia com plano já vai a meio caminho.',
    'nao-sei': 'Há dias assim, seguimos para a próxima.',
  },
  angariacoes: {
    nenhuma: 'Um mês sem angariações acontece, vamos perceber onde é que isso começa.',
    '1-2': 'Uma ou duas por mês já dá ritmo, mas ainda há margem.',
    '3-5': 'Três a cinco por mês é um bom ritmo de angariação.',
    'mais-5': 'Mais de cinco por mês, estás a angariar a sério.',
    'nao-sei': 'Não faz mal, contar isso passa a ser trabalho meu.',
  },
  ligar: {
    whatsapp: 'Quem escreve por último passa à frente, mesmo quando não devia.',
    lista: 'Uma lista feita na véspera poupa-te a manhã inteira.',
    papeis: 'Quando os papéis passam à frente das chamadas, o negócio fica à espera.',
    proprietarios: 'Ligar primeiro a proprietários é pensar já na próxima angariação.',
    'nao-sei': 'Tudo bem, a ordem das chamadas é das primeiras coisas que eu organizo.',
  },
  registo: {
    crm: 'Registo no próprio dia, assim nada se perde pelo caminho.',
    caderno: 'No caderno fica guardado, mas não te lembra de nada.',
    'por-registar': 'Uma visita por registar é um seguimento que pode escapar.',
    'sem-visitas': 'Uma semana sem visitas pede primeiro mais imóveis e mais compradores.',
    'nao-sei': 'Se não sabes onde ficou, é porque ainda não tem um lugar certo.',
  },
  resposta: {
    minutos: 'Menos de 15 minutos é rápido, e quem pergunta nota a diferença.',
    hora: 'Até uma hora ainda é bom, o difícil é manter isso à noite e ao fim de semana.',
    horas: 'Em algumas horas, a lead tem tempo de falar com outro consultor.',
    dia: 'No dia seguinte, muitas leads já falaram com outro consultor.',
    'nao-sei': 'Não faz mal, o tempo de resposta passa a ser medido por mim.',
  },
  mes: {
    sei: 'Saber o mês ao certo é raro, tens as contas em dia.',
    objetivo: 'Ter o objetivo já é meio caminho, falta saber se o ritmo chega.',
    'sem-objetivo': 'Sem objetivo é difícil saber se o mês está a correr bem.',
    'nao-sei': 'Não faz mal, saber isto é das primeiras coisas que te mostro.',
  },
  telefone: {
    'menos-1': 'Pouco telefone, o teu dia vai para outras tarefas.',
    '1-3': 'Entre uma e três horas, cada chamada tem de contar.',
    '3-mais': 'Com tantas horas ao telefone, cada chamada merece ser bem aproveitada.',
    'nao-sei': 'Ninguém conta as horas ao telefone, não faz mal.',
  },
  anuncios: {
    sim: 'Se pagas por contactos, nenhum pode ficar sem resposta.',
    'as-vezes': 'Quando pagas por contactos, cada um tem de ser bem aproveitado.',
    nao: 'Sem anúncios, os contactos que já tens valem ainda mais.',
    'nao-sei': 'Fica para a sessão de configuração, vemos isso juntos.',
  },
}

export const reacaoDe = (id, valor) => REACOES[id]?.[valor ?? 'nao-sei'] || null

/* a mensagem pessoal do resultado, com o plano e a oferta do lançamento. A pré-reserva aparece separada da mensalidade:
   a oferta e os preços saem de OFERTA e PRECOS (src/logica/pagamento.js) */
export function mensagemFinal(arquetipo, plano, esgotado = ESGOTADO) {
  const abertura = `Olha, deu ${ARQUETIPOS[arquetipo]?.nome}.`
  const artigo = plano === 'clara' ? 'o plano' : 'a'
  const nome = NOMES_PLANO[plano]
  const porque = porqueDoPlano(plano, arquetipo)
  const oferta = esgotado
    ? 'As 25 vagas com pré-reserva já esgotaram, mas entras na lista de espera e a partir de 1 de dezembro abrimos 30 vagas por semana.'
    : plano === 'clara'
      ? `Como lançamos a 1 de dezembro, a pré-reserva de ${PRE_RESERVA} ${OFERTA.resumo}.`
      : OFERTA.planoSuperior(plano)
  const preco = esgotado ? null : { rotulo: 'Pré-reserva', agora: PRE_RESERVA, nota: 'Sem fidelização' }
  return { abertura, artigo, nome, porque, oferta, preco, texto: [abertura, `Para ti, o plano certo é ${artigo} ${nome}.`, porque, oferta].join(' ') }
}

const milhares = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
const tem = v => v !== NAO_SEI && v !== undefined

/* a linha que segue com a inscrição (campo «diagnostico») e com as respostas anónimas */
export function resumo(respostas = {}, resultado = {}, contas) {
  const a = ARQUETIPOS[resultado.arquetipo]
  const segundo = ARQUETIPOS[resultado.segundo]
  const partes = [
    `Arquétipo: ${a ? `${a.nome}${segundo ? ` (com um pé de ${segundo.nome})` : ''}` : 'por definir'}`,
    `Plano: ${a ? NOMES_PLANO[planoDe(respostas, a.id)] : 'por definir'}`,
    ...PERGUNTAS.map(p => `${p.texto} ${opcao(p.id, respostas[p.id])?.[1] || 'não sei'}`),
  ]
  if (contas) {
    const euros = v => (tem(v) ? `${milhares(v)} €` : 'não sei')
    partes.push(
      `Faturação 12 meses: ${euros(contas.faturacao)}`,
      `Negócios 12 meses: ${tem(contas.negocios) ? milhares(contas.negocios) : 'não sei'}`,
      `Objetivo 12 meses: ${euros(contas.objetivo)}`,
    )
  }
  return partes.join(' | ')
}
