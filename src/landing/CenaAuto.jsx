import { useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import CenaDia from '../dia/CenaDia.jsx'

const RITMO = 1700

/* uma cena do dia que se mostra sozinha, passo a passo, quando entra no ecrã; sem movimento, aparece completa */
export default function CenaAuto({ cena }) {
  const reduzir = useReducedMotion()
  const ref = useRef(null)
  const visivel = useInView(ref, { amount: 0.45, once: true })
  const [passo, setPasso] = useState(reduzir ? cena.passos : 0)

  useEffect(() => {
    if (reduzir || !visivel || passo >= cena.passos) return
    const t = setTimeout(() => setPasso(p => p + 1), passo === 0 ? 300 : RITMO)
    return () => clearTimeout(t)
  }, [reduzir, visivel, passo, cena.passos])

  return (
    <div ref={ref} className="lp-cena-palco">
      <CenaDia cena={cena} passo={Math.max(passo, reduzir ? cena.passos : 0)} estatico />
      {!reduzir && passo >= cena.passos && (
        <button type="button" className="lp-cena-repetir" onClick={() => setPasso(0)}>Ver outra vez</button>
      )}
    </div>
  )
}
