import { motion, AnimatePresence } from 'motion/react'
import { useRef, useState } from 'react'
import { PERGUNTAS, planoDoConsultor, limparRespostas } from '../logica/inquerito.js'
import { erroDoCampo } from '../logica/validar.js'
import { codificar } from '../logica/netlify.js'
import { origemDe } from '../logica/origem.js'
import { emTeste } from '../legal/teste.js'
import { marcar } from '../legal/analitica.js'
import Rodape from '../secoes/Rodape.jsx'
import AvisoCookies from '../legal/AvisoCookies.jsx'
import { ClaraAvatar } from '../ilustracoes/Clara.jsx'
import { TopoLanding, HeroLanding } from './Landing.jsx'

const FORMULARIO = 'inquerito-clara'

/* o vídeo do produto: carrega só quando se carrega no play, com som */
function Video({ p }) {
  const ref = useRef(null)
  const [aTocar, setATocar] = useState(false)
  const tocar = () => {
    const v = ref.current
    if (!v) return
    v.play()
    setATocar(true)
    marcar('video_play')
  }
  return (
    <section id="video" className="seccao video-seccao">
      <div className="contentor">
        <div className="seccao-cabeca">
          <p className="eyebrow">{p.eyebrow}</p>
          <h2>{p.titulo}</h2>
          <p>{p.texto}</p>
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

/* cada dor do consultor e o que a Clara faz com ela, numa frase */
function Dores({ p }) {
  return (
    <section id="dores" className="seccao escuro inq-dores">
      <div className="contentor">
        <div className="seccao-cabeca">
          <p className="eyebrow">{p.eyebrow}</p>
          <h2>{p.titulo}</h2>
        </div>
        <ul className="inq-dores-grelha">
          {p.itens.map((d, i) => (
            <motion.li
              key={d.dor}
              className="inq-dor"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ type: 'spring', stiffness: 160, damping: 20, delay: i * 0.08 }}
            >
              <p className="inq-dor-antes">{d.dor}</p>
              <p className="inq-dor-clara"><ClaraAvatar tamanho={26} /> <span>{d.clara}</span></p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* uma pergunta de cada vez: escolha única avança logo; várias e texto têm «Seguinte» e «Saltar» */
function Pergunta({ q, valor, aoResponder }) {
  const [varias, setVarias] = useState(Array.isArray(valor) ? valor : [])
  const [texto, setTexto] = useState(typeof valor === 'string' ? valor : '')

  if (q.tipo === 'opcoes') {
    return (
      <div className="diag-opcoes" role="group" aria-label={q.texto}>
        {q.opcoes.map(([v, r]) => (
          <button key={v} type="button" className={`prioridade ${valor === v ? 'prioridade--ligada' : ''}`} aria-pressed={valor === v} onClick={() => aoResponder(v)}>
            <span className="prioridade-marca" aria-hidden="true">{valor === v ? '✓' : ''}</span>{r}
          </button>
        ))}
      </div>
    )
  }

  if (q.tipo === 'varias') {
    const cheio = varias.length >= q.max
    const alternar = v => setVarias(x => (x.includes(v) ? x.filter(y => y !== v) : cheio ? x : [...x, v]))
    return (
      <div className="diag-opcoes" role="group" aria-label={q.texto}>
        {q.opcoes.map(([v, r]) => {
          const ligada = varias.includes(v)
          return (
            <button key={v} type="button" className={`prioridade ${ligada ? 'prioridade--ligada' : ''}`} aria-pressed={ligada} disabled={!ligada && cheio} onClick={() => alternar(v)}>
              <span className="prioridade-marca" aria-hidden="true">{ligada ? varias.indexOf(v) + 1 : ''}</span>{r}
            </button>
          )
        })}
        <div className="diag-acoes">
          <button type="button" className="botao" disabled={!varias.length} onClick={() => aoResponder(varias)}>Seguinte</button>
          <button type="button" className="diag-nao-sei" onClick={() => aoResponder([])}>Saltar</button>
        </div>
      </div>
    )
  }

  return (
    <form className="diag-numero" onSubmit={e => { e.preventDefault(); aoResponder(texto.trim()) }}>
      <label className="campo inq-texto">
        <span>{q.ajuda}</span>
        <textarea value={texto} onChange={e => setTexto(e.target.value.slice(0, q.max))} rows={4} maxLength={q.max} placeholder="Ex.: deixar de perder leads ao fim de semana" />
      </label>
      <div className="diag-acoes">
        <button type="submit" className="botao" disabled={!texto.trim()}>Seguinte</button>
        <button type="button" className="diag-nao-sei" onClick={() => aoResponder('')}>Saltar</button>
      </div>
    </form>
  )
}

/* quem volta do último passo entra na última pergunta, com as respostas que já deu */
function Questionario({ inicial, aoAcabar }) {
  const [i, setI] = useState(inicial ? PERGUNTAS.length - 1 : 0)
  const [r, setR] = useState(inicial || {})
  const q = PERGUNTAS[i]
  const responder = v => {
    const novo = { ...r, [q.id]: v }
    setR(novo)
    if (i === 0 && !r[q.id]) marcar('inquerito_iniciado')
    marcar('inquerito_pergunta', { pergunta: q.id, n: i + 1 })
    if (i + 1 < PERGUNTAS.length) setI(i + 1)
    else aoAcabar(novo)
  }
  return (
    <div className="cartao diag-cartao">
      <div className="diag-progresso" aria-hidden="true"><span style={{ width: `${(i / (PERGUNTAS.length + 1)) * 100}%` }} /></div>
      <div className="diag-cabeca">
        <span className="eyebrow">Pergunta {i + 1} de {PERGUNTAS.length}</span>
        {i > 0 && <button type="button" className="diag-voltar" onClick={() => setI(i - 1)}>← Voltar</button>}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={q.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }}>
          <h3 className="diag-pergunta">{q.texto}</h3>
          <Pergunta q={q} valor={r[q.id]} aoResponder={responder} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* o último passo: para onde enviamos o voucher. O consentimento é dado no botão, logo abaixo do aviso */
function Contacto({ respostas, aoEnviar, aoVoltar }) {
  const [d, setD] = useState({ nome: '', email: '', telefone: '' })
  const [erros, setErros] = useState({})
  const [estado, setEstado] = useState('pronto')
  const mudar = campo => e => setD(x => ({ ...x, [campo]: e.target.value }))

  const enviar = async e => {
    e.preventDefault()
    const novos = {}
    for (const campo of ['nome', 'email']) {
      const erro = erroDoCampo(campo, d)
      if (erro) novos[campo] = erro
    }
    if (d.telefone.trim()) {
      const erro = erroDoCampo('telefone', d)
      if (erro) novos.telefone = erro
    }
    setErros(novos)
    if (Object.keys(novos).length) {
      marcar('inquerito_com_erros', { campos: Object.keys(novos).join(',') })
      return
    }
    setEstado('a-enviar')
    try {
      const resp = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: codificar({
          'form-name': FORMULARIO,
          nome: d.nome.trim(),
          email: d.email.trim(),
          telefone: d.telefone.trim(),
          respostas: JSON.stringify(limparRespostas(respostas)),
          consentimento: true,
          origem: origemDe(window.location.pathname, window.location.search),
          teste: emTeste() ? '1' : '',
          'empresa-site': e.target.elements['empresa-site']?.value || '',
        }),
      })
      if (!resp.ok) throw new Error(String(resp.status))
      aoEnviar(d.email.trim())
    } catch {
      setEstado('erro')
      marcar('inquerito_falhou')
    }
  }

  const campo = (id, rotulo, props) => (
    <label className={`campo ${erros[id] ? 'campo--erro' : ''}`}>
      <span>{rotulo}</span>
      <input value={d[id]} onChange={mudar(id)} aria-invalid={!!erros[id]} {...props} />
      {erros[id] && <small>{erros[id]}</small>}
    </label>
  )

  return (
    <form className="cartao diag-cartao inq-contacto" onSubmit={enviar} noValidate>
      <div className="diag-progresso" aria-hidden="true"><span style={{ width: `${(PERGUNTAS.length / (PERGUNTAS.length + 1)) * 100}%` }} /></div>
      <div className="diag-cabeca">
        <span className="eyebrow">Último passo</span>
        <button type="button" className="diag-voltar" onClick={aoVoltar}>← Voltar</button>
      </div>
      <h3 className="diag-pergunta">Para onde enviamos o teu voucher e o teu plano?</h3>
      {campo('nome', 'O teu nome', { autoComplete: 'name', placeholder: 'Nome e apelido' })}
      {campo('email', 'O teu email', { type: 'email', inputMode: 'email', autoComplete: 'email', autoCapitalize: 'none', spellCheck: false, placeholder: 'nome@exemplo.pt' })}
      {campo('telefone', 'O teu telemóvel (opcional)', { type: 'tel', inputMode: 'tel', autoComplete: 'tel', placeholder: '912 345 678' })}
      <p className="so-leitores"><label>Não preenchas: <input name="empresa-site" tabIndex={-1} autoComplete="off" /></label></p>
      <p className="clara-aviso">Ao carregares em «Receber o voucher», autorizas a Nº 5 a guardar as tuas respostas e estes dados, a enviar-te o voucher e o plano por email e a contactar-te sobre o lançamento da N5 Clara, nos termos da <a href="/privacidade/" target="_blank" rel="noreferrer">política de privacidade</a>.</p>
      {estado === 'erro' && <p className="erro-solto" role="alert">Não conseguimos enviar. Confirma a ligação à internet e tenta outra vez.</p>}
      <div className="diag-acoes">
        <button type="submit" className="botao" disabled={estado === 'a-enviar'}>{estado === 'a-enviar' ? 'A enviar…' : 'Receber o voucher'}</button>
      </div>
    </form>
  )
}

/* o plano feito com as respostas, igual ao do email */
function Resultado({ plano: p, email }) {
  return (
    <motion.div className="diag-resultado inq-resultado" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="cartao inq-enviado">
        <ClaraAvatar tamanho={48} viva />
        <div>
          <p className="eyebrow">Voucher enviado</p>
          <p>Enviámos o voucher do 1.º mês da Clara Elite para <b>{email}</b>, com este plano. Se não o vires em alguns minutos, procura no spam ou nas promoções.</p>
        </div>
      </div>
      <div className="diag-resultado-topo">
        <div>
          <p className="eyebrow">O teu plano</p>
          <h3>{p.titulo}.</h3>
        </div>
      </div>
      {p.pontos.length > 0 && (
        <div className="diag-blocos">
          {p.pontos.map(x => (
            <div key={x.id} className="cartao diag-bloco">
              <span className="diag-bloco-rotulo">{x.texto}</span>
              <p className="inq-antes">Hoje: {x.antes}</p>
              <p className="inq-depois">Com a Clara: {x.depois}</p>
            </div>
          ))}
        </div>
      )}
      <div>
        <p className="eyebrow diag-parte">O teu dia com a Clara</p>
        <ol className="inq-linha">
          {p.dia.map(m => (
            <li key={m.id}>
              <span className="inq-quando">{m.quando}</span>
              <b>{m.titulo}</b>
              <span>{m.texto}</span>
            </li>
          ))}
        </ol>
      </div>
      <div>
        <p className="eyebrow diag-parte">As tuas primeiras 4 semanas</p>
        <ol className="inq-semanas">
          {p.semanas.map(s => (
            <li key={s.n} className="cartao">
              <span className="inq-quando">Semana {s.n}</span>
              <b>{s.titulo}</b>
              <span>{s.texto}</span>
            </li>
          ))}
        </ol>
      </div>
      {p.pedidos.length > 0 && (
        <p className="inq-pedidos">Também te custa: {p.pedidos.join('; ').toLowerCase()}. A Clara ainda não faz isto e ficou registado para decidirmos o que desenvolvemos a seguir.</p>
      )}
      <div className="cartao diag-plano">
        <p className="eyebrow">Depois do mês oferecido</p>
        <b>{p.nomePlano}</b>
        <p>{p.depois}</p>
        <div className="diag-acoes">
          <a href="/" className="botao botao--linha">Ver tudo o que a Clara faz</a>
        </div>
      </div>
    </motion.div>
  )
}

export default function InqueritoPagina({ p }) {
  const [passo, setPasso] = useState('perguntas')
  const [respostas, setRespostas] = useState(null)
  const [email, setEmail] = useState('')
  const caixa = useRef(null)
  const subir = () => caixa.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const acabar = r => {
    setRespostas(r)
    setPasso('contacto')
    marcar('inquerito_respondido')
    subir()
  }
  const enviado = e => {
    setEmail(e)
    setPasso('plano')
    marcar('inquerito_enviado', { plano: planoDoConsultor(respostas).plano })
    subir()
  }

  return (
    <>
      <TopoLanding como={{ href: '#video', texto: 'Vídeo' }} cta={{ href: '#inquerito', texto: 'Responder' }} />
      <main>
        <HeroLanding p={p} primeiro={{ href: '#inquerito', texto: 'Responder ao inquérito' }} segundo={{ href: '#video', texto: 'Ver o vídeo' }} urgencia={false} />
        <Video p={p.video} />
        <Dores p={p.dores} />
        <section id="inquerito" ref={caixa} className="seccao diag">
          <div className="contentor diag-contentor">
            {passo !== 'plano' && (
              <div className="inq-voucher">
                <p className="eyebrow">{p.voucher.eyebrow}</p>
                <h2>{p.voucher.titulo}</h2>
                <p>{p.voucher.texto}</p>
              </div>
            )}
            {passo === 'perguntas' && <Questionario inicial={respostas} aoAcabar={acabar} />}
            {passo === 'contacto' && <Contacto respostas={respostas} aoEnviar={enviado} aoVoltar={() => setPasso('perguntas')} />}
            {passo === 'plano' && <Resultado plano={planoDoConsultor(respostas)} email={email} />}
          </div>
        </section>
      </main>
      <Rodape />
      <AvisoCookies />
    </>
  )
}
