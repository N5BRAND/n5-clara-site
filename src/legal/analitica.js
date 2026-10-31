import { lerConsentimento } from './consentimento.js'
import { quandoVisivel, SEGUNDOS_VISUALIZACAO } from './tempoVisivel.js'
import { criarCronometro } from './cronometro.js'
import { emTeste } from './teste.js'

/* PostHog (nuvem da UE): como as pessoas usam a página da Clara, para afinar a mensagem.
   - Com a estatística aceite: cliques, scroll, secções vistas, passos do formulário, mapas de calor e gravações das
     sessões, com todos os campos escritos escondidos.
   - Com a estatística rejeitada: só contagem anónima, sem cookies nem nada guardado no navegador (cookieless on_reject).
   - Sem escolha feita: não sai nenhum evento; os nossos ficam à espera e saem quando a pessoa escolher.
   O PostHog só se carrega depois da página, para não atrasar quem chega pelo anúncio.
   Só liga no domínio real, para os testes e o desenvolvimento não entrarem nos números. */
const TOKEN = import.meta.env.VITE_POSTHOG_KEY
const HOST = import.meta.env.VITE_POSTHOG_HOST
const DOMINIOS = ['clara.numerocinco.pt']

let ligado = false
let ph = null
let escolha = null
const fila = []

function aplicar() {
  if (!ph || !escolha) return
  if (escolha.estatistica) ph.opt_in_capturing()
  else ph.opt_out_capturing()
  for (const [nome, propriedades, opcoes] of fila.splice(0)) ph.capture(nome, propriedades, opcoes)
}

/* evento próprio; fora do domínio real não sai nada */
export function marcar(nome, propriedades = {}, opcoes) {
  if (!ligado) return
  if (ph && escolha) ph.capture(nome, propriedades, opcoes)
  else fila.push([nome, propriedades, opcoes])
}

/* cada secção conta uma vez, quando atravessa o meio do ecrã; o cronómetro soma o tempo em cada uma */
function observarSeccoes(cronometro) {
  if (!('IntersectionObserver' in window)) return
  const vistas = new Set()
  const obs = new IntersectionObserver(entradas => {
    for (const e of entradas) {
      const seccao = e.target.dataset.seccao || e.target.id
      if (e.isIntersecting) cronometro?.entrou(seccao, Date.now())
      else cronometro?.saiu(seccao, Date.now())
      if (e.isIntersecting && !vistas.has(seccao)) {
        vistas.add(seccao)
        marcar('seccao_vista', { seccao, ordem: vistas.size })
      }
    }
  }, { rootMargin: '-45% 0px -45% 0px' })
  const ligar = () => document.querySelectorAll('section[id], section[data-seccao]').forEach(s => obs.observe(s))
  if (document.readyState === 'complete') setTimeout(ligar, 500)
  else window.addEventListener('load', () => setTimeout(ligar, 500), { once: true })
}

/* em todas as páginas (a principal e as landing pages): quanto tempo a visita fica à vista, em cada secção, e onde
   estava quando saiu. Sai um resumo cada vez que o separador fica escondido ou a página fecha; conta o último de cada
   visita. O N5 Controlo mostra-o por página. */
function cronometrarVisita() {
  const cronometro = criarCronometro(Date.now(), document.visibilityState === 'visible')
  const vista = window.crypto?.randomUUID?.() || Math.random().toString(36).slice(2)
  let envio = 0
  const enviar = () => marcar('tempo_pagina', { vista, envio: ++envio, ...cronometro.resumo(Date.now()) }, { transport: 'sendBeacon' })
  document.addEventListener('visibilitychange', () => {
    const visivel = document.visibilityState === 'visible'
    cronometro.visibilidade(visivel, Date.now())
    if (!visivel) enviar()
  })
  window.addEventListener('pagehide', enviar)
  return cronometro
}

function carregar() {
  import('posthog-js')
    .then(({ default: posthog }) => {
      posthog.init(TOKEN, {
        api_host: HOST,
        defaults: '2026-08-30',
        cookieless_mode: 'on_reject',
        person_profiles: 'identified_only',
        capture_pageleave: true,
        session_recording: { maskAllInputs: true },
      })
      ph = posthog
      aplicar()
    })
    .catch(() => { /* sem PostHog a página continua igual */ })
}

export function iniciarAnalitica() {
  /* em modo de teste não entra nos números (ver teste.js) */
  if (ligado || !TOKEN || !HOST || !DOMINIOS.includes(window.location.hostname) || emTeste()) return
  ligado = true
  try { escolha = lerConsentimento(window.localStorage) } catch { /* sem armazenamento: fica sem escolha */ }
  window.addEventListener('consentimento-mudou', e => { escolha = e.detail; aplicar() })
  marcar('pagina_aberta')
  quandoVisivel(SEGUNDOS_VISUALIZACAO, segundos => marcar('visualizacao_qualificada', { segundos }))
  observarSeccoes(cronometrarVisita())
  if (document.readyState === 'complete') carregar()
  else window.addEventListener('load', carregar, { once: true })
}
