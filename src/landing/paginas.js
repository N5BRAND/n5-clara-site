/* landing pages dos anúncios da N5 Clara: uma página por ângulo, cada uma com o seu objetivo. Repetem a promessa do anúncio
   que lá leva, mostram a Clara a fazê-lo e acabam na reserva, com título, frase e plano próprios (reserva, plano).
   As cenas usam o formato do «Um dia com a Clara» (src/dia/dados.js): «p» é o passo em que cada peça aparece.
   cena(id, mudar) muda a cena só na página que a usa; o «Um dia com a Clara» da página principal fica igual.
   «exemplo» identifica o que é simulação (horas, nomes, números). */
import { CENAS } from '../dia/dados.js'
import { OFERTA, PRE_RESERVA } from '../logica/pagamento.js'

const cena = (id, mudar = {}) => ({ ...CENAS.find(c => c.id === id), ...mudar })

/* cenas novas, só das landing pages */
const LEAD_NOITE = {
  id: 'lead-noite',
  hora: '23:12',
  curto: 'Lead à noite',
  passos: 4,
  eyebrow: '23:12 · Lead da Meta, pelo WhatsApp',
  titulo: 'Uma lead às 23:12. Resposta às 23:13.',
  texto: 'Estás numa visita, a jantar ou a descansar. A Clara responde em minutos, segue o teu guião e qualifica a lead. De manhã tens o que ela procura e o próximo passo.',
  exemplo: 'Exemplo: horas, nomes e contactos fictícios.',
  canal: { nome: 'Rita Moura', sub: 'WhatsApp · lead da Meta' },
  mensagens: [
    { de: 'outro', texto: 'Olá, vi o anúncio do T2 em Alvalade. Ainda está disponível?', p: 1 },
    { de: 'clara', texto: 'Olá Rita! Sou a Clara, assistente do Rui. Está disponível, sim. É para viver ou para investir? E já tem crédito aprovado?', p: 2 },
    { de: 'outro', texto: 'Para viver. Temos crédito pré-aprovado até 320 mil e queremos mudar até março.', p: 3 },
  ],
  cartoes: [
    { tipo: 'origem', p: 1, texto: 'Campanha Meta · Compradores Lisboa' },
    { tipo: 'numero', p: 2, numero: '1 min', texto: 'até à primeira resposta, às 23:13' },
    { tipo: 'resumo', p: 3, titulo: 'O que a Clara te entrega', chips: ['Procura: T2 para viver', 'Orçamento: até 320 mil €', 'Prazo: até março', 'Crédito pré-aprovado'], nota: 'Próximo passo: ligar de manhã para marcar a visita.' },
    { tipo: 'numero', p: 4, numero: 'Alta', texto: 'prioridade de acompanhamento: crédito pré-aprovado, sabe o que procura e quer mudar até março' },
  ],
}

const FSBO = {
  id: 'fsbo',
  hora: '08:30',
  curto: 'Particulares',
  passos: 4,
  eyebrow: 'Segunda, 08:30 · Angariação',
  titulo: 'Os particulares que vendem sem agência, por prioridade.',
  texto: 'A Clara junta os anúncios de particulares das tuas freguesias, ordena-os por pontuação de prioridade e prepara a abordagem com os números de cada anúncio. A chamada é tua.',
  exemplo: 'Exemplo: freguesia, anúncios e números fictícios.',
  canal: { nome: 'Clara', sub: 'a tua assistente' },
  mensagens: [
    { de: 'clara', texto: 'Bom dia, Rui! Esta semana há 7 particulares a vender sem agência em Arroios. Pus primeiro os que têm mais prioridade.', p: 1 },
    { de: 'rui', texto: 'Quem é o primeiro?', p: 2 },
    { de: 'clara', texto: 'O T2 de Arroios: está à venda há 94 dias e 12% acima da mediana da freguesia. Tens 3 compradores que encaixam. Preparei-te a abordagem.', p: 3 },
  ],
  cartoes: [
    {
      tipo: 'plano', p: 1, titulo: 'Arroios · particulares por prioridade',
      itens: [
        { h: '1.º', t: 'T2 · 94 dias à venda · pontuação 87' },
        { h: '2.º', t: 'T3 · baixou o preço 2 vezes · pontuação 79' },
        { h: '3.º', t: 'T1 · anunciado em 4 portais · pontuação 71' },
      ],
    },
    { tipo: 'resumo', p: 3, titulo: 'Abordagem preparada', chips: ['«Não quero pagar comissão»', '«Prefiro vender sozinho»', '«O preço está certo»'], nota: 'Objetivo da chamada: marcar uma avaliação gratuita. Quem liga és tu.' },
    { tipo: 'match', p: 4, titulo: '3 compradores da tua carteira encaixam', chips: ['Zona', 'Tipologia', 'Orçamento'], nomes: ['AR', 'JM', 'CS'] },
  ],
}

