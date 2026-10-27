/* pré-reserva de 27 € paga num Payment Link da Stripe: a Stripe mostra MB WAY, Multibanco,
   cartão, Apple Pay e Google Pay conforme os métodos ligados na conta. O site não guarda chaves.
   Enquanto o link não existir, o passo 3 diz que o link segue por email. */
export const LINK_PRE_RESERVA = 'https://buy.stripe.com/cNi8wRfFv4Cb1fN3DUgrS0a'

export const VALOR_PRE_RESERVA = '27 €'

export const METODOS = ['MB WAY', 'Multibanco', 'Cartão', 'Apple Pay', 'Google Pay']

/* só aceita links da Stripe, para o botão nunca levar a outro sítio */
export const linkValido = url => /^https:\/\/(buy|checkout)\.stripe\.com\/[\w/-]+$/.test(String(url || ''))
