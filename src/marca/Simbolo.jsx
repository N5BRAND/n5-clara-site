import { motion } from 'motion/react'

const TRACOS = ['M25 8 V102', 'M75 8 V102', 'M125 8 V102', 'M175 8 V102']
const DIAGONAL = 'M4 88 L200 20'

/* símbolo oficial Nº 5; com «desenhar», os traços somam um a um e a diagonal fecha a conta */
export default function Simbolo({ fundo = 'claro', largura = 64, desenhar = false, atraso = 0, titulo = 'Nº 5' }) {
  const traco = fundo === 'escuro' ? '#F5F4F0' : '#15181D'
  const anim = i => desenhar
    ? {
        initial: { pathLength: 0, opacity: 0 },
        animate: { pathLength: 1, opacity: 1 },
        transition: { delay: atraso + i * 0.18, duration: i === 4 ? 0.5 : 0.35, ease: [0.65, 0, 0.35, 1] },
      }
    : {}
  return (
    <svg viewBox="0 0 210 110" width={largura} height={(largura * 110) / 210} role="img" aria-label={titulo}>
      <g strokeWidth="16" strokeLinecap="round" fill="none">
        {TRACOS.map((d, i) => <motion.path key={d} d={d} stroke={traco} {...anim(i)} />)}
        <motion.path d={DIAGONAL} stroke="#E8A13C" {...anim(4)} />
      </g>
    </svg>
  )
}
