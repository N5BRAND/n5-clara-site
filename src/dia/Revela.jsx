import { motion } from 'motion/react'

const MOLA = { type: 'spring', stiffness: 170, damping: 22 }

/* elemento que entra quando o scroll chega ao seu passo; ocupa sempre o seu lugar para nada saltar */
export default function Revela({ ver, atraso = 0, de = 18, como = 'div', className, children, ...resto }) {
  const M = motion[como]
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: de, scale: 0.98 }}
      animate={ver ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: de, scale: 0.98 }}
      transition={{ ...MOLA, delay: ver ? atraso : 0 }}
      {...resto}
    >
      {children}
    </M>
  )
}
