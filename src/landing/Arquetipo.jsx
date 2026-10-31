import { motion, AnimatePresence } from 'motion/react'
import { useRef, useState } from 'react'
import { PERGUNTAS, ARQUETIPOS, NAO_SEI, NOMES_PLANO, escolher, planoDe, resumo, lerDor, tituloDe, reacaoDe, mensagemFinal } from '../logica/arquetipo.js'
import { PERGUNTAS as PERGUNTAS_DIAGNOSTICO, lerNumero, calcularDiagnostico } from '../logica/diagnostico.js'
import { codificar } from '../logica/netlify.js'
import { origemDe } from '../logica/origem.js'
import { marcar } from '../legal/analitica.js'
import { evento } from '../legal/pixel.js'
import Lista from '../secoes/Lista.jsx'
import Rodape from '../secoes/Rodape.jsx'
import AvisoCookies from '../legal/AvisoCookies.jsx'
import { ClaraAvatar } from '../ilustracoes/Clara.jsx'
import { TopoLanding, HeroLanding } from './Landing.jsx'

/* as contas usam as perguntas e os limites do diagnóstico */
const CONTAS = ['faturacao', 'negocios', 'objetivo'].map(id => PERGUNTAS_DIAGNOSTICO.find(q => q.id === id))

/* uma pergunta por ecrã, com «Voltar»; «Não sei» passa à seguinte sem dar pontos.
   A Clara responde a cada resposta com uma frase, no topo da pergunta seguinte */
