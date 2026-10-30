/* landing pages dos anúncios da N5 Clara: uma página por ângulo, com a mesma oferta e o mesmo formulário do site.
   Cada página repete a promessa do anúncio que lá leva, mostra a Clara a fazê-lo e acaba na inscrição.
   As cenas usam o formato do «Um dia com a Clara» (src/dia/dados.js): «p» é o passo em que cada peça aparece. */
import { CENAS } from '../dia/dados.js'

const cena = id => CENAS.find(c => c.id === id)

/* cenas novas, só das landing pages */
const LEAD_NOITE = {
  id: 'lead-noite',
  hora: '23:12',
  curto: 'Lead à noite',
  passos: 4,
  eyebrow: '23:12 · Lead nova',
  titulo: 'Uma lead às 23:12. Resposta às 23:13.',
  texto: 'A lead escreve quando pode, não quando estás livre. A Clara responde em minutos, segue o teu guião e qualifica-a enquanto descansas.',
  canal: { nome: 'Rita Moura', sub: 'WhatsApp · lead' },
  mensagens: [
    { de: 'outro', texto: 'Olá, o T2 em Alvalade ainda está disponível?', p: 1 },
    { de: 'clara', texto: 'Olá Rita! Sou a Clara, assistente do Rui. Está disponível, sim. É para viver ou para investir? E já tem crédito aprovado?', p: 2 },
    { de: 'outro', texto: 'Para viver. Tenho crédito pré-aprovado.', p: 3 },
  ],
  cartoes: [
    { tipo: 'origem', p: 1, texto: 'Campanha Meta · Compradores Lisboa' },
    { tipo: 'numero', p: 2, numero: '1 min', texto: 'até à primeira resposta, às 23:13' },
    { tipo: 'resumo', p: 3, titulo: 'Lead qualificada', chips: ['Compradora', 'T2', 'Para viver', 'Crédito pré-aprovado'], nota: 'Entrou no plano de amanhã do Rui, à frente das outras.' },
    { tipo: 'numero', p: 4, numero: '82', texto: 'de 100 no scoring: crédito pré-aprovado, sabe o que procura e respondeu em minutos' },
  ],
}

const FSBO = {
  id: 'fsbo',
  hora: '08:30',
  curto: 'Proprietários',
  passos: 4,
  eyebrow: 'Segunda, 08:30 · Angariação',
  titulo: 'Os proprietários que vendem sozinhos, por ordem.',
  texto: 'A Clara junta os anúncios de particulares das tuas freguesias, ordena-os por probabilidade de angariação e prepara a chamada com os números de cada anúncio.',
  canal: { nome: 'Clara', sub: 'a tua assistente' },
  mensagens: [
    { de: 'clara', texto: 'Bom dia, Rui! Esta semana há 7 proprietários a vender sozinhos em Arroios. Pus primeiro os que têm mais probabilidade de angariação.', p: 1 },
    { de: 'rui', texto: 'Quem é o primeiro?', p: 2 },
    { de: 'clara', texto: 'O T2 de Arroios: está à venda há 94 dias e 12% acima da mediana da freguesia. Tens 3 compradores que encaixam. A chamada está preparada.', p: 3 },
  ],
  cartoes: [
    {
      tipo: 'plano', p: 1, titulo: 'Arroios · particulares esta semana',
      itens: [
        { h: '87', t: 'T2 · 94 dias à venda' },
        { h: '79', t: 'T3 · baixou o preço 2 vezes' },
        { h: '71', t: 'T1 · anunciado em 4 portais' },
      ],
    },
    { tipo: 'resumo', p: 3, titulo: 'Chamada preparada', chips: ['«Não quero pagar comissão»', '«Prefiro vender sozinho»', '«O preço está certo»'], nota: 'Objetivo da chamada: marcar uma avaliação gratuita.' },
    { tipo: 'match', p: 4, titulo: '3 compradores da tua carteira encaixam', chips: ['Zona', 'Tipologia', 'Orçamento'], nomes: ['AR', 'JM', 'CS'] },
  ],
}

