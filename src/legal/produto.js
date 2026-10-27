/* o que muda de site para site nas páginas legais */
export const PRODUTO = {
  nome: 'N5 Clara',
  url: 'https://n5-clara.netlify.app',
  formulario: 'lista de espera',
  campos: ['nome', 'email', 'telefone (opcional)', 'agência ou rede onde trabalhas', 'plano que te interessa', 'email do colega que te indicou (opcional)', 'as prioridades que escolhes (opcional, no passo seguinte)'],
  finalidades: [
    'gerir a lista de espera da N5 Clara;',
    'perceber que plano te interessa, para te mostrarmos o que faz sentido para ti;',
    'contar as indicações: o email de quem te indicou serve só para somar a indicação a essa pessoa;',
    'perceber em que é que a Clara mais te ajudava, para te mostrarmos isso primeiro e decidirmos o que desenvolver primeiro;',
    'contactar-te sobre o lançamento, previsto para 1 de dezembro de 2026.',
  ],
  reserva: { valor: '27 €', garante: 'um lugar na ordem de entrada: abrimos 30 vagas por semana a partir de 1 de dezembro de 2026, pela ordem do pagamento' },
  oferta: 'A inscrição na N5 Clara é uma pré-reserva de 27 €, descontada na primeira mensalidade e reembolsável após o dia do lançamento nas condições do ponto 4. A partir de 1 de dezembro de 2026 abrimos 30 vagas por semana: primeiro para quem fez a pré-reserva, pela ordem do pagamento, e depois para quem deixou só o contacto, pela ordem da lista. O valor anunciado para o lançamento é de 53 € por mês. Quem indicar 3 colegas que se inscrevam passa à frente na ordem de entrada e tem uma sessão de configuração individual. O pagamento é feito na Stripe e recebido pela 4IMPROVEMENTS, LDA, que aparece no extrato.',
}
