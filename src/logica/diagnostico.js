/* diagnóstico de 2 minutos: as perguntas do diagnóstico inicial da Clara e as contas feitas só com as respostas
   de cada consultor. Não há médias do mercado nem comparações com outros: tudo o que aparece no resultado
   sai dos números que a pessoa deu. «Não sei» é sempre aceite e fica como null. */

export const NAO_SEI = null

export const PERGUNTAS = [
  {
    id: 'anos', tipo: 'opcoes', texto: 'Há quanto tempo estás no imobiliário?',
    opcoes: [['menos-2', 'Menos de 2 anos'], ['2-5', '2 a 5 anos'], ['mais-5', 'Mais de 5 anos']],
  },
  {
    id: 'dedicacao', tipo: 'opcoes', texto: 'Trabalhas no imobiliário a tempo inteiro?',
    opcoes: [['inteiro', 'Sim, a tempo inteiro'], ['parcial', 'A tempo parcial']],
  },
  { id: 'leads', tipo: 'numero', texto: 'Quantas leads recebes por mês?', unidade: 'leads por mês', max: 5000 },
  {
    id: 'resposta', tipo: 'opcoes', texto: 'Quanto tempo demoras, em média, a responder a uma lead nova?',
    opcoes: [['minutos', 'Menos de 15 minutos'], ['hora', 'Até 1 hora'], ['horas', 'Algumas horas'], ['dia', 'No dia seguinte ou mais']],
  },
  { id: 'angariacoes', tipo: 'numero', texto: 'Quantas angariações tens ativas?', unidade: 'angariações', max: 1000 },
  { id: 'negocios', tipo: 'numero', texto: 'Quantos negócios fechaste nos últimos 12 meses?', unidade: 'negócios', max: 1000 },
  { id: 'faturacao', tipo: 'numero', texto: 'Quanto faturaste nos últimos 12 meses?', unidade: '€', max: 10000000 },
  { id: 'objetivo', tipo: 'numero', texto: 'Quanto queres faturar nos próximos 12 meses?', unidade: '€', max: 10000000 },
  {
    id: 'ciclo', tipo: 'opcoes', texto: 'Da primeira conversa à escritura, quanto tempo passa em média?',
    opcoes: [['menos-3', 'Menos de 3 meses'], ['3-6', '3 a 6 meses'], ['6-12', '6 a 12 meses'], ['mais-12', 'Mais de 12 meses']],
  },
  {
    id: 'dificuldades', tipo: 'varias', max: 3, texto: 'O que te custa mais hoje? Escolhe até 3.',
    opcoes: [['falta-leads', 'Falta de leads'], ['leads-fracas', 'Leads fracas'], ['tempo', 'Falta de tempo'], ['documentos', 'Documentos'], ['credito', 'Crédito'], ['angariacao', 'Angariação'], ['outra', 'Outra coisa']],
  },
]

/* o que a Clara faz para cada dificuldade; «onde» leva à página que explica */
export const FOCOS = {
  'falta-leads': { titulo: 'Mais negócio da base que já tens', texto: 'Na Clara Pro, a reativação trabalha os contactos parados e a Clara ajuda-te a criar e lançar campanhas pela própria plataforma.', onde: '/reativar/' },
  'leads-fracas': { titulo: 'Saber logo quem vale a pena', texto: 'A Clara qualifica cada lead com o teu guião e dá-lhe uma pontuação de 0 a 100, com os motivos.', onde: '/leads/' },
  tempo: { titulo: 'Menos horas em tarefas', texto: 'Respostas às leads, plano do dia e notas de voz que se registam sozinhas.', onde: '/dia/' },
  documentos: { titulo: 'Documentos sem andar atrás', texto: 'Checklist por imóvel, pedidos ao proprietário pelo WhatsApp e lembretes quando tarda.', onde: '/proprietarios/' },
  credito: { titulo: 'O crédito a tempo', texto: 'A Clara mede quanto demoras a passar o comprador ao intermediário de crédito e avisa-te quando está a demorar.', onde: '/' },
  angariacao: { titulo: 'Mais angariações', texto: 'Leads de proprietários qualificadas e, na Clara Pro e na Elite, depois do lançamento, os particulares a vender sem agência na tua zona, todas as segundas.', onde: '/angariacao/' },
  resposta: { titulo: 'Responder em minutos', texto: 'A Clara responde às leads a qualquer hora, com o teu guião, e entrega-te as qualificadas no plano do dia.', onde: '/leads/' },
}

const RESPOSTA_LENTA = new Set(['hora', 'horas', 'dia'])

export const euros = v => `${new Intl.NumberFormat('pt-PT', { maximumFractionDigits: 0 }).format(v)} €`
const inteiro = v => new Intl.NumberFormat('pt-PT', { maximumFractionDigits: 0 }).format(v)
const umaCasa = v => new Intl.NumberFormat('pt-PT', { maximumFractionDigits: 1 }).format(v)

