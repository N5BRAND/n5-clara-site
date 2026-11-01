/* o que muda de site para site nas páginas legais */
export const PRODUTO = {
  nome: 'N5 Clara',
  url: 'https://clara.numerocinco.pt',
  formulario: 'lista de espera',
  campos: ['nome', 'email', 'número de telemóvel', 'o plano que escolhes na página, se escolheres um', 'o código ou o nome do colega que te indicou, se vieres pela ligação dele ou o escreveres (opcional)', 'as prioridades que escolhes (opcional, no passo seguinte)', 'a página do site onde te inscreves e o anúncio que te trouxe', 'as respostas ao diagnóstico, se o fizeres (opcional)'],
  finalidades: [
    'gerir a lista de espera da N5 Clara;',
    'perceber que plano te interessa, para te mostrarmos o que faz sentido para ti;',
    'contar as indicações: o código ou o nome de quem te indicou serve só para somar a indicação a essa pessoa;',
    'perceber em que é que a Clara mais te ajudava, para te mostrarmos isso primeiro e decidirmos o que desenvolver primeiro;',
    'perceber que página e que anúncio te trouxeram, para sabermos que mensagens funcionam;',
    'usar as respostas ao diagnóstico, se o fizeres, para preparar contigo a configuração da tua Clara (as respostas de quem faz o diagnóstico sem se inscrever ficam guardadas sem nome nem contacto);',
    'reenviar-te a ligação do Passa a Clara, se a pedires com o email da inscrição;',
    'responder às tuas perguntas no assistente do site e, se deixares o nome e um contacto, guardar a conversa para a equipa te responder;',
    'contactar-te sobre o lançamento, previsto para 1 de dezembro de 2026.',
  ],
  /* a oferta tem de dizer o mesmo que OFERTA em src/logica/pagamento.js */
  reserva: { valor: '27 €', garante: 'uma das 25 vagas com as condições de lançamento, com entrada no primeiro dia (1 de dezembro de 2026), o primeiro mês pago, com a Clara Elite completa, 50% de desconto na primeira mensalidade da Clara Pro ou da Clara Elite para quem continuar num desses planos, o copiloto para o CRM da tua marca durante 3 meses desde a ativação (depois, continua incluído na Clara Elite; nos outros planos termina, sem cobrança nem mudança automática de plano), uma sessão de configuração com a nossa equipa e 2 formações incluídas para ti e para a tua equipa até 5 consultores' },
  oferta: 'A inscrição na N5 Clara é uma pré-reserva de 27 €, reembolsável após o dia do lançamento nas condições do ponto 4. Quem faz a pré-reserva antes de 1 de dezembro de 2026 tem o primeiro mês pago com a pré-reserva, com a Clara Elite completa. A partir do segundo mês, quem continuar na Clara Pro ou na Clara Elite tem 50% de desconto na primeira mensalidade desse plano; com esse desconto, a primeira mensalidade fica a 48,50 € na Clara Pro (97 € por mês) e a 73,50 € na Clara Elite (147 € por mês). A mensalidade do plano Clara é de 53 €. Os preços são por consultor. Inclui também o copiloto para o CRM da sua marca durante 3 meses desde a ativação, em qualquer plano (depois, continua incluído na Clara Elite; nos outros planos termina, sem cobrança nem mudança automática de plano), uma sessão de configuração com a equipa da Nº5 e 2 formações para o consultor e a sua equipa até 5 consultores. Nesta primeira fase, a pré-reserva está limitada a 25 vagas com as condições de lançamento, que entram a 1 de dezembro de 2026. Depois, abrimos 30 vagas por semana para quem deixou o contacto, pela ordem da lista. Não há período de fidelização: a subscrição pode ser cancelada a qualquer momento. O pagamento é feito na Stripe e recebido pela 4IMPROVEMENTS, LDA, que aparece no extrato.',
}
