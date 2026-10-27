import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import { LANCAMENTO, tempoAte } from '../logica/contagem.js'
import { validarInscricao, PLANOS } from '../logica/validar.js'
import { codificar } from '../logica/netlify.js'
import Prioridades from './Prioridades.jsx'
import PreReserva from './PreReserva.jsx'
import Mensalidade from './Mensalidade.jsx'
import { evento } from '../legal/pixel.js'
import { ClaraAvatar } from '../ilustracoes/Clara.jsx'

const VAZIO = { nome: '', email: '', telefone: '', agencia: '', plano: '', indicado_por: '', consentimento: false }

/* mensagem para partilhar com colegas; leva só o endereço do site, sem dados de ninguém */
const PARTILHA = 'Entrei na lista de espera da N5 Clara, a assistente comercial para consultores imobiliários. Inscreve-te também e põe o meu email em «Quem te indicou»: https://clara.numerocinco.pt/#lista'

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
  const [estado, setEstado] = useState('pronto') // pronto | a-enviar | prioridades | pre-reserva | enviado | falhou

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
      evento('Lead')
      setEstado('prioridades')
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
            <div className="lista-indicar">
              <p><b>Queres passar à frente na ordem de entrada?</b> Traz 3 colegas: pede-lhes que se inscrevam e ponham o teu email em «Quem te indicou».</p>
              <a className="botao" href={`https://wa.me/?text=${encodeURIComponent(PARTILHA)}`} target="_blank" rel="noreferrer">Partilhar no WhatsApp</a>
            </div>
          </motion.div>
        ) : estado === 'prioridades' ? (
          <Prioridades key="prioridades" email={d.email.trim()} titulo="Em que é que a Clara te ajudava mais?" aoAcabar={() => setEstado('pre-reserva')} />
        ) : estado === 'pre-reserva' ? (
          <PreReserva key="pre-reserva" aoAcabar={() => setEstado('enviado')} />
        ) : (
          <motion.form key="form" name="lista-clara" onSubmit={enviar} noValidate exit={{ opacity: 0, y: -10 }}>
            <h3>Inscreve-te na N5 Clara</h3>
            <p className="prevenda-form-sub">A inscrição é uma pré-reserva de 27 €, descontada na primeira mensalidade. Primeiro os teus dados, depois o pagamento.</p>
            <p className="so-leitores"><label>Não preenchas: <input name="empresa-site" tabIndex={-1} autoComplete="off" /></label></p>
            <div className="prevenda-campos">
              <Campo nome="nome" rotulo="Nome" value={d.nome} onChange={muda} erro={erros.nome} autoComplete="name" />
              <Campo nome="email" rotulo="Email" type="email" value={d.email} onChange={muda} erro={erros.email} autoComplete="email" />
              <Campo nome="telefone" rotulo="Telefone (opcional)" type="tel" value={d.telefone} onChange={muda} erro={erros.telefone} autoComplete="tel" />
              <Campo nome="agencia" rotulo="Agência ou rede" value={d.agencia} onChange={muda} erro={erros.agencia} autoComplete="organization" />
              <Campo nome="indicado_por" rotulo="Quem te indicou? (email, opcional)" type="email" value={d.indicado_por} onChange={muda} erro={erros.indicado_por} autoComplete="off" />
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
              <span>Autorizo a Nº 5 a guardar estes dados e a contactar-me sobre o lançamento da N5 Clara, nos termos da <a href="/privacidade/" target="_blank" rel="noreferrer">política de privacidade</a>.</span>
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
      <div className="contentor prevenda-grelha prevenda-grelha--coluna">
        <div className="prevenda-texto">
          <p className="eyebrow">Inscrição</p>
          <h2>1 de dezembro. A Clara começa a trabalhar contigo.</h2>
          <Contagem />
          <p className="prevenda-lead">
            Inscreve-te e és dos primeiros a ter a tua assistente comercial: leads respondidas, dia organizado e coaching das tuas chamadas.
            Há 25 licenças reservadas, com pré-reserva de 27 €: entras no primeiro dia e tens 25% de desconto nas 2 primeiras mensalidades, o copiloto para o CRM da tua marca, uma sessão de configuração com a nossa equipa e 2 formações incluídas. Sem fidelização.
          </p>
          <div className="lista-oferta">
            <motion.div
              className="lista-oferta-cartao lista-oferta-cartao--destaque"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <small>Desconto</small>
              <b>25% nos 2 primeiros meses</b>
              <p>Para quem faz a pré-reserva antes de 1 de dezembro: 39 € em vez de 53 € nas 2 primeiras mensalidades do plano Clara.</p>
            </motion.div>
            <motion.div
              className="lista-oferta-cartao"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <small>Licenças reservadas</small>
              <b>Só 25</b>
              <p>As 25 licenças com pré-reserva entram a 1 de dezembro. Depois, abrimos 30 vagas por semana, pela ordem da lista de espera.</p>
            </motion.div>
            <motion.div
              className="lista-oferta-cartao"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <small>Indicações</small>
              <b>Traz 3 colegas</b>
              <p>Passas à frente na ordem de entrada.</p>
            </motion.div>
          </div>
          <p className="prevenda-porque"><b>Porquê só 25 licenças?</b> Cada consultor que entra tem a Clara configurada com o acompanhamento da nossa equipa. Para o fazermos bem, reservamos 25 licenças para o primeiro dia. Depois, abrimos 30 vagas por semana, pela ordem da lista de espera.</p>
          <motion.div
            className="prevenda-reserva prevenda-reserva--explicada"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <p className="prevenda-reserva-titulo">Faz a pré-reserva de 27 € antes de 1 de dezembro, numa das 25 licenças reservadas, e tens <b>25% de desconto nas 2 primeiras mensalidades</b> do plano Clara. Os 27 € que pagas agora são descontados na 1.ª mensalidade, já com o desconto.</p>
            <ol className="prevenda-pagamentos" aria-label="Quanto pagas, mês a mês">
              <li><small>Agora</small><b>27 €</b><span>pré-reserva</span></li>
              <li><small>1.º mês</small><b>12 €</b><span>39 € menos os 27 €</span></li>
              <li><small>2.º mês</small><b>39 €</b><span>com 25% de desconto</span></li>
              <li><small>A partir do 3.º</small><b>53 €</b><span>valor do plano Clara</span></li>
            </ol>
            <div className="prevenda-reserva-linha">
            <div className="prevenda-reserva-valor">
              <small>Pré-reserva</small>
              <span>27 €</span>
              <Mensalidade />
            </div>
            <ul className="prevenda-reserva-condicoes">
              <li>Uma das 25 licenças reservadas: entras no primeiro dia, a 1 de dezembro</li>
              <li>Copiloto para o CRM da tua marca incluído</li>
              <li>Sessão de configuração com a equipa da Nº5</li>
              <li>2 formações incluídas, para ti e para a tua equipa até 5 consultores</li>
              <li>Os 27 € são descontados na 1.ª mensalidade, já com o desconto</li>
              <li>Sem fidelização: cancelas quando quiseres</li>
              <li>Reembolsável após o dia do lançamento</li>
            </ul>
            </div>
          </motion.div>
          <Formulario />
        </div>
      </div>
    </section>
  )
}
