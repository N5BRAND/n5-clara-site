import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import Simbolo from '../marca/Simbolo.jsx'
import { ClaraAvatar, Onda } from '../ilustracoes/Clara.jsx'

const CONVERSA = [
  { de: 'rui', voz: '0:12', texto: 'Acabei a visita. A Marta quer voltar no sábado com o marido.' },
  { de: 'clara', texto: 'Feito! Segunda visita marcada para sábado às 11h e feedback guardado na ficha dela.' },
  { de: 'clara', texto: 'Entretanto respondi a 2 leads novas da tua campanha. Uma já está qualificada e entrou no teu plano.' },
  { de: 'rui', texto: 'O que tenho a seguir?' },
  { de: 'clara', texto: 'Ligar à Ana às 16h. Ela pediu a ficha do T3 ontem.' },
]

const subir = (atraso = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { type: 'spring', stiffness: 120, damping: 20, delay: atraso },
})

export function Bolha({ m }) {
  const minha = m.de === 'rui'
  return (
    <div className={`chat-bolha chat-bolha--${m.de}`}>
      {m.voz ? (
        <span className="chat-voz">
          <span className="chat-voz-play" aria-hidden="true">▶</span>
          <Onda viva={false} />
          <span className="chat-voz-tempo">{m.voz}</span>
        </span>
      ) : null}
      {m.ficheiro ? <span className="chat-ficheiro"><span aria-hidden="true">📎</span> {m.texto}</span> : <span className={m.voz ? 'chat-transcricao' : ''}>{m.texto}</span>}
      {minha && <span className="chat-visto" aria-hidden="true">✓✓</span>}
    </div>
  )
}

/* conversa que se escreve sozinha, em ciclo */
function ConversaViva() {
  const [n, setN] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setN(x => (x >= CONVERSA.length + 2 ? 0 : x + 1)), n === 0 ? 900 : n > CONVERSA.length ? 2600 : 1900)
    return () => clearTimeout(t)
  }, [n])
  const vistas = CONVERSA.slice(0, Math.min(n, CONVERSA.length))
  const aEscrever = n > 0 && n < CONVERSA.length && CONVERSA[n].de === 'clara'

  return (
    <div className="telefone telefone--hero" aria-hidden="true">
      <div className="telefone-ecra">
        <div className="chat-topo">
          <ClaraAvatar tamanho={38} viva={aEscrever} />
          <div><b>Clara</b><span className="suave">{aEscrever ? 'a escrever…' : 'online'}</span></div>
        </div>
        <div className="chat-corpo">
          <AnimatePresence initial={false} mode="popLayout">
            {vistas.slice(-3).map(m => (
              <motion.div
                key={m.texto}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                className={`chat-linha chat-linha--${m.de}`}
              >
                <Bolha m={m} />
              </motion.div>
            ))}
          </AnimatePresence>
          {aEscrever && (
            <motion.div className="chat-linha chat-linha--clara" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <span className="chat-bolha chat-bolha--clara a-escrever-clara"><i /><i /><i /></span>
            </motion.div>
          )}
        </div>
        <div className="chat-entrada">
          <span>Fala ou escreve à Clara</span>
          <span className="chat-mic" aria-hidden="true">🎙</span>
        </div>
      </div>
    </div>
  )
}

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const ySimbolo = useTransform(scrollYProgress, [0, 1], [0, 160])

  return (
    <section id="inicio" ref={ref} className="hero escuro">
      <motion.div className="hero-simbolo" style={{ y: ySimbolo }} aria-hidden="true">
        <Simbolo fundo="escuro" largura={760} desenhar atraso={0.4} />
      </motion.div>
      <div className="contentor hero-grelha">
        <div className="hero-texto">
          <motion.p className="eyebrow" {...subir(0.1)}>N5 Clara · Lançamento a 1 de dezembro</motion.p>
          <motion.h1 {...subir(0.2)}>A tua assistente comercial.</motion.h1>
          <motion.p className="hero-lead" {...subir(0.35)}>
            A Clara responde às tuas leads, organiza o teu dia e mostra-te onde perdes tempo e negócios. Falas ou escreves, ela faz. Para venderes mais sem trabalhares mais horas.
          </motion.p>
          <motion.div className="hero-botoes" {...subir(0.5)}>
            <a href="#lista" className="botao">Entrar na lista de espera</a>
            <a href="#dia" className="botao botao--linha">Ver um dia com a Clara</a>
          </motion.div>
        </div>
        <motion.div className="hero-conversa" {...subir(0.7)}>
          <ConversaViva />
        </motion.div>
      </div>
    </section>
  )
}
