import { motion, useScroll, useMotionValueEvent, useReducedMotion } from 'motion/react'
import { useRef, useState } from 'react'
import { cenaDe } from '../logica/linha-tempo.js'

const PROMESSAS = [
  { n: '01', titulo: 'Nenhuma lead fica sem resposta', texto: 'A Clara responde e qualifica em minutos, avisa-te do que ficou por seguir e reativa compradores e proprietários parados.' },
  { n: '02', titulo: 'Sabes o que fazer hoje', texto: 'O plano do dia chega por prioridade: visitas, angariações, documentos em falta e compradores novos que encaixam.' },
  { n: '03', titulo: 'Sabes quanto vais vender', texto: 'A previsão de vendas parte do teu histórico e do teu ciclo de vendas, não de médias do mercado.' },
  { n: '04', titulo: 'Sabes onde perdes tempo', texto: 'A Clara mede cada etapa do teu processo, ouve as tuas chamadas e diz-te todos os dias o que melhorar.' },
]

/* as quatro promessas, uma de cada vez: o scroll vai envolvendo cada uma em dourado */
export default function Promessas() {
  const reduzir = useReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [ativo, setAtivo] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', v => setAtivo(cenaDe(v, PROMESSAS.length).indice))

  return (
    <section ref={ref} className="eixos escuro" style={{ height: reduzir ? 'auto' : '340vh' }}>
      <div className={reduzir ? 'eixos-palco eixos-palco--estatico' : 'eixos-palco'}>
        <div className="contentor">
          <p className="eyebrow">O que a Clara faz por ti</p>
          <div className="eixos-grelha promessas-grelha">
            {PROMESSAS.map((e, i) => {
              const aceso = reduzir || i === ativo
              return (
                <motion.div
                  key={e.n}
                  className={`eixo ${aceso ? 'eixo--ativo' : ''}`}
                  animate={{ opacity: aceso ? 1 : 0.38, y: aceso ? -8 : 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                >
                  {!reduzir && i === ativo && (
                    <motion.span layoutId="promessa-envolve" className="eixo-envolve" transition={{ type: 'spring', stiffness: 220, damping: 28 }} />
                  )}
                  <span className="eixo-n">{e.n}</span>
                  <h3>{e.titulo}</h3>
                  <p>{e.texto}</p>
                </motion.div>
              )
            })}
          </div>
          {!reduzir && (
            <div className="eixos-progresso" aria-hidden="true">
              {PROMESSAS.map((e, i) => <span key={e.n} className={i <= ativo ? 'cheio' : ''} />)}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