function Questionario({ dor, aoAcabar }) {
  const [i, setI] = useState(0)
  const [r, setR] = useState({})
  const [reacao, setReacao] = useState(null)
  const iniciado = useRef(false)
  const q = PERGUNTAS[i]
  const responder = v => {
    const novo = { ...r, [q.id]: v }
    setR(novo)
    if (!iniciado.current) {
      iniciado.current = true
      marcar('arquetipo_iniciado', { dor })
    }
    marcar('arquetipo_pergunta', { n: i + 1, id: q.id, nao_sei: v === NAO_SEI })
    setReacao(reacaoDe(q.id, v))
    if (i + 1 < PERGUNTAS.length) setI(i + 1)
    else aoAcabar(novo)
  }
  const voltar = () => {
    setReacao(null)
    setI(i - 1)
  }
  return (
    <div className="cartao diag-cartao">
      <div className="diag-progresso" aria-hidden="true"><span style={{ width: `${(i / PERGUNTAS.length) * 100}%` }} /></div>
      <div className="diag-cabeca">
        <span className="eyebrow">Pergunta {i + 1} de {PERGUNTAS.length}</span>
        {i > 0 && <button type="button" className="diag-voltar" onClick={voltar}>← Voltar</button>}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={q.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }}>
          {reacao && (
            <div className="arq-reacao" aria-live="polite">
              <ClaraAvatar tamanho={32} />
              <p>{reacao}</p>
            </div>
          )}
          <h3 className="diag-pergunta">{q.texto}</h3>
          <div className="diag-opcoes" role="group" aria-label={q.texto}>
            {q.opcoes.map(([v, texto]) => (
              <button key={v} type="button" className={`prioridade ${r[q.id] === v ? 'prioridade--ligada' : ''}`} aria-pressed={r[q.id] === v} onClick={() => responder(v)}>
                <span className="prioridade-marca" aria-hidden="true">{r[q.id] === v ? '✓' : ''}</span>{texto}
              </button>
            ))}
            <button type="button" className="diag-nao-sei" onClick={() => responder(NAO_SEI)}>Não sei</button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* «As tuas contas»: três números da pessoa e o bloco «objetivo» do diagnóstico; sem os três, não há contas */
function Contas({ maratonista, aoFazer }) {
  const [texto, setTexto] = useState({})
  const [naoSei, setNaoSei] = useState({})
  const [bloco, setBloco] = useState(undefined) // undefined: ainda não fez as contas; null: faltam números
  const pronto = CONTAS.every(c => naoSei[c.id] || String(texto[c.id] ?? '').trim() !== '')

  const fazer = e => {
    e.preventDefault()
    const contas = Object.fromEntries(CONTAS.map(c => [c.id, naoSei[c.id] ? NAO_SEI : lerNumero(texto[c.id], c.max)]))
    const b = calcularDiagnostico(contas).blocos.find(x => x.id === 'objetivo') || null
    setBloco(b)
    aoFazer(contas, !!b)
  }

  return (
    <form className="cartao arq-contas" onSubmit={fazer}>
      <div>
        <p className="eyebrow">As tuas contas · opcional</p>
        <h3>Quantos negócios te faltam para o teu objetivo?</h3>
        <p className="arq-contas-sub">Com os teus números, sem médias de ninguém.</p>
      </div>
      {CONTAS.map(c => (
        <div key={c.id} className="arq-campo">
          <label className="campo">
            <span>{c.texto}</span>
            <span className="diag-numero-linha">
              <input
                inputMode="numeric" autoComplete="off" disabled={!!naoSei[c.id]}
                value={naoSei[c.id] ? '' : texto[c.id] ?? ''}
                placeholder={naoSei[c.id] ? 'Não sei' : c.unidade === '€' ? 'Ex.: 30000' : 'Ex.: 12'}
                onChange={e => setTexto(x => ({ ...x, [c.id]: e.target.value }))}
              />
              <span className="diag-unidade">{c.unidade}</span>
            </span>
          </label>
          <button type="button" className="diag-nao-sei" aria-pressed={!!naoSei[c.id]} onClick={() => setNaoSei(x => ({ ...x, [c.id]: !x[c.id] }))}>
            {naoSei[c.id] ? 'Escrever o número' : 'Não sei'}
          </button>
        </div>
      ))}
      <div className="diag-acoes">
        <button type="submit" className="botao" disabled={!pronto}>Fazer as contas</button>
      </div>
      {bloco && (
        <div className="arq-contas-resultado">
          {maratonista && <p className="arq-contas-nota">É com estes números que a Clara monta o teu calendário de performance.</p>}
          <div className="cartao diag-bloco">
            <span className="numero diag-bloco-num">{bloco.numero}</span>
            <span className="diag-bloco-rotulo">{bloco.rotulo}</span>
            <p>{bloco.texto}</p>
          </div>
        </div>
      )}
      {bloco === null && <p className="diag-vazio">Sem os três números não há contas. A Clara faz-tas com os teus números a partir do primeiro dia.</p>}
    </form>
  )
}

function Resultado({ res, plano, aoRefazer, aoContas }) {
  const a = ARQUETIPOS[res.arquetipo]
  if (!a) {
    return (
      <motion.div className="cartao arq-vazio" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <p className="eyebrow">O teu resultado</p>
        <h3>Com tantos «não sei», ainda não conseguimos dizer.</h3>
        <p>Pensa só no que fizeste ontem e na última semana, mesmo que não tenham sido dias normais.</p>
        <button type="button" className="botao" onClick={aoRefazer}>Refazer o teste</button>
      </motion.div>
    )
  }
  const segundo = ARQUETIPOS[res.segundo]
  const m = mensagemFinal(a.id, plano)
  return (
    <motion.div className="diag-resultado" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="cartao arq-cartao">
        <p className="eyebrow">O teu resultado · {a.dor}</p>
        <div className="arq-quem">
          <h2 className="arq-nome">O {a.nome}</h2>
          <span className="arq-feminino">ou a {a.feminino}</span>
        </div>
        {segundo && <span className="arq-segundo">com um pé de {segundo.nome}</span>}
        <p className="arq-frase">{a.frase}</p>
        <p className="arq-reconheces"><b>Reconheces-te se:</b> {a.reconheces}</p>
        <dl className="arq-linhas">
          <div><dt>Ponto forte</dt><dd>{a.forte}</dd></div>
          <div><dt>Onde perdes negócios</dt><dd>{a.perdes}</dd></div>
          <div className="arq-linha--clara"><dt>O que a Clara faz</dt><dd>{a.clara}</dd></div>
        </dl>
        {/* noutro separador, para o resultado e o anúncio de origem continuarem aqui */}
        <div className="arq-ver">
          {a.ver.map(v => <a key={v.href} href={v.href} target="_blank" rel="noopener">{v.texto} →</a>)}
        </div>
        {/* o plano no mesmo cartão, dito pela Clara: separado ficava longe e pouca gente lá chegava */}
        <div className="arq-oferta">
          <div className="arq-oferta-clara">
            <ClaraAvatar tamanho={44} viva />
            <p>
              {m.abertura} Para ti, o plano certo é {m.artigo} <b>{m.nome}</b>. {m.porque} {m.oferta}
            </p>
          </div>
          {m.preco && (
            <div className="arq-oferta-preco">
              <small>{m.preco.rotulo}</small>
              {m.preco.antes && <s aria-label={`antes ${m.preco.antes}`}>{m.preco.antes}</s>}
              <b>{m.preco.agora}</b>
              {m.preco.nota && <span>{m.preco.nota}</span>}
            </div>
          )}
          <div className="diag-acoes">
            <a href="#lista" className="botao">Quero a {NOMES_PLANO[plano]}</a>
            <button type="button" className="diag-nao-sei" onClick={aoRefazer}>Refazer o teste</button>
          </div>
        </div>
      </div>
      <Contas maratonista={a.id === 'maratonista'} aoFazer={aoContas} />
    </motion.div>
  )
}

/* guarda as respostas sem nome nem contacto, mesmo de quem não se inscreve: a distribuição dos arquétipos e o anúncio de cada um */
async function guardarAnonimo(respostas) {
  try {
    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: codificar({ 'form-name': 'diagnostico', respostas, origem: origemDe(window.location.pathname, window.location.search), 'empresa-site': '' }),
    })
  } catch { /* o resultado aparece mesmo sem guardar */ }
}