const PROPRIETARIO = {
  id: 'proprietario',
  hora: '10:05',
  curto: 'Lead de proprietário',
  passos: 4,
  eyebrow: 'Antes da angariação · 10:05',
  titulo: 'Um proprietário quer vender. Chega-te qualificado.',
  texto: 'A Clara reconhece a lead da tua campanha de proprietários e segue o guião de proprietários: motivação, prazo, preço e documentos.',
  exemplo: 'Exemplo: nomes e contactos fictícios.',
  canal: { nome: 'Carlos Antunes', sub: 'WhatsApp · proprietário' },
  mensagens: [
    { de: 'outro', texto: 'Bom dia. Quero vender a minha moradia em Oeiras e vi o vosso anúncio.', p: 1 },
    { de: 'clara', texto: 'Olá Carlos! Sou a Clara, assistente do Rui. Para prepararmos a avaliação: até quando gostava de vender? E tem a caderneta e a certidão à mão?', p: 2 },
    { de: 'outro', texto: 'Até março, se possível. Tenho as duas.', p: 3 },
  ],
  cartoes: [
    { tipo: 'origem', p: 1, texto: 'Campanha Meta · Proprietários Oeiras' },
    { tipo: 'resumo', p: 3, titulo: 'Proprietário qualificado', chips: ['Moradia T4', 'Vender até março', 'Caderneta e certidão'], nota: 'Entrou no teu plano do dia: marcar a reunião de angariação.' },
    { tipo: 'numero', p: 4, numero: 'Alta', texto: 'prioridade de acompanhamento: prazo curto, documentos à mão e respondeu no próprio dia' },
  ],
}

const REATIVACAO = {
  id: 'reativacao',
  hora: '09:00',
  curto: 'Reativação',
  passos: 4,
  eyebrow: '09:00 · Reativação da base',
  titulo: 'A tua base, por grupos, com uma mensagem para cada um.',
  texto: 'De três em três meses, a Clara prepara a reativação da tua base. Vês o custo estimado e decides quando enviar. Quem responde volta ao teu acompanhamento.',
  exemplo: 'Simulação: contactos, grupos e respostas fictícios.',
  canal: { nome: 'Clara', sub: 'a tua assistente' },
  mensagens: [
    { de: 'clara', texto: 'Bom dia, Rui! A reativação deste trimestre está preparada: 212 contactos em 4 grupos, com uma mensagem para cada um. O custo estimado na Meta já está calculado.', p: 1 },
    { de: 'rui', texto: 'Envia.', p: 2 },
    { de: 'clara', texto: 'Feito, em envios escalonados. Já responderam 6 e 2 compradores voltaram ao teu acompanhamento.', p: 4 },
  ],
  cartoes: [
    {
      tipo: 'plano', p: 1, titulo: 'A tua base, por grupos',
      itens: [
        { h: '64', t: 'Compradores que não compraram' },
        { h: '38', t: 'Proprietários que não angariaste' },
        { h: '51', t: 'Antigos clientes' },
        { h: '59', t: 'Leads que nunca responderam' },
      ],
    },
    { tipo: 'numero', p: 3, numero: '6', texto: 'respostas na primeira manhã, nesta simulação' },
    { tipo: 'feito', p: 4, texto: '2 compradores voltaram ao teu acompanhamento e à qualificação.' },
  ],
}

export const CENAS_LANDING = [LEAD_NOITE, FSBO, PROPRIETARIO, REATIVACAO]

/* plano: fica escolhido no formulário e aparece no resumo; nota: aviso honesto sobre o que entra e quando;
   reserva: título e frase do bloco da reserva, ligados ao benefício da página */
