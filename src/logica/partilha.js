/* Partilha do site da Clara no LinkedIn, no Facebook e no Instagram.
   As ligações levam utm_source=partilha, para as visitas que vêm de partilhas não se misturarem com as dos anúncios da Meta.
   O LinkedIn aceita o texto do post na ligação; o Facebook só aceita o endereço (o texto vai copiado); o Instagram não
   tem ligação de partilha na web: vai a imagem do post e a legenda copiada. */
export const SITE = 'https://clara.numerocinco.pt/'
export const DOMINIO = 'clara.numerocinco.pt'
export const IMAGEM_POST = '/partilha/clara-post.png'
export const REDES = [
  { id: 'linkedin', nome: 'LinkedIn' },
  { id: 'facebook', nome: 'Facebook' },
  { id: 'instagram', nome: 'Instagram' },
]

export const TEXTOS = {
  geral: 'Conheces a N5 Clara? É a assistente comercial dos consultores imobiliários: responde às tuas leads em minutos, organiza o teu dia e diz-te como fechar. Lança a 1 de dezembro e a lista de espera já está aberta.',
  inscrito: 'Inscrevi-me na N5 Clara, a assistente comercial dos consultores imobiliários: responde às leads em minutos, organiza o dia e diz como fechar. Lança a 1 de dezembro. Se te inscreveres, põe o meu email em «Quem te indicou».',
}

export const ligacao = rede => `${SITE}?utm_source=partilha&utm_medium=${rede}&utm_campaign=lancamento`

/* o texto que fica no post: no Instagram as ligações não abrem, por isso vai só o endereço */
export const post = (texto, rede) => `${texto}\n\n${rede === 'instagram' ? DOMINIO : ligacao(rede)}`

/* janela de partilha de cada rede; o Instagram não tem */
export function urlPartilha(rede, texto) {
  if (rede === 'linkedin') return `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(post(texto, rede))}`
  if (rede === 'facebook') return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(ligacao(rede))}`
  return null
}
