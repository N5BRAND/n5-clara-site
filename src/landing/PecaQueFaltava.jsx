import { motion, useInView, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import { ClaraAvatar } from '../ilustracoes/Clara.jsx'
import { LogoChatGPT, LogoClaude, LogoGrokBot } from '../ilustracoes/LogosIA.jsx'

const COLADO = ['Conversa do WhatsApp', 'Dados do imóvel', 'Notas da visita']
const LIGACOES = ['WhatsApp e Meta', 'Google Calendar', 'O teu telefone', 'CRM da tua marca']
const ASSISTENTES = [['ChatGPT', LogoChatGPT], ['Claude', LogoClaude], ['Grok Bot', LogoGrokBot]]

/* um cartão por nota: com duas notas ficam o ChatGPT e o Claude, com três entra o Grok Bot */
function Assistentes({ notas }) {
  return (
    <div className="pecas-topo">
      {notas.map((nota, i) => {
        const [nome, Logo] = ASSISTENTES[i]
        return <div key={nome} className="pecas-assistente"><Logo tamanho={26} /><b>{nome}</b><span>{nota}</span></div>
      })}
    </div>
  )
}

/* página /ia/: hoje o consultor faz de ligação entre o ChatGPT e o Claude; com a Clara, eles e o Grok Bot ligam-se a ela */
export default function PecaQueFaltava({ eyebrow, titulo, texto }) {
  const ref = useRef(null)
  const visivel = useInView(ref, { amount: 0.35 })
  const reduzir = useReducedMotion()
  const mexer = visivel && !reduzir

  return (
    <section data-seccao="pecas" ref={ref} className="seccao pecas">
      <div className="contentor">
        <div className="seccao-cabeca">
          <p className="eyebrow">{eyebrow}</p>
          <h2>{titulo}</h2>
          <p>{texto}</p>
        </div>

        <div className="pecas-grelha" aria-hidden="true">
          <div className="pecas-painel">
            <p className="eyebrow">Hoje</p>
            <Assistentes notas={['Sabe o que lhe colaste hoje', 'Sabe o que lhe explicaste ontem']} />
            <div className="pecas-fios"><i /><i /></div>
            <div className="pecas-meio">
              <span className="avatar avatar--escuro pecas-tu">Tu</span>
              <div className="chips">
                {COLADO.map((c, i) => (
                  <motion.span key={c} className="chip pecas-colado" animate={mexer ? { y: [0, -6, 0] } : { y: 0 }}
                    transition={mexer ? { duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: 'easeInOut' } : { duration: 0 }}>{c}</motion.span>
                ))}
              </div>
            </div>
            <p className="pecas-legenda">Colas, explicas e voltas a colar. Cada um fica só com a sua parte.</p>
          </div>

          <div className="pecas-painel pecas-painel--clara">
            <p className="eyebrow">Com a Clara</p>
            <Assistentes notas={['Vê o que a Clara sabe', 'Vê o mesmo', 'Vê o mesmo']} />
            <div className="pecas-fios">
              {[0, 1, 2].map(i => (
                <motion.i key={i} initial={{ scaleY: 0 }} animate={{ scaleY: visivel ? 1 : 0 }} transition={{ type: 'spring', stiffness: 120, damping: 18, delay: 0.3 + i * 0.15 }} />
              ))}
            </div>
            <div className="pecas-meio">
              <ClaraAvatar tamanho={56} viva={mexer} />
              <b>Clara</b>
              <div className="chips">{LIGACOES.map(l => <span key={l} className="chip">{l}</span>)}</div>
            </div>
            <p className="pecas-legenda">O teu trabalho num só sítio. O que um sabe, os outros também sabem.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
