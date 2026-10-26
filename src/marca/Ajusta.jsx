import { useLayoutEffect, useRef, useState } from 'react'

/* encolhe o conteúdo só quando não cabe na altura disponível, para nada passar por baixo do que vem a seguir */
export default function Ajusta({ className = '', children }) {
  const fora = useRef(null)
  const dentro = useRef(null)
  const [escala, setEscala] = useState(1)

  useLayoutEffect(() => {
    const medir = () => {
      const disponivel = fora.current?.clientHeight || 0
      const natural = dentro.current?.scrollHeight || 0
      setEscala(disponivel && natural > disponivel ? disponivel / natural : 1)
    }
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(fora.current)
    ro.observe(dentro.current)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={fora} className={`ajusta ${className}`}>
      <div ref={dentro} className="ajusta-dentro" style={{ transform: escala < 1 ? `scale(${escala})` : undefined, marginBlock: escala < 1 ? 0 : 'auto' }}>
        {children}
      </div>
    </div>
  )
}
