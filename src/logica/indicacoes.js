/* Programa «Passa a Clara»: cada inscrito recebe um código de 6 letras e uma ligação pessoal (?ref=CÓDIGO).
   Quem chega por essa ligação fica com o código guardado no navegador; o formulário leva-o em «Quem te indicou»
   e a pré-reserva leva-o para a Stripe (client_reference_id). Contam as pré-reservas pagas com o código.
   Não há dados pessoais nas ligações: só o código. */
import { SITE } from './partilha.js'

export const PROGRAMA = {
  nome: 'Passa a Clara',
  pagina: '/passa-a-clara/',
  vencedores: 10,
  premio: '3 meses do plano Clara grátis',
  fim: '30 de novembro',
  anuncio: '1 de dezembro',
}

const ALFABETO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // sem I, O, 0 e 1, para não se confundirem
const FORMATO = /^[A-HJ-NP-Z2-9]{6}$/
const MEU = 'n5-passa-codigo'
const REF = 'n5-passa-ref'
const VALIDADE_REF = 30 * 24 * 3600 * 1000

export const normalizarCodigo = c => String(c ?? '').trim().toUpperCase()
export const codigoValido = c => FORMATO.test(normalizarCodigo(c))

/* 32 letras: cada byte aleatório dá uma letra sem enviesamento (256 é múltiplo de 32) */
export function novoCodigo(aleatorio = n => crypto.getRandomValues(new Uint8Array(n))) {
  return Array.from(aleatorio(6), b => ALFABETO[b % 32]).join('')
}

const ler = (arm, chave) => { try { return arm?.getItem(chave) ?? null } catch { return null } }
const escrever = (arm, chave, valor) => { try { arm?.setItem(chave, valor); return true } catch { return false } }

export function meuCodigo(arm) {
  const c = ler(arm, MEU)
  return codigoValido(c) ? normalizarCodigo(c) : null
}
export const guardarMeuCodigo = (arm, c) => codigoValido(c) && escrever(arm, MEU, normalizarCodigo(c))

/* o código de quem indicou esta pessoa, se tiver chegado há menos de 30 dias */
export function lerRef(arm, agora) {
  try {
    const r = JSON.parse(ler(arm, REF) || 'null')
    return r && codigoValido(r.codigo) && agora - r.em < VALIDADE_REF ? r.codigo : null
  } catch { return null }
}
export function guardarRef(arm, c, agora) {
  const codigo = normalizarCodigo(c)
  if (!codigoValido(codigo) || codigo === meuCodigo(arm)) return false
  return escrever(arm, REF, JSON.stringify({ codigo, em: agora }))
}

/* lê ?ref= da morada; a última ligação aberta é a que conta */
export function capturarRef(pesquisa, arm, agora) {
  const c = new URLSearchParams(pesquisa).get('ref')
  return c && guardarRef(arm, c, agora) ? normalizarCodigo(c) : null
}

/* ligação pessoal; com rede, leva também a origem da partilha */
export function ligacaoPessoal(codigo, rede) {
  const u = new URL(SITE)
  if (rede) {
    u.searchParams.set('utm_source', 'partilha')
    u.searchParams.set('utm_medium', rede)
    u.searchParams.set('utm_campaign', 'passa-a-clara')
  }
  if (codigoValido(codigo)) u.searchParams.set('ref', normalizarCodigo(codigo))
  return u.toString()
}

/* o Payment Link da Stripe guarda o código em client_reference_id */
export function linkPagamento(base, ref) {
  if (!codigoValido(ref)) return base
  const u = new URL(base)
  u.searchParams.set('client_reference_id', normalizarCodigo(ref))
  return u.toString()
}

/* ao abrir qualquer página: guarda o código de quem indicou e marca a chegada (sem o código) */
export function iniciarIndicacoes(marcar) {
  try {
    if (capturarRef(window.location.search, window.localStorage, Date.now())) marcar?.('indicacao_chegou')
  } catch { /* sem armazenamento: a indicação só conta pelo código escrito no formulário */ }
}