/* número válido (inteiro, sem negativos, até ao máximo da pergunta) ou null */
export function lerNumero(texto, max = Infinity) {
  const limpo = String(texto ?? '').replace(/[\s.€]/g, '').replace(',', '.')
  if (limpo === '') return NAO_SEI
  const n = Number(limpo)
  if (!Number.isFinite(n) || n < 0 || n > max) return NAO_SEI
  return Math.round(n)
}

const rotulo = (id, valor) => PERGUNTAS.find(p => p.id === id)?.opcoes?.find(([v]) => v === valor)?.[1]
const tem = v => v !== NAO_SEI && v !== undefined

/* contas com as respostas: objetivo, leads, angariações, focos e o plano que faz mais sentido */
export function calcularDiagnostico(r = {}) {
  const blocos = []

  // objetivo: quantos negócios faltam, pelo valor médio de cada negócio do próprio consultor
  if (tem(r.faturacao) && tem(r.negocios) && tem(r.objetivo) && r.faturacao > 0 && r.negocios > 0 && r.objetivo > 0) {
    const media = r.faturacao / r.negocios
    const precisas = Math.ceil(r.objetivo / media)
    const aMais = precisas - r.negocios
    if (aMais > 0) {
      blocos.push({
        id: 'objetivo', numero: `+${inteiro(aMais)}`, rotulo: aMais === 1 ? 'negócio por ano' : 'negócios por ano',
        texto: `Cada negócio teu vale em média ${euros(media)}. Para chegares a ${euros(r.objetivo)} precisas de cerca de ${inteiro(precisas)} negócios nos próximos 12 meses: mais ${inteiro(aMais)} do que no último ano, cerca de ${umaCasa(precisas / 12)} por mês.`,
      })
    } else {
      blocos.push({
        id: 'objetivo', numero: inteiro(precisas), rotulo: precisas === 1 ? 'negócio por ano' : 'negócios por ano',
        texto: `Com o valor médio dos teus negócios (${euros(media)}), chegas a ${euros(r.objetivo)} com cerca de ${inteiro(precisas)} negócios, o ritmo do último ano. A Clara ajuda-te a mantê-lo com menos horas.`,
      })
    }
  }

  // leads: quantas por ano e quantas por negócio, com os números da pessoa
  if (tem(r.leads) && r.leads > 0) {
    const porAno = r.leads * 12
    const porNegocio = tem(r.negocios) && r.negocios > 0 ? Math.round(porAno / r.negocios) : null
    const lenta = RESPOSTA_LENTA.has(r.resposta)
    blocos.push({
      id: 'leads', numero: inteiro(porAno), rotulo: 'leads por ano',
      texto: [
        porNegocio ? `No último ano fechaste 1 negócio por cada ${inteiro(porNegocio)} leads.` : 'Com os negócios fechados, a Clara mostra-te quantas leads precisas para cada negócio.',
        lenta ? `Respondes em média ${rotulo('resposta', r.resposta).toLowerCase()}: a Clara responde em minutos, a qualquer hora.` : r.resposta === 'minutos' ? 'Já respondes depressa: a Clara mantém o ritmo à noite e ao fim de semana.' : '',
      ].filter(Boolean).join(' '),
    })
  }

  // angariações: o número que deu
  if (tem(r.angariacoes)) {
    blocos.push({
      id: 'angariacoes', numero: inteiro(r.angariacoes), rotulo: r.angariacoes === 1 ? 'angariação ativa' : 'angariações ativas',
      texto: 'A Clara qualifica as leads de proprietários, pede os documentos por ti e procura na tua carteira os compradores que encaixam.',
    })
  }

  // focos: as dificuldades escolhidas, mais a resposta lenta
  const ids = [...new Set([...(RESPOSTA_LENTA.has(r.resposta) ? ['resposta'] : []), ...(r.dificuldades || []).filter(d => FOCOS[d])])]
  const focos = ids.slice(0, 3).map(id => ({ id, ...FOCOS[id] }))

  const plano = (r.dificuldades || []).includes('falta-leads') ? 'pro' : 'clara'

  return { blocos, focos, plano, resumo: resumoDiagnostico(r) }
}

/* texto que segue com a inscrição, para a sessão de configuração */
export function resumoDiagnostico(r = {}) {
  const partes = PERGUNTAS.map(p => {
    const v = r[p.id]
    let valor
    if (p.tipo === 'varias') valor = (v || []).map(x => rotulo(p.id, x)).filter(Boolean).join(', ')
    else if (p.tipo === 'opcoes') valor = tem(v) ? rotulo(p.id, v) : ''
    else valor = tem(v) ? (p.unidade === '€' ? euros(v) : inteiro(v)) : ''
    return `${p.texto.replace(/\?.*$/, '?')} ${valor || 'não sei'}`
  })
  return partes.join(' | ')
}
