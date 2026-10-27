import { motion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { LogoChatGPT, LogoClaude } from '../ilustracoes/LogosIA.jsx'

const MCP = { mcp: true, texto: 'MCP com o ChatGPT e o Claude' }

const PLANOS = [
  {
    id: 'clara', nome: 'Clara', para: 'Para teres o dia organizado e nenhuma lead perdida.',
    inclui: ['Qualificação automática com o teu guião', 'Plano do dia por prioridade', 'Notas de voz que se registam sozinhas', 'Checklist de documentos por imóvel'],
    capacidade: 1,
  },
  {
    id: 'pro', nome: 'Clara Pro', para: 'Para quem investe em anúncios e quer tirar mais da base.',
    antes: 'Tudo da Clara, mais:',
    inclui: [MCP, 'Reativação de contactos parados', 'Reativação trimestral de toda a tua base', 'Marketing com IA: a Clara ajuda-te a criar as campanhas e lanças tudo pela própria plataforma'],
    capacidade: 5,
  },
  {
    id: 'elite', nome: 'Clara Elite', para: 'Para quem vive ao telefone.', destaque: true,
    antes: 'Tudo do Pro, mais:',
    inclui: [MCP, 'Chamadas pela Clara com o teu número', 'Gravação e transcrição na ficha do cliente', 'Coaching diário das chamadas', 'Relatórios diário, semanal e mensal', 'Copiloto para o CRM da tua marca', '500 minutos de chamadas incluídos'],
    capacidade: 15,
  },
]

/* capacidade de IA de cada plano em relação ao plano Clara; o plano base não tem barra */
const MAX_CAPACIDADE = 15
function Capacidade({ vezes }) {
  return (
    <div className="plano-capacidade">
      <span className="plano-capacidade-rotulo">Capacidade de IA</span>
      <b>{vezes === 1 ? 'A base de referência' : `${vezes} vezes a do plano Clara`}</b>
      {vezes > 1 && <span className="plano-capacidade-barra" aria-hidden="true"><span style={{ width: `${(vezes / MAX_CAPACIDADE) * 100}%` }} /></span>}
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
      {p.destaque && <span className="etiqueta plano-etiqueta">Com chamadas</span>}
      <h3>{p.nome}</h3>
      <p className="plano-para">{p.para}</p>
      {p.antes && <span className="plano-antes">{p.antes}</span>}
      <ul>
        {p.inclui.map(item => item.mcp ? (
          <li key="mcp" className="plano-mcp">
            <span className="plano-mcp-logos"><LogoChatGPT /><LogoClaude /></span>
            {item.texto}
          </li>
        ) : <li key={item}>{item}</li>)}
      </ul>
      <Capacidade vezes={p.capacidade} />
      <button type="button" className={`botao ${p.destaque ? '' : 'botao--linha'} plano-botao`} onClick={() => escolher(p.id)}>
        Quero a {p.nome}
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
        </div>
        <div className="planos-grelha">
          {PLANOS.map((p, i) => <Plano key={p.id} p={p} i={i} />)}
        </div>
      </div>
    </section>
  )
}
