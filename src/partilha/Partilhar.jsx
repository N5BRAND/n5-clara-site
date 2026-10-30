import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { marcar } from '../legal/analitica.js'
import { IMAGEM_POST, REDES, TEXTOS, post, urlPartilha } from '../logica/partilha.js'

/* copia sem esperar: tem de acontecer ainda dentro do clique, antes de se abrir a janela da rede */
function copiar(texto) {
  try {
    const t = document.createElement('textarea')
    t.value = texto
    t.setAttribute('readonly', '')
    t.style.cssText = 'position:fixed;opacity:0;pointer-events:none'
    document.body.append(t)
    t.select()
    const ok = document.execCommand('copy')
    t.remove()
    if (ok) return true
  } catch { /* segue para a API do clipboard */ }
  navigator.clipboard?.writeText(texto).catch(() => {})
  return true
}

const AVISOS = {
  linkedin: 'O LinkedIn abriu com o post já escrito. É só publicar.',
  facebook: 'Copiámos o texto do post. Cola-o no Facebook antes de publicar.',
  instagram: 'Guardámos a imagem e copiámos a legenda. Publica-a no Instagram.',
  partilhado: 'Escolhe o Instagram e cola a legenda, que já está copiada.',
}

/* botão «Partilhar»: mostra o post (imagem e texto) e abre-o na rede escolhida.
   A janela vai para o body, para ficar por cima de tudo mesmo quando o botão está no topo fixo. */
export default function Partilhar({ texto = TEXTOS.geral, rotulo = 'Partilhar a N5 Clara', variante = 'linha' }) {
  const [aberto, setAberto] = useState(false)
  const [aviso, setAviso] = useState('')
  const imagem = useRef(null)
  const caixa = useRef(null)

  useEffect(() => {
    if (!aberto) return
    // a imagem fica pronta antes do clique no Instagram, para a partilha do telemóvel não perder o gesto
    if (!imagem.current) {
      fetch(IMAGEM_POST).then(r => r.blob()).then(b => { imagem.current = new File([b], 'n5-clara.png', { type: 'image/png' }) }).catch(() => {})
    }
    caixa.current?.querySelector('button')?.focus()
    const tecla = e => { if (e.key === 'Escape') setAberto(false) }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  }, [aberto])

  function abrir() {
    setAviso('')
    setAberto(true)
    marcar('partilha_aberta')
  }

  function partilhar(rede) {
    marcar('partilha', { rede })
    const legenda = post(texto, rede)
    if (rede !== 'linkedin') copiar(legenda)
    if (rede !== 'instagram') {
      window.open(urlPartilha(rede, texto), '_blank', 'noopener,noreferrer,width=640,height=720')
      setAviso(AVISOS[rede])
      return
    }
    const f = imagem.current
    if (f && navigator.canShare?.({ files: [f] })) {
      navigator.share({ files: [f], text: legenda }).then(() => setAviso(AVISOS.partilhado)).catch(() => {})
      return
    }
    const a = document.createElement('a')
    a.href = IMAGEM_POST
    a.download = 'n5-clara.png'
    a.click()
    setAviso(AVISOS.instagram)
  }

  return (
    <>
      <button type="button" className={variante === 'nav' ? 'partilhar-nav' : 'botao botao--linha partilhar-botao'} onClick={abrir} aria-haspopup="dialog">
        {rotulo}
      </button>
      {createPortal(<AnimatePresence>
        {aberto && (
          <motion.div className="partilha-fundo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAberto(false)}>
            <motion.div
              ref={caixa}
              className="partilha-caixa"
              role="dialog"
              aria-modal="true"
              aria-labelledby="partilha-titulo"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="partilha-topo">
                <h3 id="partilha-titulo">Partilha a N5 Clara</h3>
                <button type="button" className="partilha-fechar" onClick={() => setAberto(false)} aria-label="Fechar">×</button>
              </div>
              <figure className="partilha-previa">
                <img src={IMAGEM_POST} alt="Post da N5 Clara: uma assistente que responde às tuas leads, organiza o teu dia e te diz como fechar." width="1080" height="1080" />
                <figcaption>{texto}</figcaption>
              </figure>
              <div className="partilha-redes">
                {REDES.map(r => (
                  <button key={r.id} type="button" className={`botao partilha-rede partilha-rede--${r.id}`} onClick={() => partilhar(r.id)}>{r.nome}</button>
                ))}
              </div>
              <p className="partilha-aviso" role="status">{aviso}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>, document.body)}
    </>
  )
}
