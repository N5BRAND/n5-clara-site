import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { PERGUNTAS, NAO_SEI, lerNumero, calcularDiagnostico } from '../logica/diagnostico.js'
import { codificar } from '../logica/netlify.js'
import { marcar } from '../legal/analitica.js'
import Lista from '../secoes/Lista.jsx'
import Rodape from '../secoes/Rodape.jsx'
import AvisoCookies from '../legal/AvisoCookies.jsx'
import { ClaraAvatar } from '../ilustracoes/Clara.jsx'
import { TopoLanding, HeroLanding } from './Landing.jsx'

const NOMES_PLANO = { clara: 'Clara', pro: 'Clara Pro', elite: 'Clara Elite' }

/* uma pergunta de cada vez; «Não sei» passa à seguinte */
function Pergunta({ q, valor, aoResponder }) {
  const [texto, setTexto] = useState(valor == null ? '' : String(valor))
  const [varias, setVarias] = useState(Array.isArray(valor) ? valor : [])
  const entrada = useRef(null)
  useEffect(() => { if (q.tipo === 'numero') entrada.current?.focus({ preventScroll: true }) }, [q])

  if (q.tipo === 'opcoes') {
    return (
      <div className="diag-opcoes" role="group" aria-label={q.texto}>
        {q.opcoes.map(([v, r]) => (
          <button key={v} type="button" className={`prioridade ${valor === v ? 'prioridade--ligada' : ''}`} aria-pressed={valor === v} onClick={() => aoResponder(v)}>
            <span className="prioridade-marca" aria-hidden="true">{valor === v ? '✓' : ''}</span>{r}
          </button>
        ))}
        <button type="button" className="diag-nao-sei" onClick={() => aoResponder(NAO_SEI)}>Não sei</button>
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
          <button type="button" className="botao" disabled={!varias.length} onClick={() => aoResponder(varias)}>Ver o meu diagnóstico</button>
          <button type="button" className="diag-nao-sei" onClick={() => aoResponder([])}>Saltar</button>
        </div>
      </div>
    )
  }

  const seguir = e => {
    e.preventDefault()
    aoResponder(lerNumero(texto, q.max))
  }
  return (
    <form className="diag-numero" onSubmit={seguir}>
      <label className="campo">
        <span>{q.unidade === '€' ? 'Valor em euros' : 'Número'}</span>
        <span className="diag-numero-linha">
          <input ref={entrada} inputMode="numeric" value={texto} onChange={e => setTexto(e.target.value)} placeholder={q.unidade === '€' ? 'Ex.: 30000' : 'Ex.: 12'} autoComplete="off" />
          <span className="diag-unidade">{q.unidade}</span>
        </span>
      </label>
      <div className="diag-acoes">
        <button type="submit" className="botao" disabled={texto.trim() === ''}>Seguinte</button>
        <button type="button" className="diag-nao-sei" onClick={() => aoResponder(NAO_SEI)}>Não sei</button>
      </div>
    </form>
  )
}

function Resultado({ res, aoRefazer }) {
  return (
    <motion.div className="diag-resultado" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="diag-resultado-topo">
        <ClaraAvatar tamanho={56} viva />
        <div>
          <p className="eyebrow">O teu diagnóstico</p>
          <h3>Feito com os teus números, sem médias de ninguém.</h3>
        </div>
      </div>
      {res.blocos.length > 0 ? (
        <div className="diag-blocos">
          {res.blocos.map(b => (
            <div key={b.id} className="cartao diag-bloco">
              <span className="numero diag-bloco-num">{b.numero}</span>
              <span className="diag-bloco-rotulo">{b.rotulo}</span>
              <p>{b.texto}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="diag-vazio">Sem números não há contas, mas há caminho: a Clara mede tudo isto por ti a partir do primeiro dia.</p>
      )}
      {res.focos.length > 0 && (
        <div className="diag-focos">
          <p className="eyebrow">Onde a Clara te ajuda primeiro</p>
          <ul>
            {res.focos.map(f => (
              <li key={f.id}>
                <b>{f.titulo}</b>
                <span>{f.texto}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="cartao diag-plano">
        <p className="eyebrow">O plano que te serve melhor</p>
        <b>{NOMES_PLANO[res.plano]}</b>
        <p>Já o deixámos escolhido no formulário. Se te inscreveres, guardamos estas respostas para a tua sessão de configuração.</p>
        <div className="diag-acoes">
          <a href="#lista" className="botao">Quero a Clara</a>
          <button type="button" className="diag-nao-sei" onClick={aoRefazer}>Refazer o diagnóstico</button>
        </div>
      </div>
    </motion.div>
  )
}

/* guarda as respostas sem nome nem contacto, para sabermos como trabalham os consultores */
async function guardarAnonimo(resumo) {
  try {
    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: codificar({ 'form-name': 'diagnostico', respostas: resumo, origem: window.location.pathname, 'empresa-site': '' }),
    })
  } catch { /* o diagnóstico continua a aparecer mesmo sem guardar */ }
}

function Questionario({ aoAcabar }) {
  const [i, setI] = useState(0)
  const [r, setR] = useState({})
  const q = PERGUNTAS[i]
  const responder = v => {
    const novo = { ...r, [q.id]: v }
    setR(novo)
    if (i === 0) marcar('diagnostico_iniciado')
    if (i + 1 < PERGUNTAS.length) setI(i + 1)
    else aoAcabar(novo)
  }
  return (
    <div className="cartao diag-cartao">
      <div className="diag-progresso" aria-hidden="true"><span style={{ width: `${(i / PERGUNTAS.length) * 100}%` }} /></div>
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

export default function DiagnosticoPagina({ p }) {
  const [res, setRes] = useState(null)
  const caixa = useRef(null)

  const acabar = respostas => {
    const r = calcularDiagnostico(respostas)
    setRes(r)
    marcar('diagnostico_concluido', { plano: r.plano, blocos: r.blocos.length })
    guardarAnonimo(r.resumo)
    window.dispatchEvent(new CustomEvent('escolher-plano', { detail: r.plano }))
    caixa.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <TopoLanding como={{ href: '#diagnostico', texto: 'Diagnóstico' }} />
      <main>
        <HeroLanding p={p} segundo={{ href: '#diagnostico', texto: 'Começar o diagnóstico' }} />
        <section id="diagnostico" ref={caixa} className="seccao diag">
          <div className="contentor diag-contentor">
            {res ? <Resultado res={res} aoRefazer={() => setRes(null)} /> : <Questionario aoAcabar={acabar} />}
          </div>
        </section>
        <Lista extra={res ? { diagnostico: res.resumo } : undefined} />
      </main>
      <Rodape />
      <AvisoCookies />
    </>
  )
}
