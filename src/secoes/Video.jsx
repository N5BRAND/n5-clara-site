import { motion } from 'motion/react'
import { useRef, useState } from 'react'

/* o vídeo do produto: carrega só quando se carrega no play, com som */
export default function Video() {
  const ref = useRef(null)
  const [aTocar, setATocar] = useState(false)

  const tocar = () => {
    const v = ref.current
    if (!v) return
    v.play()
    setATocar(true)
  }

  return (
    <section id="video" className="seccao video-seccao">
      <div className="contentor">
        <div className="seccao-cabeca">
          <p className="eyebrow">Em um minuto</p>
          <h2>Vê um dia com a Clara.</h2>
          <p>Das oito da manhã ao fim do dia, num minuto. Liga o som.</p>
        </div>
        <motion.div
          className="video-moldura"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: 'spring', stiffness: 120, damping: 22 }}
        >
          <video
            ref={ref}
            src="/video/n5-clara.mp4"
            poster="/video/n5-clara.jpg"
            preload="none"
            playsInline
            controls={aTocar}
            onPause={() => ref.current?.ended && setATocar(false)}
            aria-label="Vídeo de apresentação com voz e legendas"
          />
          {!aTocar && (
            <button type="button" className="video-play" onClick={tocar} aria-label="Ver o vídeo">
              <motion.span className="video-play-botao" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
              </motion.span>
            </button>
          )}
        </motion.div>
      </div>
    </section>
  )
}