const PROPRIETARIO = {
  id: 'proprietario',
  hora: '10:05',
  curto: 'Lead de proprietário',
  passos: 4,
  eyebrow: '10:05 · Lead de proprietário',
  titulo: 'Um proprietário quer vender. Chega-te qualificado.',
  texto: 'A Clara reconhece a lead da tua campanha de proprietários e usa o guião de proprietários: motivação, prazo, preço e documentos.',
  canal: { nome: 'Carlos Antunes', sub: 'WhatsApp · proprietário' },
  mensagens: [
    { de: 'outro', texto: 'Bom dia. Quero vender a minha moradia em Oeiras e vi o vosso anúncio.', p: 1 },
    { de: 'clara', texto: 'Olá Carlos! Sou a Clara, assistente do Rui. Para prepararmos a avaliação: até quando gostava de vender? E tem a caderneta e a certidão à mão?', p: 2 },
    { de: 'outro', texto: 'Até março, se possível. Tenho as duas.', p: 3 },
  ],
  cartoes: [
    { tipo: 'origem', p: 1, texto: 'Campanha Meta · Proprietários Oeiras' },
    { tipo: 'resumo', p: 3, titulo: 'Proprietário qualificado', chips: ['Moradia T4', 'Vender até março', 'Caderneta e certidão'], nota: 'Entrou no teu plano do dia: marcar a reunião de angariação.' },
    { tipo: 'numero', p: 4, numero: '74', texto: 'de 100 em probabilidade de angariação: prazo curto, documentos à mão e respondeu no próprio dia' },
  ],
}

const REATIVACAO = {
  id: 'reativacao',
  hora: '09:00',
  curto: 'Reativação',
  passos: 4,
  eyebrow: '09:00 · Reativação da base',
  titulo: 'A tua base, por grupos, com uma mensagem para cada um.',
  texto: 'De três em três meses, a Clara prepara a reativação de toda a tua base. Vês o custo estimado antes de enviar e quem responde volta ao teu pipeline.',
  canal: { nome: 'Clara', sub: 'a tua assistente' },
  mensagens: [
    { de: 'clara', texto: 'Bom dia, Rui! A reativação deste trimestre está pronta: 212 contactos em 4 grupos, com uma mensagem para cada um. O custo estimado na Meta já está calculado.', p: 1 },
    { de: 'rui', texto: 'Envia.', p: 2 },
    { de: 'clara', texto: 'Feito, em envios escalonados. Já responderam 6 e 2 compradores voltaram ao teu pipeline.', p: 4 },
  ],
  cartoes: [
    {
      tipo: 'plano', p: 1, titulo: 'A tua base, por grupos',
      itens: [
        { h: '64', t: 'Compradores que não compraram' },
        { h: '38', t: 'Proprietários que não angariaste' },
        { h: '51', t: 'Clientes com negócio fechado' },
        { h: '59', t: 'Leads que nunca responderam' },
      ],
    },
    { tipo: 'numero', p: 3, numero: '6', texto: 'respostas na primeira manhã' },
    { tipo: 'feito', p: 4, texto: '2 compradores voltaram ao teu pipeline e à qualificação.' },
  ],
}

export const CENAS_LANDING = [LEAD_NOITE, FSBO, PROPRIETARIO, REATIVACAO]

