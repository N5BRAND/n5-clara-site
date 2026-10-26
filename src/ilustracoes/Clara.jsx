import { motion } from 'motion/react'
import { Pessoa } from './Pessoas.jsx'

/* o rosto da Clara: retrato num círculo dourado, com uma faísca que pisca */
export function ClaraAvatar({ tamanho = 40, viva = false }) {
  return (
    <span className="clara-avatar" style={{ width: tamanho, height: tamanho }} aria-hidden="true">
      <span className="clara-avatar-retrato">
        <Pessoa largura={tamanho * 1.1} cor="#15181D" cabelo="apanhado" fala={viva} />
      </span>
      <motion.span
        className="clara-avatar-faisca"
        animate={{ scale: [1, 1.35, 1], rotate: [0, 20, 0] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      >✦</motion.span>
    </span>
  )
}

/* barras de uma nota de voz */
export function Onda({ viva = true, barras = 18, className = 'onda-voz' }) {
  return (
    <span className={className} aria-hidden="true">
      {Array.from({ length: barras }, (_, i) => (
        <motion.i
          key={i}
          animate={viva ? { scaleY: [0.3, 1, 0.45, 0.85, 0.3] } : { scaleY: 0.35 + ((i * 37) % 60) / 100 }}
          transition={viva ? { duration: 1 + (i % 4) * 0.2, repeat: Infinity, delay: i * 0.05 } : { duration: 0.3 }}
        />
      ))}
    </span>
  )
}