export default function ArquetipoPagina({ p }) {
  const [dor] = useState(() => lerDor(window.location.search))
  const [fim, setFim] = useState(null) // { respostas, res, plano }
  const [contas, setContas] = useState(null)
  const contasMarcadas = useRef(false)
  const caixa = useRef(null)

  const acabar = respostas => {
    const res = escolher(respostas, dor)
    const plano = res.arquetipo ? planoDe(respostas, res.arquetipo) : null
    setFim({ respostas, res, plano })
    setContas(null)
    contasMarcadas.current = false
    marcar('arquetipo_resultado', { arquetipo: res.arquetipo, segundo: res.segundo, plano, dor })
    guardarAnonimo(resumo(respostas, res))
    if (res.arquetipo) {
      // públicos de remarketing por arquétipo; só sai com os cookies de marketing aceites
      evento('ViewContent', { content_name: `arquetipo-${res.arquetipo}`, content_category: 'arquetipo' })
      window.dispatchEvent(new CustomEvent('escolher-plano', { detail: plano }))
    }
    caixa.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const fazerContas = (c, comBloco) => {
    setContas(c)
    if (comBloco && !contasMarcadas.current) {
      contasMarcadas.current = true
      marcar('arquetipo_contas')
    }
  }

  const a = fim && ARQUETIPOS[fim.res.arquetipo]
  return (
    <>
      <TopoLanding como={{ href: '#teste', texto: 'Teste' }} />
      <main>
        <HeroLanding p={{ ...p, h1: tituloDe(dor) }} primeiro={{ href: '#teste', texto: 'Fazer o teste' }} segundo={{ href: '#lista', texto: 'Ver a oferta' }} />
        <section id="teste" ref={caixa} className="seccao diag">
          <div className="contentor diag-contentor">
            {fim
              ? <Resultado res={fim.res} plano={fim.plano} aoRefazer={() => setFim(null)} aoContas={fazerContas} />
              : <Questionario dor={dor} aoAcabar={acabar} />}
          </div>
        </section>
        <Lista aviso={a?.aviso} extra={fim ? { diagnostico: resumo(fim.respostas, fim.res, contas || undefined) } : undefined} />
      </main>
      <Rodape />
      <AvisoCookies />
    </>
  )
}