export const PAGINAS = {
  leads: {
    titulo: 'As tuas leads recebem resposta mesmo numa visita · N5 Clara',
    descricao: 'A Clara responde às leads das tuas campanhas Meta pelo WhatsApp em minutos, qualifica-as com o teu guião e diz-te o próximo passo.',
    eyebrow: 'N5 Clara · Leads',
    h1: 'As tuas leads recebem resposta mesmo quando estás numa visita.',
    lead: 'Neste exemplo, leads das tuas campanhas Meta, com a conversa pelo WhatsApp. A Clara responde em minutos, a qualquer hora, segue o teu guião e entrega-te o que a lead procura, o orçamento, o prazo, o crédito e o próximo passo.',
    cenas: [LEAD_NOITE],
    passos: [
      { titulo: 'Ligas as campanhas e o WhatsApp', texto: 'Na configuração ligas os anúncios da Meta e o WhatsApp onde as leads te escrevem. A Clara reconhece se a lead é compradora, proprietária, investidora ou de arrendamento.' },
      { titulo: 'A Clara responde com o teu guião', texto: 'O guião são as perguntas que fazias tu. A Clara responde em minutos e qualifica: o que procura, orçamento, prazo e crédito.' },
      { titulo: 'Sabes a quem ligar primeiro', texto: 'Cada lead tem uma prioridade de acompanhamento, com os motivos. O plano do dia põe as mais prontas primeiro e avisa-te quando uma arrefece.' },
    ],
    reserva: { titulo: 'Deixa de acumular contactos à espera de resposta.', texto: 'A Clara responde às tuas leads desde o primeiro dia, mesmo quando estás numa visita.' },
    plano: 'clara',
  },
  angariacao: {
    titulo: 'Encontra particulares para a tua próxima angariação · N5 Clara',
    descricao: 'Escolhes as freguesias, recebes os anúncios de particulares por prioridade e tens os argumentos para preparar a abordagem.',
    eyebrow: 'N5 Clara · Angariação',
    h1: 'Encontra particulares para a tua próxima angariação.',
    lead: 'Escolhes as freguesias. Recebes os anúncios de particulares organizados por prioridade. Tens os argumentos para preparar a abordagem, com os números de cada anúncio. A Clara prepara, a chamada é tua.',
    cenas: [FSBO],
    passos: [
      { titulo: 'Escolhes as freguesias', texto: 'Dizes à Clara onde queres angariar. Anúncios que recusam agências ficam de fora.' },
      { titulo: 'Recebes a lista por prioridade', texto: 'O mesmo imóvel em vários portais aparece uma vez na tua lista. Cada anúncio tem uma pontuação de prioridade de 0 a 100: tempo à venda, descidas de preço, preço face à freguesia, qualidade do anúncio e compradores teus que encaixam.' },
      { titulo: 'Ligas a saber o que dizer', texto: 'A Clara prepara o argumento com os números do anúncio, as respostas às objeções mais comuns e o objetivo da chamada. Tu fazes a chamada; quem aceita conversar entra no teu pipeline de proprietários.' },
    ],
    nota: { titulo: 'Clara Pro e Elite', texto: `A procura de particulares faz parte da Clara Pro e da Clara Elite e chega depois do lançamento, primeiro para quem entra com as 25 vagas de lançamento. A lista não é exclusiva: o mesmo anúncio pode aparecer a outros consultores. Desde o primeiro dia, a Clara já qualifica as leads das tuas campanhas de proprietários. ${OFERTA.planoSuperior('pro-elite')}` },
    reserva: { titulo: 'Reserva a Clara para começares a trabalhar novas oportunidades de angariação.', texto: 'A procura de particulares está na Clara Pro e na Clara Elite.' },
    plano: 'pro',
  },
  proprietarios: {
    titulo: 'A Clara qualifica os proprietários das tuas campanhas · N5 Clara',
    descricao: 'A Clara qualifica as leads das tuas campanhas de proprietários e, depois da angariação, acompanha os documentos do imóvel.',
    eyebrow: 'N5 Clara · Proprietários',
    h1: 'A Clara qualifica os proprietários que chegam das tuas campanhas.',
    lead: 'Antes da angariação, qualifica cada proprietário com o teu guião. Depois, acompanha os documentos do imóvel até estar tudo pronto.',
    cenas: [
      PROPRIETARIO,
      cena('angariacao', {
        eyebrow: 'Depois da angariação · 16:20',
        titulo: 'Angariaste o imóvel. A checklist adapta-se a ele.',
        texto: 'A Clara ajusta a lista de documentos a cada imóvel, pede ao proprietário pelo WhatsApp o que falta e volta a lembrar quando tarda.',
        exemplo: 'Exemplo de checklist para um T2: imóvel e proprietário fictícios.',
      }),
    ],
    passos: [
      { titulo: 'Antes: qualificação', texto: 'Ligas os teus anúncios de proprietários. A Clara reconhece o tipo de lead e pergunta pela motivação, o prazo, o preço pretendido e os documentos.' },
      { titulo: 'Prioridade com motivos', texto: 'Cada proprietário tem uma prioridade de acompanhamento, com os motivos, e entra no teu plano do dia para marcares a reunião.' },
      { titulo: 'Depois: documentos', texto: 'Quando angarias, a Clara abre a checklist do imóvel, pede o que falta pelo WhatsApp e volta a lembrar quando tarda.' },
    ],
    reserva: { titulo: 'Chega mais preparado à reunião de angariação.', texto: 'Proprietários qualificados antes da reunião e documentos acompanhados depois.' },
    plano: 'clara',
  },
  dia: {
    titulo: 'O teu dia por ordem · N5 Clara',
    descricao: 'As prioridades do dia logo de manhã e notas de voz que ficam registadas.',
    eyebrow: 'N5 Clara · O teu dia',
    h1: 'O teu dia por ordem. Falas, a Clara regista.',
    lead: 'De manhã tens as prioridades do dia por ordem. Na rua, gravas uma nota de voz e a Clara regista o feedback e prepara o passo seguinte.',
    cenas: [
      cena('plano', { exemplo: 'Exemplo: agenda, nomes e imóveis fictícios.' }),
      cena('voz', {
        exemplo: 'Exemplo: nomes e imóveis fictícios.',
        mensagens: [
          { de: 'rui', voz: '0:18', texto: 'A Marta adorou a cozinha mas achou o segundo quarto pequeno. Quer voltar no sábado com o marido. E já falei com o crédito.', p: 1 },
          { de: 'clara', texto: 'Registado! Feedback na ficha da Marta, passo «falou com o crédito» e a segunda visita de sábado preparada no teu plano.', p: 3 },
        ],
        cartoes: [
          { tipo: 'pessoa', p: 1 },
          { tipo: 'registos', p: 2, itens: ['Feedback da visita guardado na ficha', 'Passo do processo: falou com o crédito', 'Tarefa: preparar a segunda visita de sábado'] },
          { tipo: 'feito', p: 4, texto: 'Segunda visita preparada no teu plano de sábado.' },
        ],
      }),
    ],
    passos: [
      { titulo: 'Bom dia, com as prioridades feitas', texto: 'A Clara junta visitas, leads, documentos e compradores e põe tudo por ordem de prioridade, no teu Google Calendar.' },
      { titulo: 'Na rua, uma nota de voz', texto: 'Sais da visita e falas. A Clara transcreve, guarda o feedback na ficha certa e cria a tarefa seguinte.' },
      { titulo: 'Sem formulários', texto: 'Não registas à mão o que já fizeste. Se tens um CRM obrigatório, o copiloto da Clara Elite preenche-o e tu confirmas antes de gravar.' },
    ],
    reserva: { titulo: 'Começa o dia com as prioridades organizadas.', texto: 'Prioridades do dia logo de manhã e notas de voz que ficam registadas.' },
    plano: 'clara',
  },
  crm: {
    titulo: 'O CRM da tua marca, preenchido pela Clara · N5 Clara',
    descricao: 'O copiloto da Clara preenche o CRM da tua marca na sessão que já tens aberta. Confirmas e gravas.',
    eyebrow: 'N5 Clara · Consultores de rede',
    h1: 'O CRM da tua marca é obrigatório. Escrever lá à mão, não.',
    lead: 'O copiloto da Clara trabalha no browser, na sessão que já tens aberta, e escreve no CRM da tua marca os contactos, as visitas, o feedback e os documentos que ela captou. Confirmas e gravas. Nunca te pede palavras-passe.',
    copiloto: {
      eyebrow: 'Exemplo · Copiloto no CRM da marca',
      titulo: 'Os campos preenchidos. Tu confirmas e gravas.',
      texto: 'Abres o contacto no CRM da tua marca e o copiloto escreve o que a Clara captou da tua nota de voz. Revês os campos e carregas em gravar.',
    },
    cenas: [cena('voz', {
      exemplo: 'Exemplo: nomes e imóveis fictícios.',
      cartoes: [
        { tipo: 'pessoa', p: 1 },
        { tipo: 'registos', p: 2, itens: ['Feedback da visita guardado na ficha', 'Segunda visita: sábado, 11h', 'Passo do processo: falou com o crédito'] },
        { tipo: 'feito', p: 4, texto: 'Pronto para o CRM da tua marca: confirmas e gravas.' },
      ],
    })],
    passos: [
      { titulo: 'Falas ou escreves à Clara', texto: 'Visitas, feedback e notas entram pela conversa, por voz ou por texto, no escritório ou na rua.' },
      { titulo: 'O copiloto preenche', texto: 'Abres o CRM da tua marca e o copiloto escreve nos campos o que a Clara captou, e anexa os documentos do imóvel.' },
      { titulo: 'Confirmas e gravas', texto: 'Fica registado na Clara o que já passou para o CRM da marca e o que falta, e isso entra no teu plano do dia.' },
    ],
    nota: { titulo: 'Copiloto durante 3 meses', texto: `O copiloto para o CRM da tua marca faz parte da Clara Elite. Com a pré-reserva de ${PRE_RESERVA}, tens o copiloto durante 3 meses desde a ativação, em qualquer plano. Depois, continua incluído na Clara Elite; nos outros planos termina, sem cobrança nem mudança automática de plano. Na sessão de configuração confirmamos contigo o que o teu CRM deixa preencher.` },
    reserva: { titulo: 'Reserva a Clara com o copiloto para o teu CRM.', texto: 'A Clara capta, o copiloto preenche e tu confirmas. Durante 3 meses com a pré-reserva, em qualquer plano.' },
    plano: '',
  },
  reativar: {
    titulo: 'Volta a falar com os contactos que ficaram para trás · N5 Clara',
    descricao: 'A Clara separa a tua base por grupos e prepara a mensagem de cada um. Tu decides quando enviar e quem responde volta ao acompanhamento.',
    eyebrow: 'N5 Clara · A tua base',
    h1: 'Volta a falar com os contactos que ficaram para trás.',
    lead: 'Compradores que não compraram, proprietários que não angariaste, antigos clientes e leads que nunca responderam. A Clara separa a tua base por grupos e prepara uma mensagem para cada um, com o contexto da última conversa. Tu decides quando enviar.',
    cenas: [REATIVACAO],
    passos: [
      { titulo: 'A Clara prepara', texto: 'Separa os contactos pelo que aconteceu com cada um, deixa de fora quem pediu para não ser contactado e prepara uma mensagem por grupo, com o custo estimado dos envios na Meta.' },
      { titulo: 'Tu decides quando enviar', texto: 'Vês os grupos, as mensagens e o custo antes de enviar. Os envios saem escalonados.' },
      { titulo: 'As respostas voltam ao acompanhamento', texto: 'Quem responde entra outra vez na qualificação e no teu plano do dia.' },
    ],
    nota: { titulo: 'Clara Pro', texto: `A reativação da base faz parte da Clara Pro e da Clara Elite. Não é o mesmo que os lembretes de seguimento: um lembrete avisa-te de um contacto parado; a reativação prepara envios para grupos inteiros da tua base. ${OFERTA.planoSuperior('pro')} Os envios são pagos à Meta, com a estimativa à vista antes de cada um.` },
    reserva: { titulo: 'Volta a falar com a tua base.', texto: 'A reativação está na Clara Pro e na Clara Elite.' },
    plano: 'pro',
  },
  chamadas: {
    titulo: 'Análise e coaching das tuas chamadas · N5 Clara Elite',
    descricao: 'Com a Clara Elite ligas pela aplicação da Clara, com o teu número. Cada chamada fica transcrita e analisada, com o próximo passo.',
    eyebrow: 'N5 Clara Elite · Chamadas',
    h1: 'Quem te diz o que correu mal na chamada de ontem?',
    lead: 'Com a Clara Elite ligas pela aplicação da Clara, com o teu número. Cada chamada fica na ficha do cliente, transcrita e analisada, e todas as manhãs recebes o que correu bem, o que melhorar e a fila de chamadas do dia.',
    cenas: [
      cena('chamada', {
        titulo: 'Ligas pela aplicação da Clara. A Clara analisa a chamada e ajuda-te a preparar o próximo passo.',
        texto: 'Cada chamada fica na ficha do cliente, transcrita e analisada: o que correu bem, o que melhorar e a ação seguinte.',
        exemplo: 'Exemplo: cliente e chamada fictícios.',
      }),
      cena('relatorio', {
        passos: 2,
        titulo: 'O dia fecha. Sabes como correram as tuas chamadas.',
        texto: 'O coaching das chamadas, todos os dias, e a tua tendência ao longo da semana e do mês.',
        exemplo: 'Exemplo: números fictícios.',
        mensagens: [{ de: 'clara', texto: 'Bom trabalho hoje, Rui! 6 chamadas. Deixei-te o coaching do dia.', p: 1 }],
        cartoes: [{ tipo: 'nota', p: 2, numero: '4,2', texto: 'nota média do coaching de hoje, a subir face a ontem' }],
      }),
    ],
    passos: [
      { titulo: 'Ligas pela aplicação', texto: 'Antes de ligares, a Clara mostra-te o contexto e o objetivo da chamada. Ligas tu, pela aplicação da Clara, e o cliente vê o teu número.' },
      { titulo: 'Cada chamada analisada', texto: 'Abertura, descoberta, objeções e próximo passo. A transcrição e o resumo ficam na ficha do cliente.' },
      { titulo: 'Coaching todas as manhãs', texto: 'O que correu bem, o que melhorar, a fila de hoje e a tua tendência ao longo da semana e do mês.' },
    ],
    nota: { titulo: 'Clara Elite', texto: `As chamadas e o coaching fazem parte da Clara Elite, com 500 minutos de chamadas pela aplicação da Clara incluídos. ${OFERTA.planoSuperior('elite')}` },
    reserva: { titulo: 'Reserva a Clara Elite.', texto: 'Análise, transcrição e coaching das tuas chamadas.' },
    plano: 'elite',
  },
}

