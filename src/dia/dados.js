/* um dia do Rui com a Clara: cada cena é uma conversa no telemóvel (mensagens) e o que a Clara fez (cartões).
   «p» é o passo do scroll em que cada peça aparece. */

export const CENAS = [
  {
    id: 'plano',
    hora: '08:00',
    curto: 'Plano do dia',
    passos: 4,
    eyebrow: '08:00 · Plano do dia',
    titulo: 'Bom dia. O teu dia já está organizado.',
    texto: 'Antes do primeiro café sabes o que fazer e por que ordem: visitas, leads a seguir, documentos em falta e compradores novos.',
    canal: { nome: 'Clara', sub: 'a tua assistente' },
    mensagens: [
      { de: 'rui', texto: 'Bom dia, Clara. O que tenho hoje?', p: 1 },
      { de: 'clara', texto: 'Bom dia, Rui! Tens 2 visitas, 3 leads para seguir e falta a certidão do T2 da Penha. Organizei tudo por prioridade.', p: 2 },
    ],
    cartoes: [
      {
        tipo: 'plano', p: 2, titulo: 'Plano de hoje',
        itens: [
          { h: '10:00', t: 'Visita ao T3 de Benfica com a Marta' },
          { h: '11:30', t: 'Ligar à Marta antes da visita de sábado' },
          { h: '14:30', t: 'Visita ao T2 de Alvalade' },
          { h: 'Hoje', t: 'Pedir a certidão do T2 da Penha' },
        ],
      },
      { tipo: 'alerta', p: 3, texto: 'A Ana pediu a ficha do T3 ontem e ainda não respondeste.' },
      { tipo: 'numero', p: 4, numero: '6', texto: 'chamadas na tua fila de hoje, por ordem de prioridade' },
    ],
  },
  {
    id: 'lead',
    hora: '09:10',
    curto: 'Lead nova',
    passos: 4,
    eyebrow: '09:10 · Lead nova',
    titulo: 'Entra uma lead. A Clara responde em minutos.',
    texto: 'Uma lead da tua campanha na Meta chega ao WhatsApp. A Clara reconhece o tipo de lead, segue o teu guião e qualifica sozinha.',
    canal: { nome: 'Marta Silva', sub: 'WhatsApp · lead' },
    mensagens: [
      { de: 'outro', texto: 'Olá! Vi o anúncio do T3 em Benfica. Ainda está disponível?', p: 1 },
      { de: 'clara', texto: 'Olá Marta! Está sim. É para habitação própria? E já tem o crédito encaminhado?', p: 2 },
      { de: 'outro', texto: 'É para nós e para os miúdos. O banco já fez a simulação.', p: 3 },
    ],
    cartoes: [
      { tipo: 'origem', p: 1, texto: 'Campanha Meta · Compradores Lisboa' },
      { tipo: 'numero', p: 2, numero: '3 min', texto: 'até à primeira resposta, a qualquer hora' },
      {
        tipo: 'resumo', p: 4, titulo: 'Lead qualificada',
        chips: ['Compradora', 'T3', 'Até 380 mil €', 'Crédito simulado'],
        nota: 'Passou para Qualificado e entrou no teu plano do dia.',
      },
    ],
  },
  {
    id: 'chamada',
    hora: '11:30',
    curto: 'Chamada',
    passos: 5,
    eyebrow: '11:30 · Chamada',
    titulo: 'Ligas a partir da ficha. A Clara ouve e diz-te como fechar.',
    texto: 'Cada chamada fica na ficha do cliente, transcrita e analisada. No fim sabes o que correu bem, o que melhorar e o próximo passo.',
    canal: { nome: 'Clara', sub: 'a tua assistente' },
    mensagens: [
      { de: 'clara', texto: 'Antes de ligares à Marta: quer mudar-se até julho e o banco já simulou. Objetivo da chamada: marcar visita.', p: 1 },
      { de: 'clara', texto: 'Boa chamada! Perguntaste pelo prazo logo no início. Da próxima vez, propõe a data da visita antes de falares de preço.', p: 4 },
    ],
    cartoes: [
      { tipo: 'chamada', p: 2, com: 'Marta Silva', duracao: '6:42' },
      {
        tipo: 'coaching', p: 3, nota: '4,2',
        bem: ['Descobriste o prazo da mudança', 'Confirmaste o crédito'],
        mal: ['Falaste de preço cedo demais'],
      },
      { tipo: 'feito', p: 5, texto: 'Visita marcada: sábado às 11h, já no teu calendário.' },
    ],
  },
  {
    id: 'voz',
    hora: '14:45',
    curto: 'Nota de voz',
    passos: 4,
    eyebrow: '14:45 · Na rua',
    titulo: 'Sais da visita. Falas, a Clara regista.',
    texto: 'Sem formulários nem CRM: gravas uma nota de voz e a Clara transcreve, guarda o feedback e trata do resto.',
    canal: { nome: 'Clara', sub: 'a tua assistente' },
    mensagens: [
      { de: 'rui', voz: '0:18', texto: 'A Marta adorou a cozinha mas achou o segundo quarto pequeno. Quer voltar no sábado com o marido. E já falei com o crédito.', p: 1 },
      { de: 'clara', texto: 'Registado! Feedback na ficha da Marta, segunda visita no sábado e marquei o passo «falou com o crédito».', p: 3 },
    ],
    cartoes: [
      { tipo: 'pessoa', p: 1 },
      { tipo: 'registos', p: 2, itens: ['Feedback da visita guardado na ficha', 'Segunda visita: sábado, 11h', 'Passo do processo: falou com o crédito'] },
      { tipo: 'feito', p: 4, texto: 'Também registado no CRM da tua marca, pelo copiloto.' },
    ],
  },
  {
    id: 'angariacao',
    hora: '16:20',
    curto: 'Angariação',
    passos: 4,
    eyebrow: '16:20 · Angariação',
    titulo: 'Angariaste um imóvel. Os documentos já foram pedidos.',
    texto: 'A Clara abre a checklist do imóvel, pede ao proprietário pelo WhatsApp e procura na tua carteira quem o pode comprar.',
    canal: { nome: 'Sr. António', sub: 'WhatsApp · proprietário' },
    mensagens: [
      { de: 'clara', texto: 'Olá Sr. António! Para pormos o T2 da Penha à venda faltam a certidão permanente e o certificado energético. Pode enviá-los por aqui?', p: 2 },
      { de: 'outro', ficheiro: true, texto: 'certidao-permanente.pdf', p: 3 },
    ],
    cartoes: [
      {
        tipo: 'checklist', p: 1, titulo: 'T2 da Penha · documentos',
        itens: [
          { doc: 'Caderneta predial', ok: 1 },
          { doc: 'Licença de utilização', ok: 1 },
          { doc: 'Certidão permanente', ok: 3 },
          { doc: 'Certificado energético', ok: 0 },
        ],
      },
      { tipo: 'match', p: 4, titulo: '3 compradores da tua carteira encaixam', chips: ['Zona', 'Tipologia', 'Orçamento'], nomes: ['AR', 'JM', 'CS'] },
    ],
  },
  {
    id: 'relatorio',
    hora: '19:00',
    curto: 'Fim do dia',
    passos: 4,
    eyebrow: '19:00 · Fim do dia',
    titulo: 'O dia fecha. Sabes como correu e quanto vais vender.',
    texto: 'Previsão de vendas, onde perdes tempo e o coaching das chamadas, todos os dias. E o Antes e Depois aos 30 e aos 90 dias.',
    canal: { nome: 'Clara', sub: 'a tua assistente' },
    mensagens: [
      { de: 'clara', texto: 'Bom trabalho hoje, Rui! 2 visitas, 1 angariação e 6 chamadas. Deixei-te o resumo do dia.', p: 1 },
    ],
    cartoes: [
      { tipo: 'numero', p: 2, numero: '2', texto: 'escrituras previstas para este mês, pelo teu histórico' },
      { tipo: 'tempo', p: 3, texto: 'Demoras em média 9 dias a pedir documentos depois de angariar.', sugestao: 'Pede-os no próprio dia: a mensagem já está preparada.' },
      { tipo: 'nota', p: 4, numero: '4,2', texto: 'nota média do coaching de hoje, a subir face a ontem' },
    ],
  },
]
