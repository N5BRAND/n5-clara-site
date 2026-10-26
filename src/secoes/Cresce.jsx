import { motion } from 'motion/react'

const PACOTES = ['Contactos', 'Imóveis', 'Pipelines', 'Conversas', 'Histórico']

export default function Cresce() {
  return (
    <section className="seccao escuro cresce">
      <div className="contentor">
        <div className="seccao-cabeca">
          <p className="eyebrow">Cresce contigo</p>
          <h2>Começas sozinho. A tua carteira vai contigo.</h2>
        </div>
        <div className="cresce-grelha">
          <motion.div className="cresce-bloco" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 120, damping: 20 }}>
            <span className="eyebrow">Na Clara</span>
            <h3>Tu e uma equipa até 5 consultores</h3>
            <p>O líder vê os pipelines, as leads e os indicadores de chamadas de cada consultor.</p>
          </motion.div>

          <div className="cresce-ponte" aria-hidden="true">
            {PACOTES.map((p, i) => (
              <motion.span
                key={p}
                className="cresce-pacote"
                animate={{ x: ['-40%', '140%'], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, delay: i * 0.64, ease: 'easeInOut' }}
              >{p}</motion.span>
            ))}
          </div>

          <motion.div className="cresce-bloco cresce-bloco--destino" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.15 }}>
            <span className="eyebrow">No N5 Imobiliário</span>
            <h3>Quando a agência cresce, entras sem recomeçar</h3>
            <p>Tudo passa para a ficha única da agência e a Clara continua contigo. O que trouxeste é teu.</p>
            <a className="cresce-link" href="https://n5-agentic-os.netlify.app" target="_blank" rel="noreferrer">Conhecer o N5 Imobiliário →</a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
