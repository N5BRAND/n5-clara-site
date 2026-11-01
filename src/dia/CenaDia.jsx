import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import Revela from './Revela.jsx'
import { Bolha } from '../secoes/Hero.jsx'
import { ClaraAvatar, Onda } from '../ilustracoes/Clara.jsx'
import { Pessoa } from '../ilustracoes/Pessoas.jsx'
import { LogoCanal } from '../ilustracoes/LogosIA.jsx'

const MOLA = { type: 'spring', stiffness: 220, damping: 22 }

/* as mensagens da Clara começam com «a escrever» e só depois mostram o texto */
function Mensagem({ m }) {
  const [escrever, setEscrever] = useState(m.de === 'clara')
  useEffect(() => {
    if (m.de !== 'clara') return
    const t = setTimeout(() => setEscrever(false), 650)
    return () => clearTimeout(t)
  }, [m.de])
  return (
    <motion.div
      className={`chat-linha chat-linha--${m.de}`}
      initial={{ opacity: 0, y: 18, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={MOLA}
    >
      {escrever
        ? <span className="chat-bolha chat-bolha--clara a-escrever-clara"><i /><i /><i /></span>
        : <Bolha m={m} />}
    </motion.div>
  )
}

/* em ecrã estreito mostramos só o mais recente, para a cena caber sem encolher */
function useCompacto() {
  const consulta = '(max-width: 900px)'
  const [compacto, setCompacto] = useState(() => typeof window !== 'undefined' && window.matchMedia(consulta).matches)
  useEffect(() => {
    const m = window.matchMedia(consulta)
    const muda = () => setCompacto(m.matches)
    m.addEventListener('change', muda)
    return () => m.removeEventListener('change', muda)
  }, [])
  return compacto
}

function Telefone({ cena, passo, compacto }) {
  const comClara = cena.canal.nome === 'Clara'
  return (
    <div className="telefone telefone--dia">
      <div className="telefone-ecra">
        <div className="chat-topo">
          {comClara ? <ClaraAvatar tamanho={36} /> : cena.canal.logo ? <LogoCanal logo={cena.canal.logo} /> : <span className="avatar">{cena.canal.nome.split(' ').map(p => p[0]).join('').slice(0, 2)}</span>}
          <div><b>{cena.canal.nome}</b><span className="suave">{cena.canal.sub}</span></div>
          {!comClara && <span className="chat-clara-responde"><ClaraAvatar tamanho={22} /> {cena.canal.logo ? 'Clara ligada' : 'Clara a responder'}</span>}
        </div>
        <div className="chat-corpo">
          {cena.mensagens.filter(m => m.p <= passo).slice(compacto ? -2 : 0).map(m => <Mensagem key={m.texto} m={m} />)}
        </div>
      </div>
    </div>
  )
}

/* um cartão com o que a Clara fez; o desenho depende do tipo */
function Cartao({ k, passo }) {
  switch (k.tipo) {
    case 'plano':
      return (
        <div className="cartao dia-cartao">
          <span className="eyebrow">{k.titulo}</span>
          <ol className="dia-plano">
            {k.itens.map((it, i) => (
              <motion.li key={it.t} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ ...MOLA, delay: 0.15 + i * 0.12 }}>
                <span className="dia-plano-h">{it.h}</span>{it.t}
              </motion.li>
            ))}
          </ol>
        </div>
      )
    case 'alerta':
      return <div className="dia-alerta"><span aria-hidden="true">!</span>{k.texto}</div>
    case 'numero':
    case 'nota':
      return (
        <div className="cartao dia-cartao dia-numero">
          {k.tipo === 'nota' && <span className="eyebrow">Coaching do dia</span>}
          <span className="numero dia-numero-grande">{k.numero}</span>
          <span className="suave">{k.texto}</span>
        </div>
      )
    case 'origem':
      return <div className="dia-origem"><span className="dia-origem-meta" aria-hidden="true">f</span>{k.texto}</div>
    case 'resumo':
      return (
        <div className="cartao dia-cartao">
          <span className="eyebrow">{k.titulo}</span>
          <div className="chips">
            {k.chips.map((c, i) => (
              <motion.span key={c} className="chip" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.15 + i * 0.09 }}>{c}</motion.span>
            ))}
          </div>
          <span className="dia-nota">{k.nota}</span>
        </div>
      )
    case 'chamada':
      return (
        <div className="cartao dia-cartao dia-chamada">
          <div className="dia-chamada-pessoa"><Pessoa largura={86} cor="#15181D" acessorio="auscultadores" fala={passo < 4} /></div>
          <div className="dia-chamada-info">
            <b>Rui · {passo < 4 ? 'em chamada' : 'chamada terminada'}</b>
            <span className="suave">com {k.com} · {k.duracao}</span>
            <Onda viva={passo < 4} barras={22} className="onda-chamada" />
          </div>
        </div>
      )
    case 'coaching':
      return (
        <div className="cartao dia-cartao dia-coaching">
          <div className="dia-coaching-topo">
            <span className="eyebrow">Coaching da chamada</span>
            <span className="numero dia-coaching-nota">{k.nota}<small>/5</small></span>
          </div>
          <span className="coach-rotulo coach-rotulo--bem">Correu bem</span>
          <ul>{k.bem.map(t => <li key={t}>{t}</li>)}</ul>
          <span className="coach-rotulo coach-rotulo--mal">A melhorar</span>
          <ul>{k.mal.map(t => <li key={t}>{t}</li>)}</ul>
        </div>
      )
    case 'feito':
      return <div className="resultado dia-feito"><span className="resultado-icone" aria-hidden="true">✓</span> {k.texto}</div>
    case 'pessoa':
      return (
        <div className="dia-rua">
          <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.9, repeat: Infinity }}>
            <Pessoa largura={110} cor="#15181D" acessorio="telemovel" toque={passo < 3} />
          </motion.div>
          <div className="dia-rua-voz"><span aria-hidden="true">🎙</span><Onda viva={passo < 3} barras={14} /></div>
        </div>
      )
    case 'registos':
      return (
        <div className="cartao dia-cartao">
          <span className="eyebrow">A Clara registou</span>
          <ul className="dia-registos">
            {k.itens.map((t, i) => (
              <motion.li key={t} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...MOLA, delay: 0.2 + i * 0.25 }}>
                <span aria-hidden="true">✓</span>{t}
              </motion.li>
            ))}
          </ul>
        </div>
      )
    case 'checklist':
      return (
        <div className="cartao dia-cartao">
          <span className="eyebrow">{k.titulo}</span>
          <ul className="dia-checklist">
            {k.itens.map(it => {
              const ok = it.ok > 0 && passo >= it.ok
              return (
                <li key={it.doc} className={ok ? 'ok' : 'falta'}>
                  <motion.span className="check-caixa" animate={ok ? { scale: [1.3, 1] } : { scale: 1 }}>{ok ? '✓' : ''}</motion.span>
                  {it.doc}
                  <span className="dia-checklist-estado">{ok ? 'recebido' : passo >= 2 ? 'pedido' : 'em falta'}</span>
                </li>
              )
            })}
          </ul>
        </div>
      )
    case 'match':
      return (
        <div className="cartao dia-cartao dia-match">
          <span className="eyebrow">Matching</span>
          <b>{k.titulo}</b>
          <div className="dia-match-pessoas">
            {k.nomes.map((n, i) => (
              <motion.span key={n} className="avatar" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 + i * 0.12 }}>{n}</motion.span>
            ))}
          </div>
          <div className="chips">{k.chips.map(c => <span key={c} className="chip">{c}</span>)}</div>
        </div>
      )
    case 'tempo':
      return (
        <div className="cartao dia-cartao dia-tempo">
          <span className="eyebrow">Onde perdes tempo</span>
          <p>{k.texto}</p>
          <span className="dia-sugestao">{k.sugestao}</span>
        </div>
      )
    default:
      return null
  }
}

export default function CenaDia({ cena, passo, estatico = false }) {
  const compacto = useCompacto() && !estatico
  /* no telemóvel só os dois cartões mais recentes já visíveis; no computador todos, com o lugar guardado */
  const cartoes = compacto ? cena.cartoes.filter(k => k.p <= passo).slice(-2) : cena.cartoes
  return (
    <div className="cena dia-cena" data-cena={cena.id}>
      <Telefone cena={cena} passo={passo} compacto={compacto} />
      <div className="dia-lado">
        {cartoes.map((k, i) => (
          <Revela key={k.tipo + i} ver={passo >= k.p} className={`dia-lado-item dia-lado-item--${k.tipo}`}>
            {/* sempre desenhado para guardar o lugar; volta a montar quando aparece para as animações internas correrem à vista */}
            <Cartao key={passo >= k.p ? 'visivel' : 'oculto'} k={k} passo={passo} />
          </Revela>
        ))}
      </div>
    </div>
  )
}
