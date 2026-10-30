import { motion, AnimatePresence, useScroll, useMotionValueEvent, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Bolha } from '../secoes/Hero.jsx'
import { ClaraAvatar } from '../ilustracoes/Clara.jsx'
import { ESGOTADO } from '../logica/pagamento.js'
import Urgencia from './Urgencia.jsx'
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

export const CTA = ESGOTADO ? 'Entrar na lista de espera' : 'Garantir a minha licença'

/* a conversa da primeira cena da página, a escrever-se sozinha no topo: quem chega do anúncio vê logo a funcionalidade */
function ConversaHero({ cena }) {
  const reduzir = useReducedMotion()
  const total = cena.mensagens.length
  const [n, setN] = useState(reduzir ? total : 0)
  useEffect(() => {
    if (reduzir) return
    const t = setTimeout(() => setN(x => (x >= total + 2 ? 0 : x + 1)), n === 0 ? 900 : n >= total ? 2800 : 2000)
    return () => clearTimeout(t)
  }, [n, total, reduzir])
  const vistas = cena.mensagens.slice(0, Math.min(n, total))
  const aEscrever = !reduzir && n < total && cena.mensagens[n]?.de === 'clara' && n > 0
  const comClara = cena.canal.nome === 'Clara'

  return (
    <div className="telefone telefone--hero lp-telefone" aria-hidden="true">
      <div className="telefone-ecra">
        <div className="chat-topo">
          {comClara ? <ClaraAvatar tamanho={36} viva={aEscrever} /> : <span className="avatar">{cena.canal.nome.split(' ').map(x => x[0]).join('').slice(0, 2)}</span>}
          <div><b>{cena.canal.nome}</b><span className="suave">{comClara && aEscrever ? 'a escrever…' : cena.canal.sub}</span></div>
          {!comClara && <span className="chat-clara-responde"><ClaraAvatar tamanho={22} /> Clara a responder</span>}
        </div>
        <div className="chat-corpo">
          <AnimatePresence initial={false} mode="popLayout">
            {vistas.slice(-3).map(m => (
              <motion.div key={m.texto} layout initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -16 }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }} className={`chat-linha chat-linha--${m.de}`}>
                <Bolha m={m} />
              </motion.div>
            ))}
          </AnimatePresence>
          {aEscrever && (
            <motion.div className="chat-linha chat-linha--clara" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <span className="chat-bolha chat-bolha--clara a-escrever-clara"><i /><i /><i /></span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export function HeroLanding({ p, cena, segundo = { href: '#como', texto: 'Ver como funciona' } }) {
  return (
    <section id="inicio" className="hero escuro lp-hero">
      <div className="hero-simbolo" aria-hidden="true">
        <Simbolo fundo="escuro" largura={760} desenhar atraso={0.4} />
      </div>
      <div className={`contentor lp-hero-grelha ${cena ? '' : 'lp-hero-grelha--so-texto'}`}>
        <div className="lp-hero-cabeca">
          <motion.p className="eyebrow" {...subir(0.1)}>{p.eyebrow}</motion.p>
          <motion.h1 {...subir(0.2)}>{p.h1}</motion.h1>
        </div>
        {cena && (
          <motion.div className="lp-hero-telefone" {...subir(0.45)}>
            <ConversaHero cena={cena} />
          </motion.div>
        )}
        <div className="lp-hero-corpo">
          <motion.p className="hero-lead" {...subir(0.35)}>{p.lead}</motion.p>
          <motion.div className="hero-botoes" {...subir(0.5)}>
            <a href="#lista" className="botao">{CTA}</a>
            <a href={segundo.href} className="botao botao--linha">{segundo.texto}</a>
          </motion.div>
          <motion.div className="lp-hero-urgencia" {...subir(0.6)}><Urgencia /></motion.div>
        </div>
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
        <HeroLanding p={p} cena={p.cenas[0]} />
        {/* na página do CRM, o copiloto a preencher o CRM vem primeiro: é a promessa do anúncio */}
        {p.copiloto && <div id="como"><Copiloto /></div>}
        <section id={p.copiloto ? undefined : 'como'} className="seccao lp-cenas">
          <div className="contentor lp-cenas-lista">
            {p.cenas.map((c, i) => <Cena key={c.id} cena={c} i={i} />)}
          </div>
        </section>
        <Passos passos={p.passos} />
        <Lista aviso={p.nota} />
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
