/* desde 27/11/2026 a marca Nº5 é das duas empresas: os registos ficam em nome da marca, com um só contacto. Como a lei
   pede quem responde pelos dados e pelo site, as duas aparecem como responsáveis conjuntas (artigo 26.º do RGPD) */
export const MARCA = {
  nome: 'Nº5',
  email: 'pedro.ferreira@numerocinco.pt',
  atualizado: '27 de novembro de 2026',
}

export const EMPRESAS = [
  { nome: 'Os Caetanos, Lda', nif: '504428918', sede: 'Rua Manuel Ferreira n.º 19C, 2795-229 Linda-a-Velha' },
  { nome: '4Improvements, Lda', nif: '518826015', sede: 'Av. Mouzinho de Albuquerque, n.º 48, 11.º B, 1170-265 Lisboa' },
]

/* «Os Caetanos, Lda e 4Improvements, Lda» */
export const NOMES_EMPRESAS = EMPRESAS.map(e => e.nome).join(' e ')
