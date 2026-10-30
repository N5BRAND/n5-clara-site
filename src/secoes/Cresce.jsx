import { motion } from 'motion/react'

const PACOTES = ['Contactos', 'Imóveis', 'Pipelines', 'Conversas', 'Histórico']

export default function Cresce() {
  return (
    <section data-seccao="cresce" className="seccao escuro cresce">
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
              <span key={p} className="cresce-pacote" style={{ '--i': i }}>{p}</span>
            ))}
          </div>

          <motion.div className="cresce-bloco cresce-bloco--destino" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.15 }}>
            <span className="eyebrow">Para a agência toda</span>
            <h3>Quando quiseres levar a agência inteira, os teus dados vão contigo</h3>
            <p>A Clara é para ti ou para a tua equipa até 5 consultores. O N5 Imobiliário é o sistema da Nº5 para a agência toda: comercial, crédito, jurídico, financeiro e broker. Se a agência quiser dar esse passo, migramos todos os teus dados e ninguém recomeça do zero. A agência inteira passa a ter a estrutura da Nº5.</p>
            <a className="cresce-link" href="https://agentic.numerocinco.pt" target="_blank" rel="noreferrer">Conhecer o N5 Imobiliário →</a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
