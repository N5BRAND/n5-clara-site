import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { ClaraAvatar } from '../ilustracoes/Clara.jsx'
import { SAUDACAO, SUGESTOES, LIMITES, temContacto } from './conversa.js'
import { evento, novoIdEvento } from '../legal/pixel.js'
import { marcar } from '../legal/analitica.js'
import { emTeste } from '../legal/teste.js'

/* a conversa segue de página em página durante a visita (sessionStorage); sem armazenamento, começa em cada página */
const CHAVE = 'n5-assistente'
const ler = () => { try { return JSON.parse(window.sessionStorage.getItem(CHAVE)) || {} } catch { return {} } }
const guardar = estado => { try { window.sessionStorage.setItem(CHAVE, JSON.stringify(estado)) } catch { /* sem armazenamento */ } }

const INICIO = [{ de: 'clara', texto: SAUDACAO }]

/* em ecrãs estreitos o aviso de cookies ocupa a largura toda: o assistente sobe por cima dele */
function useAltCookies() {
  const [alt, setAlt] = useState(0)
  useEffect(() => {
    const medir = () => {
      const c = document.querySelector('.cookies')
      setAlt(c && window.innerWidth < 900 ? c.offsetHeight + 12 : 0)
    }
    medir()
    const obs = new MutationObserver(medir)
    obs.observe(document.body, { childList: true, subtree: true })
    window.addEventListener('resize', medir)
    return () => { obs.disconnect(); window.removeEventListener('resize', medir) }
  }, [])
  return alt
}

function Sugestoes({ lista, aoEscolher }) {
  if (!lista.length) return null
  return (
    <div className="assist-sugestoes" role="group" aria-label="Perguntas sugeridas">
      {lista.map(s => <button key={s} type="button" className="assist-sugestao" onClick={() => aoEscolher(s)}>{s}</button>)}
    </div>
  )
}

