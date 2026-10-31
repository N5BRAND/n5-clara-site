import { motion, AnimatePresence, useScroll, useMotionValueEvent, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { useRef, useState } from 'react'
import { CENAS as TODAS } from './dados.js'
import { cenaDe, passoDe } from '../logica/linha-tempo.js'
import { horaDe } from '../logica/hora.js'
import CenaDia from './CenaDia.jsx'
import Ceu from './Ceu.jsx'
import Ajusta from '../marca/Ajusta.jsx'

/* na página principal, três momentos do dia (pedido do Pedro, 31/10): organizar o dia, responder às leads e registar
   por voz. As outras cenas continuam em dados.js para as landing pages */
const MOMENTOS = ['plano', 'lead', 'voz']
const CENAS = TODAS.filter(c => MOMENTOS.includes(c.id))

const VH_POR_CENA = 140
const HORAS = CENAS.map(c => c.hora)

const variantes = {
  entra: dir => ({ opacity: 0, y: dir * 70, scale: 0.97 }),
  centro: { opacity: 1, y: 0, scale: 1 },
  sai: dir => ({ opacity: 0, y: dir * -70, scale: 0.97 }),
}

function Texto({ cena }) {
  return (
    <div className="demo-texto-bloco">
      <p className="eyebrow">{cena.eyebrow}</p>
      <h2>{cena.titulo}</h2>
      <p className="demo-texto-p">{cena.texto}</p>
    </div>
  )
}

/* versão sem movimento: os momentos do dia empilhados, com tudo à vista */
function DiaEstatico() {
  return (
    <section id="dia" className="demo-estatica seccao">
      <div className="contentor">
        <p className="eyebrow">Um dia com a Clara</p>
        {CENAS.map(c => (
          <div key={c.id} className="demo-estatica-cena">
            <Texto cena={c} />
            <CenaDia cena={c} passo={c.passos} estatico />
          </div>
        ))}
      </div>
    </section>
  )
}

export default function Dia() {
  const reduzir = useReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const suave = useSpring(scrollYProgress, { stiffness: 140, damping: 30 })
  const hora = useTransform(suave, v => horaDe(v, HORAS))
  const [estado, setEstado] = useState({ indice: 0, passo: 1, dir: 1 })

  useMotionValueEvent(scrollYProgress, 'change', v => {
    const { indice, avanco } = cenaDe(v, CENAS.length)
    const passo = passoDe(avanco, CENAS[indice].passos)
    setEstado(e => (e.indice === indice && e.passo === passo)
      ? e
      : { indice, passo, dir: indice === e.indice ? e.dir : indice > e.indice ? 1 : -1 })
  })

  if (reduzir) return <DiaEstatico />


  const cena = CENAS[estado.indice]

  return (
    <section id="dia" ref={ref} className="demo dia" style={{ height: `${CENAS.length * VH_POR_CENA}vh` }}>
      <div className="demo-palco">
        <motion.div className="demo-progresso" style={{ scaleX: suave }} />
        <div className="contentor demo-grelha">
          <div className="demo-lado">
            <div className="dia-relogio">
              <span className="eyebrow">Um dia com a Clara</span>
              <motion.span className="dia-relogio-hora">{hora}</motion.span>
            </div>
            {/* só o momento atual, um de cada vez */}
            <div className="dia-etapa" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={cena.id}
                  className="dia-etapa-chip"
                  initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  <span className="dia-etapa-hora">{cena.hora}</span>
                  <span>{cena.curto}</span>
                </motion.span>
              </AnimatePresence>
              <span className="dia-etapa-conta">{estado.indice + 1} de {CENAS.length}</span>
            </div>
            <AnimatePresence mode="wait" custom={estado.dir} initial={false}>
              <motion.div
                key={cena.id}
                custom={estado.dir}
                variants={variantes}
                initial="entra"
                animate="centro"
                exit="sai"
                transition={{ type: 'spring', stiffness: 160, damping: 24 }}
                className="demo-texto"
              >
                <Texto cena={cena} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="demo-cena-area">
            <Ajusta className="demo-cena-ajusta">
              <AnimatePresence mode="wait" custom={estado.dir} initial={false}>
                <motion.div
                  key={cena.id}
                  custom={estado.dir}
                  variants={variantes}
                  initial="entra"
                  animate="centro"
                  exit="sai"
                  transition={{ type: 'spring', stiffness: 160, damping: 24 }}
                  className="demo-cena"
                >
                  <CenaDia cena={cena} passo={estado.passo} />
                </motion.div>
              </AnimatePresence>
            </Ajusta>
          </div>
        </div>
        <div className="demo-rua">
          <Ceu progresso={suave} cenas={CENAS} indice={estado.indice} />
        </div>
      </div>
    </section>
  )
}
