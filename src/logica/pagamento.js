/* pré-reserva de 27 € paga num Payment Link da Stripe: a Stripe mostra MB WAY, Multibanco,
   cartão, Apple Pay e Google Pay conforme os métodos ligados na conta. O site não guarda chaves.
   Enquanto o link não existir, o passo 3 diz que o link segue por email. */
export const LINK_PRE_RESERVA = 'https://buy.stripe.com/cNi8wRfFv4Cb1fN3DUgrS0a'

export const VALOR_PRE_RESERVA = '27 €'

/* valor em número, para os eventos do píxel */
export const VALOR_EUROS = parseFloat(VALOR_PRE_RESERVA)

/* a pré-reserva tem IVA à parte (Pedro, 31/10); o valor do píxel continua a ser o da pré-reserva sem IVA */
export const PRE_RESERVA = `${VALOR_PRE_RESERVA} + IVA`

/* o total cobrado, com IVA à taxa normal (23%): mostra-se antes de pagar. O Payment Link da Stripe tem de cobrar isto */
export const IVA = 0.23
export const TOTAL_PRE_RESERVA = `${(VALOR_EUROS * (1 + IVA)).toFixed(2).replace('.', ',')} €`

/* oferta da pré-reserva: a frase curta e o que se paga mês a mês. Tudo o que o site diz da oferta sai daqui.
   Pedro, 31/10: «a pré-reserva é 27 € e paga o teu primeiro mês; sem fidelização»; o 1.º mês é a Clara Elite completa
   e quem continua na Pro ou na Elite tem 50% na primeira mensalidade desse plano. O plano Clara fica a 53 €/mês.
   (À espera de confirmação: o texto colado a 31/10 diz 50% só no plano Clara.) */
export const OFERTA = {
  resumo: 'paga o teu primeiro mês, com a Clara Elite completa',
  meses: [
    { quando: 'Agora', valor: PRE_RESERVA, texto: 'a pré-reserva' },
    { quando: '1.º mês', valor: 'Pago', texto: 'com a pré-reserva, com a Clara Elite completa', destaque: true },
    { quando: '2.º mês', valor: '−50%', texto: 'na primeira mensalidade da Pro ou da Elite, se continuares' },
    { quando: 'Sempre', valor: 'Sem fidelização', texto: 'cancelas quando quiseres' },
  ],
  nota: 'Preferes o plano Clara? A partir do 2.º mês pagas 53 € por mês.',
  /* para as páginas e resultados da Pro e da Elite */
  planoSuperior: plano => `Com a pré-reserva, o teu 1.º mês é a Clara Elite completa; se continuares na ${plano}, tens 50% de desconto na primeira mensalidade.`,
}

export const METODOS = ['MB WAY', 'Multibanco', 'Cartão', 'Apple Pay', 'Google Pay']

/* só aceita links da Stripe, para o botão nunca levar a outro sítio */
export const linkValido = url => /^https:\/\/(buy|checkout)\.stripe\.com\/[\w/-]+$/.test(String(url || ''))

/* quando as 25 licenças esgotam, o site deixa de levar ao pagamento. Liga-se com VITE_ESGOTADO=1 nas variáveis
   da Netlify e volta-se a publicar; desligado, o site fica como está */
export const ESGOTADO = import.meta.env.VITE_ESGOTADO === '1'

/* botão principal das páginas com reserva */
export const CTA = ESGOTADO ? 'Entrar na lista de espera' : `Reservar a minha Clara por ${PRE_RESERVA}`
