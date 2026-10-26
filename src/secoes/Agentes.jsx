import { motion, AnimatePresence, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { ClaraAvatar } from '../ilustracoes/Clara.jsx'

const AGENTES = [
  { nome: 'Qualificação', faz: 'Responde e qualifica cada lead com o teu guião, em minutos.' },
  { nome: 'Seguimento', faz: 'Faz os follow-ups e reativa compradores e proprietários parados.' },
  { nome: 'Plano do dia', faz: 'Organiza a tua agenda e as prioridades de cada manhã.' },
  { nome: 'Matching', faz: 'Cruza compradores e imóveis da tua carteira e diz-te porquê.' },
  { nome: 'Documentos', faz: 'Pede e acompanha os documentos de cada imóvel.' },
  { nome: 'Previsão', faz: 'Prevê as tuas vendas e mede os tempos do teu processo.' },
  { nome: 'Memória', faz: 'Transcreve as tuas notas de voz e regista tudo na ficha certa.' },
  { nome: 'Copiloto', faz: 'Preenche o CRM da tua marca por ti.' },
  { nome: 'Chamadas', faz: 'Grava, analisa e faz o coaching das tuas chamadas.' },
]

const LIGACOES = ['WhatsApp e Meta', 'Google Calendar', 'O teu telefone', 'CRM da tua marca', 'ChatGPT e Claude']

/* posição de cada agente num anel à volta da Clara (em % do quadrado) */
const posicao = i => {
  const a = (i / AGENTES.length) * Math.PI * 2 - Math.PI / 2
  return { x: 50 + Math.cos(a) * 40, y: 50 + Math.sin(a) * 40 }
}

export default function Agentes() {
  const ref = useRef(null)
  const visivel = useInView(ref, { amount: 0.35 })
  const [ativo, setAtivo] = useState(0)
  useEffect(() => {
    if (!visivel) return
    const t = setInterval(() => setAtivo(a => (a + 1) % AGENTES.length), 2000)
    return () => clearInterval(t)
  }, [visivel])

  return (
    <section ref={ref} className="seccao escuro agentes">
      <div className="contentor agentes-grelha">
        <div className="seccao-cabeca agentes-cabeca">
          <p className="eyebrow">Uma assistente, nove agentes</p>
          <h2>Falas só com a Clara. Por trás, nove agentes trabalham a tua carteira.</h2>
          <p>Cada um trata de uma parte do teu trabalho. Tu só precisas de falar ou escrever à Clara.</p>
          <div className="agentes-legenda" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div key={ativo} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <b>{AGENTES[ativo].nome}.</b> {AGENTES[ativo].faz}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="agentes-ligacoes">
            <span className="eyebrow">Liga-se a</span>
            <div className="chips">{LIGACOES.map(l => <span key={l} className="chip chip--escuro">{l}</span>)}</div>
          </div>
        </div>

        <div className="anel">
          <svg viewBox="0 0 100 100" className="anel-linhas" aria-hidden="true">
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(245,244,240,0.12)" strokeWidth="0.4" strokeDasharray="1 1.5" />
            {AGENTES.map((a, i) => {
              const p = posicao(i)
              return (
                <motion.line
                  key={a.nome} x1="50" y1="50" x2={p.x} y2={p.y}
                  stroke={i === ativo ? '#E8A13C' : 'rgba(245,244,240,0.14)'} strokeWidth={i === ativo ? 0.8 : 0.4}
                  initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.06 }}
                />
              )
            })}
          </svg>
          <motion.div
            className="anel-centro"
            initial={{ scale: 0.6, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 140, damping: 14 }}
          >
            <ClaraAvatar tamanho={72} viva />
            <b>Clara</b>
          </motion.div>
          {AGENTES.map((a, i) => {
            const p = posicao(i)
            return (
              <motion.button
                key={a.nome}
                type="button"
                className={`anel-agente ${i === ativo ? 'anel-agente--ativo' : ''}`}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                onClick={() => setAtivo(i)}
                initial={{ opacity: 0, scale: 0.6 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.3 + i * 0.06 }}
              >{a.nome}</motion.button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
