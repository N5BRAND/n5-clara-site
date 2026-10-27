import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import { lerConsentimento, novoConsentimento, guardarConsentimento } from './consentimento.js'

const armazenamento = () => {
  try { return window.localStorage } catch { return { getItem: () => null, setItem: () => { throw new Error('sem armazenamento') } } }
}

/* abre o aviso a partir de qualquer link «Definições de cookies» */
export const abrirCookies = e => {
  e?.preventDefault()
  window.dispatchEvent(new Event('abrir-cookies'))
}

/* aviso de cookies: aceitar e rejeitar com o mesmo peso; só o essencial até haver escolha */
export default function AvisoCookies() {
  const [aberto, setAberto] = useState(false)
  const [detalhe, setDetalhe] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    const atual = lerConsentimento(armazenamento())
    if (!atual) setAberto(true)
    else setMarketing(atual.marketing)
    const abrir = () => { setAberto(true); setDetalhe(true) }
    window.addEventListener('abrir-cookies', abrir)
    return () => window.removeEventListener('abrir-cookies', abrir)
  }, [])

  const decidir = escolha => {
    const c = novoConsentimento({ marketing: escolha })
    guardarConsentimento(armazenamento(), c)
    setMarketing(c.marketing)
    setAberto(false)
    setDetalhe(false)
    window.dispatchEvent(new CustomEvent('consentimento-mudou', { detail: c }))
  }

  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          className="cookies"
          role="dialog"
          aria-live="polite"
          aria-label="Aviso de cookies"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        >
          <b className="cookies-titulo">Cookies</b>
          <p>
            Usamos só o essencial para o site funcionar. Com a tua autorização, usamos também cookies de marketing da Meta para medir os nossos anúncios e mostrá-los a quem já visitou o site.{' '}
            <a href="/privacidade/#cookies">Saber mais</a>
          </p>
          {detalhe && (
            <div className="cookies-opcoes">
              <label className="cookies-opcao">
                <input type="checkbox" checked disabled />
                <span><b>Essenciais</b> Guardam a tua escolha sobre cookies. Sempre ativos.</span>
              </label>
              <label className="cookies-opcao">
                <input type="checkbox" checked={marketing} onChange={e => setMarketing(e.target.checked)} />
                <span><b>Marketing</b> Medição e publicidade da Meta (Facebook e Instagram).</span>
              </label>
            </div>
          )}
          <div className="cookies-botoes">
            <button type="button" className="botao cookies-decisao" onClick={() => decidir(false)}>Rejeitar</button>
            {detalhe
              ? <button type="button" className="botao botao--linha cookies-meio" onClick={() => decidir(marketing)}>Guardar escolha</button>
              : <button type="button" className="botao botao--linha cookies-meio" onClick={() => setDetalhe(true)}>Personalizar</button>}
            <button type="button" className="botao cookies-decisao" onClick={() => decidir(true)}>Aceitar</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
