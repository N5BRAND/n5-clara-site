import { motion, useScroll, useMotionValueEvent } from 'motion/react'
import { useEffect, useState } from 'react'
import Simbolo from '../marca/Simbolo.jsx'
import Copiloto from '../secoes/Copiloto.jsx'
import Lista from '../secoes/Lista.jsx'
import Rodape from '../secoes/Rodape.jsx'
import AvisoCookies from '../legal/AvisoCookies.jsx'
import CenaAuto from './CenaAuto.jsx'

const subir = (atraso = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { type: 'spring', stiffness: 120, damping: 20, delay: atraso },
})

/* topo das landing pages: a marca leva ao site, o resto fica na página */
export function TopoLanding({ como = { href: '#como', texto: 'Como funciona' } }) {
  const { scrollY } = useScroll()
  const [solido, setSolido] = useState(false)
  useMotionValueEvent(scrollY, 'change', y => setSolido(y > 40))
  return (
    <motion.header className={`topo ${solido ? 'topo--solido' : ''}`} initial={{ y: -80 }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 30, delay: 0.2 }}>
      <div className="contentor topo-linha">
        <a href="/" className="topo-marca" aria-label="N5 Clara, página inicial">
          <Simbolo fundo={solido ? 'claro' : 'escuro'} largura={44} />
          <span>N5 Clara</span>
        </a>
        <nav className="topo-nav" aria-label="Secções">
          <a href={como.href}>{como.texto}</a>
          <a href="#lista">Inscrição</a>
        </nav>
        <a href="#lista" className="botao topo-cta">Quero a Clara</a>
      </div>
    </motion.header>
  )
}

export function HeroLanding({ p, segundo = { href: '#como', texto: 'Ver como funciona' } }) {
  return (
    <section id="inicio" className="hero escuro lp-hero">
      <div className="hero-simbolo" aria-hidden="true">
        <Simbolo fundo="escuro" largura={760} desenhar atraso={0.4} />
      </div>
      <div className="contentor lp-hero-texto">
        <motion.p className="eyebrow" {...subir(0.1)}>{p.eyebrow} · Lançamento a 1 de dezembro</motion.p>
        <motion.h1 {...subir(0.2)}>{p.h1}</motion.h1>
        <motion.p className="hero-lead" {...subir(0.35)}>{p.lead}</motion.p>
        <motion.div className="hero-botoes" {...subir(0.5)}>
          <a href="#lista" className="botao">Quero a Clara</a>
          <a href={segundo.href} className="botao botao--linha">{segundo.texto}</a>
        </motion.div>
      </div>
    </section>
  )
}

function Cena({ cena, i }) {
  return (
    <div className={`lp-cena ${i % 2 ? 'lp-cena--inverso' : ''}`}>
      <div className="lp-cena-texto">
        <p className="eyebrow">{cena.eyebrow}</p>
        <h2>{cena.titulo}</h2>
        <p>{cena.texto}</p>
      </div>
      <CenaAuto cena={cena} />
    </div>
  )
}

function Passos({ passos }) {
  return (
    <section data-seccao="passos" className="seccao escuro lp-passos">
      <div className="contentor">
        <div className="seccao-cabeca">
          <p className="eyebrow">Em três passos</p>
          <h2>Como fica a funcionar contigo.</h2>
        </div>
        <ol className="lp-passos-grelha">
          {passos.map((s, i) => (
            <motion.li
              key={s.titulo}
              className="lp-passo"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ type: 'spring', stiffness: 160, damping: 20, delay: i * 0.1 }}
            >
              <span className="lp-passo-n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{s.titulo}</h3>
              <p>{s.texto}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Nota({ nota }) {
  return (
    <section data-seccao="nota" className="lp-nota-seccao">
      <div className="contentor">
        <div className="cartao lp-nota">
          <p className="eyebrow">{nota.titulo}</p>
          <p className="lp-nota-texto">{nota.texto}</p>
          {nota.link && <a className="lp-nota-link" href={nota.link.href}>{nota.link.texto} →</a>}
        </div>
      </div>
    </section>
  )
}

/* uma landing page: promessa do anúncio, a Clara a fazê-lo, três passos, o aviso honesto e a inscrição */
export default function Landing({ p }) {
  /* o plano da página fica escolhido no formulário */
  useEffect(() => {
    if (!p.plano) return
    const t = setTimeout(() => window.dispatchEvent(new CustomEvent('escolher-plano', { detail: p.plano })), 0)
    return () => clearTimeout(t)
  }, [p.plano])

  return (
    <>
      <TopoLanding />
      <main>
        <HeroLanding p={p} />
        {/* na página do CRM, o copiloto a preencher o CRM vem primeiro: é a promessa do anúncio */}
        {p.copiloto && <div id="como"><Copiloto /></div>}
        <section id={p.copiloto ? undefined : 'como'} className="seccao lp-cenas">
          <div className="contentor lp-cenas-lista">
            {p.cenas.map((c, i) => <Cena key={c.id} cena={c} i={i} />)}
          </div>
        </section>
        <Passos passos={p.passos} />
        {p.nota && <Nota nota={p.nota} />}
        <Lista />
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
