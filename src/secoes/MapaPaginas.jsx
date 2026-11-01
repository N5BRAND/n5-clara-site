import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { marcar } from '../legal/analitica.js'
import { COMECAR, DORES, MAIS } from '../logica/mapa.js'

/* botão «Por onde começar» no topo: abre as landing pages arrumadas pelo que o consultor procura.
   O painel vai para o body, como a partilha, para ficar por cima do topo fixo; a página por baixo não se mexe. */
export default function MapaPaginas() {
  const [aberto, setAberto] = useState(false)
  const botao = useRef(null)
  const painel = useRef(null)

  useEffect(() => {
    if (!aberto) return
    painel.current?.querySelector('button')?.focus()
    const tecla = e => { if (e.key === 'Escape') setAberto(false) }
    window.addEventListener('keydown', tecla)
    const html = document.documentElement
    const antes = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', tecla)
      html.style.overflow = antes
      botao.current?.focus()
    }
  }, [aberto])

  const abrir = () => {
    setAberto(true)
    marcar('mapa_aberto')
  }
  /* sendBeacon: o evento sai mesmo com a mudança de página */
  const escolher = href => () => marcar('mapa_escolha', { destino: href }, { transport: 'sendBeacon' })

  return (
    <>
      <button ref={botao} type="button" className="topo-mapa" onClick={abrir} aria-haspopup="dialog" aria-expanded={aberto}>
        <span>Por onde começar</span>
      </button>
      {createPortal(<AnimatePresence>
        {aberto && (
          <motion.div className="mapa-fundo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAberto(false)}>
            <motion.div
              ref={painel}
              className="mapa"
              role="dialog"
              aria-modal="true"
              aria-labelledby="mapa-titulo"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="mapa-topo">
                <h2 id="mapa-titulo">Por onde começar</h2>
                <button type="button" className="partilha-fechar" onClick={() => setAberto(false)} aria-label="Fechar">×</button>
              </div>

              <nav className="mapa-grelha" aria-label="Páginas da N5 Clara">
                <section className="mapa-comecar">
                  <p className="eyebrow">Não sabes por onde começar?</p>
                  <h3>Faz o teu diagnóstico e vê se a Clara é para ti.</h3>
                  {COMECAR.map(c => (
                    <a key={c.href} href={c.href} className="mapa-teste" onClick={escolher(c.href)}>
                      <b>{c.titulo}</b>
                      <span>{c.texto}</span>
                      <i aria-hidden="true">→</i>
                    </a>
                  ))}
                </section>

                <section className="mapa-dores">
                  <p className="eyebrow">Ou vai direto ao que te custa mais</p>
                  <ul>
                    {DORES.map(d => (
                      <li key={d.href}>
                        <a href={d.href} className="mapa-dor" onClick={escolher(d.href)}>
                          <b>«{d.dor}»</b>
                          <span>{d.resposta}</span>
                          {d.plano && <small>{d.plano}</small>}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              </nav>

              <div className="mapa-mais">
                {MAIS.map(m => (
                  <a key={m.href} href={m.href} onClick={escolher(m.href)}><b>{m.titulo}.</b> {m.texto}</a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>, document.body)}
    </>
  )
}