/* a Clara pergunta se a pessoa precisa de ajuda, com quatro perguntas prontas, e responde ao que lhe perguntarem */
export default function Assistente() {
  const guardado = useRef(ler()).current
  const [mensagens, setMensagens] = useState(guardado.mensagens || INICIO)
  const [sugestoes, setSugestoes] = useState(guardado.sugestoes || SUGESTOES)
  const [contacto, setContacto] = useState(guardado.contacto || {})
  const [ghl, setGhl] = useState(guardado.ghl || {})
  const [aberto, setAberto] = useState(!!guardado.aberto)
  const [convite, setConvite] = useState(!guardado.aberto && !guardado.dispensado && !guardado.mensagens)
  const [texto, setTexto] = useState('')
  const [aEscrever, setAEscrever] = useState(false)
  const lista = useRef(null)
  const campo = useRef(null)
  const altCookies = useAltCookies()

  useEffect(() => { if (convite) marcar('assistente_convite') }, [])

  useEffect(() => {
    guardar({ mensagens: mensagens.length > 1 ? mensagens : undefined, sugestoes, contacto, ghl, aberto, dispensado: !convite })
  }, [mensagens, sugestoes, contacto, ghl, aberto, convite])

  useEffect(() => { lista.current?.scrollTo({ top: lista.current.scrollHeight, behavior: 'smooth' }) }, [mensagens, aEscrever, aberto])

  useEffect(() => {
    if (!aberto) return
    const sair = e => { if (e.key === 'Escape') fechar() }
    window.addEventListener('keydown', sair)
    return () => window.removeEventListener('keydown', sair)
  }, [aberto])

  function abrir(como) {
    setConvite(false)
    setAberto(true)
    marcar('assistente_aberto', { como })
    if (window.matchMedia('(min-width: 561px)').matches) setTimeout(() => campo.current?.focus(), 250)
  }

  function fechar() {
    setAberto(false)
    marcar('assistente_fechado', { mensagens: mensagens.filter(m => m.de === 'visitante').length })
  }

  async function enviar(pergunta, sugerida = false) {
    const p = String(pergunta).trim().slice(0, LIMITES.texto)
    if (!p || aEscrever) return
    if (!aberto) abrir('sugestao')
    const novas = [...mensagens, { de: 'visitante', texto: p }].slice(-LIMITES.mensagens)
    setMensagens(novas)
    setTexto('')
    setSugestoes([])
    setAEscrever(true)
    marcar('assistente_mensagem', { n: novas.filter(m => m.de === 'visitante').length, sugerida })
    try {
      const r = await fetch('/api/assistente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagens: novas, contacto, ghl, pagina: window.location.pathname, teste: emTeste() }),
      })
      if (!r.ok) throw new Error(String(r.status))
      const d = await r.json()
      setMensagens(m => [...m, { de: 'clara', texto: d.resposta }])
      setSugestoes(d.sugestoes || [])
      if (d.ghl) setGhl(d.ghl)
      if (d.contacto) {
        /* a primeira vez que a pessoa deixa nome e contacto: conta como contacto na Meta (com o marketing aceite) */
        if (temContacto(d.contacto) && !temContacto(contacto)) {
          evento('Contact', { content_category: 'assistente' }, novoIdEvento())
          marcar('assistente_contacto', { email: !!d.contacto.email, telefone: !!d.contacto.telefone })
        }
        setContacto(d.contacto)
      }
    } catch {
      setMensagens(m => [...m, { de: 'clara', texto: 'Estou com dificuldades em responder agora. Tenta outra vez daqui a pouco, por favor.' }])
      setSugestoes([p])
    } finally {
      setAEscrever(false)
    }
  }

  return (
    <div className="assist" style={altCookies ? { bottom: altCookies + 16 } : undefined}>
      <AnimatePresence>
        {convite && !aberto && (
          <motion.div key="convite" className="assist-convite" initial={{ opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }}>
            <button type="button" className="assist-fechar assist-fechar--convite" aria-label="Fechar" onClick={() => { setConvite(false); marcar('assistente_dispensado') }}>×</button>
            <button type="button" className="assist-convite-fala" onClick={() => abrir('convite')}>{SAUDACAO}</button>
            <Sugestoes lista={SUGESTOES} aoEscolher={s => enviar(s, true)} />
          </motion.div>
        )}
        {aberto && (
          <motion.section
            key="painel" className="assist-painel ph-no-capture" role="dialog" aria-label="Conversa com a Clara"
            initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16 }}
          >
            <header className="assist-cabeca">
              <ClaraAvatar tamanho={38} viva={aEscrever} />
              <div><b>Clara</b><small>Assistente comercial da N5 Clara</small></div>
              <button type="button" className="assist-fechar" aria-label="Fechar a conversa" onClick={fechar}>×</button>
            </header>
            <div className="assist-mensagens" ref={lista} aria-live="polite">
              {mensagens.map((m, i) => <p key={i} className={`assist-msg assist-msg--${m.de}`}>{m.texto.replace(/(\d) (€|%)/g, '$1 $2')}</p>)}
              {aEscrever && <span className="assist-msg assist-msg--clara"><span className="clara-a-escrever" role="status" aria-label="A Clara está a escrever"><i /><i /><i /></span></span>}
            </div>
            {!aEscrever && <Sugestoes lista={sugestoes} aoEscolher={s => enviar(s, true)} />}
            <form className="assist-form" onSubmit={e => { e.preventDefault(); enviar(texto) }}>
              <input
                ref={campo} value={texto} onChange={e => setTexto(e.target.value)} maxLength={LIMITES.texto}
                placeholder="Escreve a tua pergunta…" aria-label="A tua mensagem" enterKeyHint="send" autoComplete="off"
              />
              <button type="submit" className="assist-enviar" disabled={!texto.trim() || aEscrever} aria-label="Enviar">↑</button>
            </form>
            <p className="assist-aviso">Estás a falar com uma IA. Se deixares o teu contacto, a conversa fica guardada para a equipa da Nº 5 te responder. <a href="/privacidade/#assistente" target="_blank" rel="noreferrer">Privacidade</a></p>
          </motion.section>
        )}
      </AnimatePresence>
      {!aberto && (
        <motion.button type="button" className="assist-botao" aria-label="Falar com a Clara" onClick={() => abrir('botao')} initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <ClaraAvatar tamanho={52} viva />
          {mensagens.length > 1 && <span className="assist-ponto" aria-hidden="true" />}
        </motion.button>
      )}
    </div>
  )
}