export const DIAGNOSTICO = {
  titulo: 'Diagnóstico de 2 minutos para consultores · N5 Clara',
  descricao: 'Responde a 10 perguntas e vê, com os teus números, quantos negócios te faltam para o teu objetivo e onde a Clara te ajuda primeiro.',
  eyebrow: 'N5 Clara · Diagnóstico',
  h1: '2 minutos para saber onde perdes tempo e negócios.',
  lead: 'Dez perguntas sobre como trabalhas hoje. No fim vês, com os teus números, quantos negócios te faltam para o teu objetivo e onde a Clara te ajuda primeiro. «Não sei» também conta.',
  reserva: { titulo: 'Põe a Clara a trabalhar no que o diagnóstico mostrou.', texto: 'As tuas respostas seguem com a reserva, para a sessão de configuração.' },
}

/* teste de arquétipos (/arquetipo/): fica fora de PAGINAS, como o diagnóstico; o h1 muda com o «?dor=» do anúncio
   (TITULOS em src/logica/arquetipo.js) */
export const ARQUETIPO = {
  titulo: 'Que tipo de consultor és? · N5 Clara',
  descricao: '8 perguntas sobre como trabalhas no dia a dia. Descobre que tipo de consultor és e onde estás a perder negócios.',
  eyebrow: 'N5 Clara · Teste para consultores',
  lead: '8 perguntas sobre como trabalhas no dia a dia. No fim, sabes que tipo de consultor és, onde estás a perder negócios e o plano da Clara que te serve.',
  reserva: { titulo: 'Reserva o plano que o teste te recomendou.', texto: 'As tuas respostas seguem com a reserva, para a sessão de configuração.' },
}
