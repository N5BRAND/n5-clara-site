import { motion, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { LogoChatGPT, LogoClaude, LogoGrokBot } from '../ilustracoes/LogosIA.jsx'
import { PRECOS } from '../logica/pagamento.js'

const MCP = { mcp: true, texto: 'Ideal para ligar ao teu ChatGPT, ao teu Claude e ao teu Grok Bot' }

/* textos dos pacotes como o Pedro os pediu a 06/11; o destaque passou da Elite para a Pro */
export const PLANOS = [
  {
    id: 'clara', nome: 'Clara', para: 'Para teres o dia organizado e nenhuma lead perdida.',
    inclui: [
      'Qualificação automática com o teu guião',
      'Plano do dia por prioridade',
      { texto: 'Registo e atualização de dados por voz no CRM', detalhe: 'As tuas notas de voz registam-se sozinhas na ficha do cliente, atualizam o pipeline, criam contactos e ajustam o calendário.' },
      'Checklist de documentos por imóvel',
    ],
    capacidade: 1,
  },
  {
    id: 'pro', nome: 'Clara Pro', para: 'Para quem investe em anúncios e quer tirar mais da base.', destaque: true, etiqueta: 'Recomendado',
    antes: 'Tudo da Clara, mais:',
    inclui: [MCP, 'Reativação de contactos parados', 'Procura de particulares a vender sem agência nas tuas freguesias', 'Marketing com IA: a Clara faz os criativos e os textos dos anúncios e lança as campanhas na Meta'],
    capacidade: 5,
  },
  {
    id: 'elite', nome: 'Clara Elite', para: 'Para quem vive ao telefone.', etiqueta: 'Com chamadas',
    antes: 'Tudo da Pro, mais:',
    inclui: [MCP, 'Chamadas pela aplicação da Clara, com o teu número', 'IA que analisa as tuas chamadas e te diz o que melhorar para fechares negócios mais depressa', 'Relatórios diário, semanal e mensal', 'Copiloto para o CRM da tua marca', '500 minutos de chamadas por mês incluídos'],
    capacidade: 15,
  },
]

/* capacidade de IA de cada plano em relação ao plano Clara; o plano base não tem barra.
   A barra é a tracejado e enche-se quando aparece no ecrã, depois de o cartão entrar */
const MAX_CAPACIDADE = 15
function Capacidade({ vezes, i }) {
  const ref = useRef(null)
  const visivel = useInView(ref, { once: true, amount: 0.8 })
  const reduzir = useReducedMotion()
  return (
    <div ref={ref} className="plano-capacidade">
      <span className="plano-capacidade-rotulo">Capacidade de IA</span>
      <b>{vezes === 1 ? 'A base de referência' : `${vezes} vezes a do plano Clara`}</b>
      {vezes > 1 && (
        <span className="plano-capacidade-barra" aria-hidden="true">
          <motion.span
            style={{ width: `${(vezes / MAX_CAPACIDADE) * 100}%` }}
            initial={reduzir ? false : { clipPath: 'inset(0 100% 0 0)' }}
            animate={visivel || reduzir ? { clipPath: 'inset(0 0% 0 0)' } : undefined}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.35 + i * 0.12 }}
          />
        </span>
      )}
    </div>
  )
}

/* com o rato dentro do cartão, um rasto percorre a borda no sentido do relógio;
   só em computadores com rato e sem «reduzir movimento» */
function useRasto() {
  const ref = useRef(null)
  useEffect(() => {
    const cartao = ref.current
    if (!cartao) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let angulo = 0, anterior = 0, pedido = 0
    const passo = agora => {
      angulo = (angulo + (anterior ? agora - anterior : 16) * 0.11) % 360
      anterior = agora
      cartao.style.setProperty('--angulo', `${angulo}deg`)
      pedido = requestAnimationFrame(passo)
    }
    const entrar = () => {
      cartao.classList.add('plano--rasto')
      anterior = 0
      cancelAnimationFrame(pedido)
      pedido = requestAnimationFrame(passo)
    }
    const sair = () => {
      cartao.classList.remove('plano--rasto')
      cancelAnimationFrame(pedido)
    }
    cartao.addEventListener('pointerenter', entrar)
    cartao.addEventListener('pointerleave', sair)
    return () => {
      sair()
      cartao.removeEventListener('pointerenter', entrar)
      cartao.removeEventListener('pointerleave', sair)
    }
  }, [])
  return ref
}

/* escolher um plano preenche o formulário da lista de espera e leva até lá */
const escolher = id => {
  window.dispatchEvent(new CustomEvent('escolher-plano', { detail: id }))
  document.getElementById('lista')?.scrollIntoView({ behavior: 'smooth' })
}

function Plano({ p, i }) {
  const ref = useRasto()
  return (
    <motion.article
      ref={ref}
      className={`cartao plano ${p.destaque ? 'plano--destaque' : ''}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 140, damping: 20, delay: i * 0.12 }}
    >
      <span className="plano-rasto" aria-hidden="true"><span /></span>
      {p.etiqueta && <span className="etiqueta plano-etiqueta">{p.etiqueta}</span>}
      <h3>{p.nome}</h3>
      {PRECOS[p.id].mensal
        ? <p className="plano-preco"><b>{PRECOS[p.id].mensal}</b><span>/mês</span></p>
        : <p className="plano-preco plano-preco--por-anunciar"><span>Preço ainda por anunciar</span></p>}
      <p className="plano-para">{p.para}</p>
      {p.antes && <span className="plano-antes">{p.antes}</span>}
      <ul>
        {p.inclui.map(item => item.mcp ? (
          <li key="mcp" className="plano-mcp">
            <span className="plano-mcp-logos"><LogoChatGPT /><LogoClaude /><LogoGrokBot /></span>
            {item.texto}
          </li>
        ) : item.detalhe ? (
          <li key={item.texto}>
            <span>{item.texto}<small className="plano-detalhe">{item.detalhe}</small></span>
          </li>
        ) : <li key={item}>{item}</li>)}
      </ul>
      <Capacidade vezes={p.capacidade} i={i} />
      <button type="button" className={`botao ${p.destaque ? '' : 'botao--linha'} plano-botao`} onClick={() => escolher(p.id)}>
        Reservar a {p.nome}
      </button>
    </motion.article>
  )
}

export default function Planos() {
  return (
    <section id="planos" className="seccao planos">
      <div className="contentor">
        <div className="seccao-cabeca">
          <p className="eyebrow">Planos</p>
          <h2>Três planos. Escolhe o que se parece contigo.</h2>
          <p>Preços por consultor. Sem fidelização: cancelas quando quiseres. Com a pré-reserva, o 1.º mês é a Clara Elite completa.</p>
        </div>
        <div className="planos-grelha">
          {PLANOS.map((p, i) => <Plano key={p.id} p={p} i={i} />)}
        </div>
      </div>
    </section>
  )
}