/* plano: preenche o «Plano que te interessa» no formulário; nota: aviso honesto sobre o que entra e quando */
export const PAGINAS = {
  leads: {
    titulo: 'Nenhuma lead fica sem resposta · N5 Clara',
    descricao: 'A Clara responde às tuas leads da Meta em minutos, a qualquer hora, qualifica-as com o teu guião e diz-te a quem ligar primeiro.',
    eyebrow: 'N5 Clara · Leads',
    h1: 'Nenhuma lead paga fica sem resposta.',
    lead: 'A Clara responde às tuas leads da Meta em minutos, a qualquer hora, segue o teu guião e qualifica-as por ti. De manhã tens no plano do dia quem está pronto, com uma pontuação de 0 a 100 e o porquê.',
    cenas: [LEAD_NOITE, cena('lead')],
    passos: [
      { titulo: 'Ligas as tuas campanhas', texto: 'Na configuração ligas os anúncios da Meta e o WhatsApp das leads. A Clara reconhece se a lead é compradora, proprietária, investidora ou de arrendamento.' },
      { titulo: 'A Clara responde com o teu guião', texto: 'O guião são as perguntas que fazias tu. A Clara responde em minutos e qualifica: finalidade, orçamento, crédito e prazo.' },
      { titulo: 'Ligas a quem está pronto', texto: 'Cada lead tem uma pontuação de 0 a 100 e os três motivos que mais pesaram. O plano do dia põe as quentes primeiro e avisa-te quando uma arrefece.' },
    ],
    plano: 'clara',
  },
  angariacao: {
    titulo: 'Proprietários a vender sozinhos, todas as segundas · N5 Clara',
    descricao: 'A Clara junta os proprietários a vender sozinhos nas tuas freguesias, ordena-os por probabilidade de angariação e prepara a chamada.',
    eyebrow: 'N5 Clara · Angariação',
    h1: 'Proprietários a vender sozinhos, à tua frente todas as segundas.',
    lead: 'Escolhes as freguesias onde queres angariar. Todas as segundas, a Clara junta os anúncios de particulares dessas freguesias, põe-nos por ordem de probabilidade de angariação e prepara a chamada: argumentos com os números do anúncio e respostas às objeções.',
    cenas: [FSBO],
    passos: [
      { titulo: 'Escolhes as freguesias', texto: 'Dizes à Clara onde queres angariar. Anúncios que recusam agências ficam de fora e cada proprietário só é contactado uma vez.' },
      { titulo: 'A lista chega à segunda', texto: 'O mesmo imóvel em vários portais conta uma vez. Cada anúncio tem uma pontuação de 0 a 100: tempo à venda, descidas de preço, preço face à freguesia, qualidade do anúncio e compradores teus que encaixam.' },
      { titulo: 'Ligas a saber o que dizer', texto: 'Argumento com os números do anúncio, respostas às objeções mais comuns e o objetivo da chamada. Quem aceita conversar entra no teu pipeline de proprietários.' },
    ],
    nota: { titulo: 'Quando chega', texto: 'A procura semanal de proprietários está em preparação e chega à Clara depois do lançamento de 1 de dezembro. Inscreve-te e és dos primeiros a usá-la. Desde o primeiro dia, a Clara já qualifica as leads das tuas campanhas de proprietários e pede-lhes os documentos.', link: { href: '/proprietarios/', texto: 'Ver as leads de proprietários' } },
    plano: '',
  },
  proprietarios: {
    titulo: 'Leads de proprietários, já qualificadas · N5 Clara',
    descricao: 'A Clara qualifica as leads das tuas campanhas de proprietários e pede-lhes os documentos pelo WhatsApp.',
    eyebrow: 'N5 Clara · Proprietários',
    h1: 'Proprietários que querem vender, já qualificados.',
    lead: 'Ligas as tuas campanhas de proprietários e a Clara qualifica cada lead com o teu guião: motivação, prazo, preço pretendido e documentos. Quando angarias, abre a checklist do imóvel e pede os documentos ao proprietário pelo WhatsApp.',
    cenas: [PROPRIETARIO, cena('angariacao')],
    passos: [
      { titulo: 'Campanha de proprietários', texto: 'Ligas os teus anúncios de proprietários. A Clara reconhece o tipo de lead e usa o guião de proprietários.' },
      { titulo: 'Qualificação e pontuação', texto: 'Motivação para vender, prazo, preço pretendido e documentos. Cada proprietário tem uma pontuação de angariação e entra no teu plano do dia.' },
      { titulo: 'Documentos sem andar atrás', texto: 'Quando angarias, a Clara abre a checklist do imóvel, pede o que falta pelo WhatsApp e volta a lembrar quando tarda.' },
    ],
    plano: 'clara',
  },
  dia: {
    titulo: 'O teu dia por ordem · N5 Clara',
    descricao: 'O plano do dia por prioridade logo de manhã e notas de voz que se registam sozinhas.',
    eyebrow: 'N5 Clara · O teu dia',
    h1: 'O teu dia por ordem. Falas, a Clara regista.',
    lead: 'Antes do primeiro café tens o plano do dia por prioridade: visitas, leads a seguir, documentos em falta e compradores que encaixam. Na rua, gravas uma nota de voz e a Clara transcreve, guarda na ficha certa e marca o passo seguinte.',
    cenas: [cena('plano'), cena('voz')],
    passos: [
      { titulo: 'Bom dia, com o plano feito', texto: 'A Clara junta visitas, leads, documentos e compradores e põe tudo por ordem de prioridade, no teu Google Calendar.' },
      { titulo: 'Na rua, uma nota de voz', texto: 'Sais da visita e falas. A Clara transcreve, guarda o feedback na ficha e deteta os marcos, como «falei com o crédito».' },
      { titulo: 'Sem formulários', texto: 'Não registas à mão o que já fizeste. Se tens um CRM obrigatório, o copiloto preenche-o por ti.' },
    ],
    plano: 'clara',
  },
  crm: {
    titulo: 'O CRM da tua marca, preenchido por ti · N5 Clara',
    descricao: 'O copiloto da Clara preenche o CRM da tua marca na sessão que já tens aberta. Incluído na pré-reserva.',
    eyebrow: 'N5 Clara · Consultores de rede',
    h1: 'O CRM da tua marca é obrigatório. Escrever lá à mão, não.',
    lead: 'O copiloto da Clara trabalha no browser, na sessão que já tens aberta, e regista no CRM da tua marca os contactos, as visitas, o feedback e os documentos que ela captou. Nunca te pede palavras-passe.',
    copiloto: true,
    cenas: [cena('voz')],
    passos: [
      { titulo: 'Falas ou escreves à Clara', texto: 'Visitas, feedback e notas entram pela conversa, por voz ou por texto, no escritório ou na rua.' },
      { titulo: 'O copiloto preenche', texto: 'Abres o CRM da tua marca e o copiloto escreve nos campos o que a Clara captou, e anexa os documentos do imóvel.' },
      { titulo: 'Confirmas e gravas', texto: 'Fica registado na Clara o que já passou para o CRM da marca e o que falta, e isso entra no teu plano do dia.' },
    ],
    nota: { titulo: 'Incluído na pré-reserva', texto: 'O copiloto para o CRM da tua marca vem incluído na pré-reserva de 27 €, para os 25 consultores que entram a 1 de dezembro. Na sessão de configuração confirmamos contigo o que o teu CRM deixa preencher.' },
    plano: '',
  },
  reativar: {
    titulo: 'Os teus contactos antigos também são leads · N5 Clara',
    descricao: 'A Clara separa a tua base por grupos, prepara a mensagem de cada um e quem responde volta ao teu pipeline.',
    eyebrow: 'N5 Clara · A tua base',
    h1: 'Os teus contactos antigos também são leads.',
    lead: 'Compradores que não compraram, proprietários que não angariaste, clientes com negócio fechado e leads que nunca responderam. A Clara separa a tua base por grupos, prepara a mensagem de cada um e mostra-te o custo antes de enviar. Quem responde volta ao teu pipeline.',
    cenas: [REATIVACAO],
    passos: [
      { titulo: 'A base por grupos', texto: 'A Clara separa os teus contactos pelo que aconteceu com cada um, e ignora quem pediu para não ser contactado.' },
      { titulo: 'Uma mensagem por grupo', texto: 'Com o contexto da última conversa. Vês o custo estimado dos envios na Meta antes de os fazer, e os envios saem escalonados.' },
      { titulo: 'Quem responde volta ao pipeline', texto: 'E entra outra vez na qualificação. Entre campanhas, a Clara lembra-te dos contactos parados há demasiado tempo.' },
    ],
    nota: { titulo: 'Em que plano', texto: 'A reativação faz parte da Clara Pro. Os envios de templates são cobrados pela Meta no teu cartão, e a Clara mostra-te a estimativa antes de cada envio.' },
    plano: 'pro',
  },
  chamadas: {
    titulo: 'Coaching das tuas chamadas, todos os dias · N5 Clara',
    descricao: 'Com a Clara Elite, cada chamada fica transcrita e analisada e todas as manhãs recebes o que correu bem e o que melhorar.',
    eyebrow: 'N5 Clara Elite · Chamadas',
    h1: 'Quem te diz o que correu mal na chamada de ontem?',
    lead: 'Com a Clara Elite ligas a partir da tua app da Clara, com o teu número. Cada chamada fica na ficha do cliente, transcrita e analisada, e todas as manhãs recebes o que correu bem, o que melhorar e a fila de chamadas do dia.',
    cenas: [cena('chamada'), cena('relatorio')],
    passos: [
      { titulo: 'Ligas a partir da ficha', texto: 'Antes de ligares, a Clara mostra-te o contexto e o objetivo da chamada. O cliente vê o teu número.' },
      { titulo: 'Cada chamada analisada', texto: 'Abertura, descoberta, objeções e próximo passo. A transcrição e o resumo ficam na ficha do cliente.' },
      { titulo: 'Coaching todas as manhãs', texto: 'O que correu bem, o que melhorar, a fila de hoje e a tua tendência ao longo da semana e do mês.' },
    ],
    nota: { titulo: 'Em que plano', texto: 'As chamadas e o coaching fazem parte da Clara Elite, com 500 minutos de chamadas incluídos.' },
    plano: 'elite',
  },
}

export const DIAGNOSTICO = {
  titulo: 'Diagnóstico de 2 minutos para consultores · N5 Clara',
  descricao: 'Responde a 10 perguntas e vê, com os teus números, quantos negócios te faltam para o teu objetivo e onde a Clara te ajuda primeiro.',
  eyebrow: 'N5 Clara · Diagnóstico',
  h1: '2 minutos para saber onde perdes tempo e negócios.',
  lead: 'Dez perguntas sobre como trabalhas hoje. No fim vês, com os teus números, quantos negócios te faltam para o teu objetivo e onde a Clara te ajuda primeiro. «Não sei» também conta.',
}
