import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import { LANCAMENTO, tempoAte } from '../logica/contagem.js'
import { validarInscricao, PLANOS } from '../logica/validar.js'
import { codificar } from '../logica/netlify.js'
import { ClaraAvatar } from '../ilustracoes/Clara.jsx'

const VAZIO = { nome: '', email: '', telefone: '', agencia: '', plano: '', consentimento: false }

function Contagem() {
  const [t, setT] = useState(() => tempoAte(LANCAMENTO))
  useEffect(() => {
    const i = setInterval(() => setT(tempoAte(LANCAMENTO)), 1000)
    return () => clearInterval(i)
  }, [])
  const partes = [['dias', t.dias], ['horas', t.horas], ['min', t.minutos], ['seg', t.segundos]]
  return (
    <div className="contagem" aria-label={`Faltam ${t.dias} dias para o lançamento`}>
      {partes.map(([r, v]) => (
        <div key={r} className="contagem-parte">
          <span className="contagem-num">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={v} initial={{ y: '-60%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '60%', opacity: 0 }} transition={{ duration: 0.3 }}>
                {String(v).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="contagem-rotulo">{r}</span>
        </div>
      ))}
    </div>
  )
}

function Campo({ nome, rotulo, erro, ...resto }) {
  return (
    <label className={`campo ${erro ? 'campo--erro' : ''}`}>
      <span>{rotulo}</span>
      <input name={nome} aria-invalid={!!erro} {...resto} />
      <AnimatePresence>
        {erro && <motion.small initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{erro}</motion.small>}
      </AnimatePresence>
    </label>
  )
}

function Formulario() {
  const [d, setD] = useState(VAZIO)
  const [erros, setErros] = useState({})
  const [estado, setEstado] = useState('pronto') // pronto | a-enviar | enviado | falhou

  /* os botões dos planos escolhem o plano aqui */
  useEffect(() => {
    const escolher = e => setD(x => ({ ...x, plano: e.detail }))
    window.addEventListener('escolher-plano', escolher)
    return () => window.removeEventListener('escolher-plano', escolher)
  }, [])

  const muda = e => {
    const { name, value, type, checked } = e.target
    setD(x => ({ ...x, [name]: type === 'checkbox' ? checked : value }))
  }

  const enviar = async e => {
    e.preventDefault()
    const v = validarInscricao(d)
    setErros(v.erros)
    if (!v.ok) return
    setEstado('a-enviar')
    try {
      const r = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: codificar({ 'form-name': 'lista-clara', ...d, 'empresa-site': e.target.elements['empresa-site'].value }),
      })
      if (!r.ok) throw new Error(String(r.status))
      setEstado('enviado')
    } catch {
      setEstado('falhou')
    }
  }

  return (
    <div className="cartao prevenda-form">
      <AnimatePresence mode="wait">
        {estado === 'enviado' ? (
          <motion.div key="ok" className="prevenda-ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <ClaraAvatar tamanho={84} viva />
            <h3>Estás na lista.</h3>
            <p>A Clara avisa-te assim que abrirmos. Dá cá cinco 🖐️</p>
          </motion.div>
        ) : (
          <motion.form key="form" name="lista-clara" onSubmit={enviar} noValidate exit={{ opacity: 0, y: -10 }}>
            <h3>Entra na lista de espera</h3>
            <p className="prevenda-form-sub">Sem compromisso. És dos primeiros a saber quando a Clara abrir.</p>
            <p className="so-leitores"><label>Não preenchas: <input name="empresa-site" tabIndex={-1} autoComplete="off" /></label></p>
            <div className="prevenda-campos">
              <Campo nome="nome" rotulo="Nome" value={d.nome} onChange={muda} erro={erros.nome} autoComplete="name" />
              <Campo nome="email" rotulo="Email" type="email" value={d.email} onChange={muda} erro={erros.email} autoComplete="email" />
              <Campo nome="telefone" rotulo="Telefone (opcional)" type="tel" value={d.telefone} onChange={muda} erro={erros.telefone} autoComplete="tel" />
              <Campo nome="agencia" rotulo="Agência ou rede" value={d.agencia} onChange={muda} erro={erros.agencia} autoComplete="organization" />
              <label className={`campo campo--plano ${erros.plano ? 'campo--erro' : ''}`}>
                <span>Plano que te interessa</span>
                <select name="plano" value={d.plano} onChange={muda} aria-invalid={!!erros.plano}>
                  <option value="" disabled>Escolhe um plano</option>
                  {PLANOS.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
                {erros.plano && <small>{erros.plano}</small>}
              </label>
            </div>
            <label className={`consentimento ${erros.consentimento ? 'campo--erro' : ''}`}>
              <input type="checkbox" name="consentimento" checked={d.consentimento} onChange={muda} />
              <span>Autorizo a Nº 5 a guardar estes dados e a contactar-me sobre o lançamento da N5 Clara.</span>
            </label>
            {erros.consentimento && <small className="erro-solto">{erros.consentimento}</small>}
            <button className="botao prevenda-botao" type="submit" disabled={estado === 'a-enviar'}>
              {estado === 'a-enviar' ? 'A enviar…' : 'Quero a Clara'}
            </button>
            {estado === 'falhou' && <p className="erro-solto">Não conseguimos enviar. Tenta outra vez daqui a pouco.</p>}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Lista() {
  return (
    <section id="lista" className="seccao escuro prevenda">
      <div className="contentor prevenda-grelha">
        <div className="prevenda-texto">
          <p className="eyebrow">Lista de espera</p>
          <h2>1 de dezembro. A Clara começa a trabalhar contigo.</h2>
          <p className="prevenda-lead">
            Entra na lista de espera e és dos primeiros a ter a tua assistente comercial: leads respondidas, dia organizado e coaching das tuas chamadas.
          </p>
          <Contagem />
        </div>
        <Formulario />
      </div>
    </section>
  )
}
