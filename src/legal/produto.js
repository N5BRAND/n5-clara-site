/* o que muda de site para site nas páginas legais */
export const PRODUTO = {
  nome: 'N5 Clara',
  url: 'https://clara.numerocinco.pt',
  formulario: 'lista de espera',
  campos: ['nome', 'email', 'telefone (opcional)', 'agência ou rede onde trabalhas', 'plano que te interessa', 'email do colega que te indicou (opcional)', 'as prioridades que escolhes (opcional, no passo seguinte)', 'a página do site onde te inscreves e o anúncio que te trouxe', 'as respostas ao diagnóstico, se o fizeres (opcional)'],
  finalidades: [
    'gerir a lista de espera da N5 Clara;',
    'perceber que plano te interessa, para te mostrarmos o que faz sentido para ti;',
    'contar as indicações: o email de quem te indicou serve só para somar a indicação a essa pessoa;',
    'perceber em que é que a Clara mais te ajudava, para te mostrarmos isso primeiro e decidirmos o que desenvolver primeiro;',
    'perceber que página e que anúncio te trouxeram, para sabermos que mensagens funcionam;',
    'usar as respostas ao diagnóstico, se o fizeres, para preparar contigo a configuração da tua Clara (as respostas de quem faz o diagnóstico sem se inscrever ficam guardadas sem nome nem contacto);',
    'contactar-te sobre o lançamento, previsto para 1 de dezembro de 2026.',
  ],
  /* a oferta tem de dizer o mesmo que OFERTA em src/logica/pagamento.js */
  reserva: { valor: '27 €', garante: 'uma das 25 vagas com as condições de lançamento, com entrada no primeiro dia (1 de dezembro de 2026), o primeiro mês pago, com a Clara Elite completa, 50% de desconto na primeira mensalidade da Clara Pro ou da Clara Elite para quem continuar num desses planos, o copiloto para o CRM da tua marca, uma sessão de configuração com a nossa equipa e 2 formações incluídas para ti e para a tua equipa até 5 consultores' },
  oferta: 'A inscrição na N5 Clara é uma pré-reserva de 27 €, reembolsável após o dia do lançamento nas condições do ponto 4. Quem faz a pré-reserva antes de 1 de dezembro de 2026 tem o primeiro mês pago com a pré-reserva, com a Clara Elite completa. A partir do segundo mês, quem continuar na Clara Pro ou na Clara Elite tem 50% de desconto na primeira mensalidade desse plano; a mensalidade do plano Clara é de 53 €. Os preços da Clara Pro e da Clara Elite são anunciados no lançamento. Inclui também o copiloto para o CRM da sua marca, uma sessão de configuração com a equipa da Nº5 e 2 formações para o consultor e a sua equipa até 5 consultores. Nesta primeira fase, a pré-reserva está limitada a 25 vagas com as condições de lançamento, que entram a 1 de dezembro de 2026. Depois, abrimos 30 vagas por semana para quem deixou o contacto, pela ordem da lista. Não há período de fidelização: a subscrição pode ser cancelada a qualquer momento. O pagamento é feito na Stripe e recebido pela 4IMPROVEMENTS, LDA, que aparece no extrato.',
}
