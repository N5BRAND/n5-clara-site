import { motion, useScroll, useMotionValueEvent } from 'motion/react'
import { useState } from 'react'
import Simbolo from '../marca/Simbolo.jsx'
import { ESGOTADO } from '../logica/pagamento.js'
import Partilhar from '../partilha/Partilhar.jsx'

export default function Topo() {
  const { scrollY } = useScroll()
  const [solido, setSolido] = useState(false)
  useMotionValueEvent(scrollY, 'change', y => setSolido(y > 40))

  return (
    <motion.header
      className={`topo ${solido ? 'topo--solido' : ''}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30, delay: 0.2 }}
    >
      <div className="contentor topo-linha">
        <a href="#inicio" className="topo-marca" aria-label="N5 Clara, início">
          <Simbolo fundo={solido ? 'claro' : 'escuro'} largura={44} />
          <span>N5 Clara</span>
        </a>
        <nav className="topo-nav" aria-label="Secções">
          <a href="#dia">Um dia com a Clara</a>
          <a href="#planos">Planos</a>
          <a href="#lista">{ESGOTADO ? 'Lista de espera' : 'Reserva'}</a>
          <Partilhar variante="nav" rotulo="Partilhar" />
        </nav>
        <a href="#lista" className="botao topo-cta">{ESGOTADO ? 'Lista de espera' : 'Reservar'}</a>
      </div>
    </motion.header>
  )
}
