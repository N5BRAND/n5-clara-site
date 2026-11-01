import { motion, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { lerPerfil } from './paginas.js'
import { TopoLanding, HeroLanding } from './Landing.jsx'
import Lista from '../secoes/Lista.jsx'
import Rodape from '../secoes/Rodape.jsx'
import AvisoCookies from '../legal/AvisoCookies.jsx'

/* a conta: CRM + IA para os proprietários + IA para o dia = Clara */
function Conta({ c }) {
  const pecas = c.parcelas.flatMap((x, i) => [
    ...(i ? [{ sinal: '+' }] : []),
    { ...x },
  ])
  return (
    <section id="como" data-seccao="conta" className="seccao tudo-conta">
      <div className="contentor">
        <div className="seccao-cabeca">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2>{c.titulo}</h2>
        </div>
        <div className="tudo-soma">
          {pecas.map((x, i) => x.sinal
            ? <span key={i} className="tudo-sinal" aria-hidden="true">{x.sinal}</span>
            : (
              <article key={x.nome} className="tudo-parcela">
                <h3>{x.nome}</h3>
                <p>{x.texto}</p>
              </article>
            ))}
          <span className="tudo-sinal" aria-hidden="true">=</span>
          <article className="tudo-parcela tudo-resultado">
            <h3>{c.resultado.nome}</h3>
            <p>{c.resultado.texto}</p>
          </article>
        </div>
      </div>
    </section>
  )
}

/* hoje → com a Clara, uma linha por coisa que muda */
function Excel({ e }) {
  return (
    <section data-seccao="excel" className="seccao escuro tudo-excel">
      <div className="contentor">
        <div className="seccao-cabeca">
          <p className="eyebrow">{e.eyebrow}</p>
          <h2>{e.titulo}</h2>
        </div>
        <div className="tudo-excel-cabeca" aria-hidden="true"><span>Hoje</span><span /><span>Com a Clara</span></div>
        <ul className="tudo-excel-linhas">
          {e.linhas.map(([antes, depois]) => (
            <li key={antes}>
              <span className="tudo-antes"><span className="so-leitores">Hoje: </span>{antes}</span>
              <span className="tudo-seta" aria-hidden="true">→</span>
              <b><span className="so-leitores">Com a Clara: </span>{depois}</b>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* a ficha do anúncio 06: as linhas entram uma a uma quando a ficha aparece no ecrã */
function Ficha({ f }) {
  const ref = useRef(null)
  const visivel = useInView(ref, { amount: 0.4, once: true })
  const reduzir = useReducedMotion()
  return (
    <section data-seccao="ficha" className="seccao tudo-ficha">
      <div className="contentor tudo-ficha-grelha">
        <div className="seccao-cabeca">
          <p className="eyebrow">{f.eyebrow}</p>
          <h2>{f.titulo}</h2>
          <p>{f.texto}</p>
          <p className="lp-exemplo">{f.exemplo}</p>
        </div>
        <div ref={ref} className="tudo-ficha-cartao">
          <div className="tudo-ficha-topo">
            <div>
              <b>{f.nome}</b>
              <span>{f.sub}</span>
            </div>
            <div className="tudo-ficha-pontos" title="Prioridade de acompanhamento">
              <b>{f.pontuacao}</b>
              <span>de 100</span>
            </div>
          </div>
          {f.linhas.map((l, i) => (
            <motion.div
              key={l.rotulo}
              className="tudo-ficha-linha"
              initial={reduzir ? false : { opacity: 0, y: 12 }}
              animate={visivel || reduzir ? { opacity: 1, y: 0 } : undefined}
              transition={{ type: 'spring', stiffness: 200, damping: 24, delay: 0.15 + i * 0.35 }}
            >
              <span className="tudo-ficha-rotulo">{l.rotulo}</span>
              <p>{l.texto}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* para quem está numa rede: o CRM da marca continua; o copiloto com o texto da página /crm/ */
function CrmMarca({ m }) {
  return (
    <section data-seccao="crm-marca" className="seccao tudo-marca">
      <div className="contentor tudo-marca-grelha">
        <div className="seccao-cabeca">
          <p className="eyebrow">{m.eyebrow}</p>
          <h2>{m.titulo}</h2>
          <p>{m.texto}</p>
        </div>
        <aside className="cartao tudo-marca-nota">
          <p className="eyebrow">{m.nota.titulo}</p>
          <p>{m.nota.texto}</p>
        </aside>
      </div>
    </section>
  )
}

/* página «Tudo num sítio» (/tudo/): o topo muda com ?perfil=, o resto é igual para todos */
export default function TudoPagina({ p }) {
  const [perfil] = useState(() => lerPerfil(window.location.search))
  const topo = p.perfis[perfil]

  /* o plano da página fica escolhido no formulário */
  useEffect(() => {
    const t = setTimeout(() => window.dispatchEvent(new CustomEvent('escolher-plano', { detail: p.plano })), 0)
    return () => clearTimeout(t)
  }, [p.plano])

  return (
    <>
      <TopoLanding />
      <main>
        <HeroLanding p={{ ...p, ...topo }} cena={p.cena} />
        <Conta c={p.conta} />
        <Excel e={p.excel} />
        <Ficha f={p.ficha} />
        <CrmMarca m={p.crmMarca} />
        <Lista reserva={p.reserva} plano={p.plano} />
        <section data-seccao="mais" className="lp-mais">
          <div className="contentor">
            <a href="/">Ver tudo o que a Clara faz →</a>
          </div>
        </section>
      </main>
      <Rodape />
      <AvisoCookies />
    </>
  )
}
