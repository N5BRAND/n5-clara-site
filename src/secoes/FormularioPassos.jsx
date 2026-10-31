import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { validarInscricao, PLANOS } from '../logica/validar.js'
import { codificar } from '../logica/netlify.js'
import Prioridades from './Prioridades.jsx'
import PreReserva from './PreReserva.jsx'
import { evento, marketingAceite, idsDoAnuncio, novoIdEvento } from '../legal/pixel.js'
import { emTeste } from '../legal/teste.js'
import { marcar } from '../legal/analitica.js'
import { ClaraAvatar } from '../ilustracoes/Clara.jsx'
import { ESGOTADO, PRE_RESERVA } from '../logica/pagamento.js'
import { origemDe } from '../logica/origem.js'
import Partilhar from '../partilha/Partilhar.jsx'
import { TEXTOS } from '../logica/partilha.js'
import { PROGRAMA, codigoValido, normalizarCodigo, lerRef, guardarRef, meuCodigo, guardarMeuCodigo, novoCodigo, ligacaoPessoal } from '../logica/indicacoes.js'

const VAZIO = { nome: '', email: '', telefone: '', agencia: '', plano: '', indicado_por: '', consentimento: false }

/* com as 25 pré-reservas esgotadas, quem se inscreve vai para a lista de espera (30 vagas por semana) */
const FORMULARIO = ESGOTADO ? 'lista-espera' : 'lista-clara'

/* ordem dos campos no ecrã: o primeiro com erro recebe o foco */
const ORDEM = ['nome', 'email', 'telefone', 'agencia', 'indicado_por', 'plano', 'consentimento']

const armazenamento = () => { try { return window.localStorage } catch { return null } }

const nomeDoPlano = id => PLANOS.find(p => p.id === id)?.nome || ''

function Campo({ nome, rotulo, ajuda, erro, ...resto }) {
  return (
    <label className={`campo ${erro ? 'campo--erro' : ''}`}>
      <span>{rotulo}</span>
      <input id={`campo-${nome}`} name={nome} aria-invalid={!!erro} {...resto} />
      {ajuda && !erro && <em className="campo-ajuda">{ajuda}</em>}
      {erro && <small role="alert">{erro}</small>}
    </label>
  )
}

/* inscrição num ecrã: dados, quem indicou (opcional) e o plano já escolhido em resumo; depois, o pagamento.
   plano: o plano que a página ou o teste já escolheram */
export default function Formulario({ extra, plano = '' } = {}) {
  const [d, setD] = useState(() => {
    const ref = lerRef(armazenamento(), Date.now())
    return { ...VAZIO, plano, ...(ref ? { indicado_por: ref } : {}) }
  })
  const [porLigacao] = useState(() => !!lerRef(armazenamento(), Date.now()))
  const [mudarPlano, setMudarPlano] = useState(false)
  const [erros, setErros] = useState({})
  const [estado, setEstado] = useState('pronto') // pronto | a-enviar | falhou | prioridades | pre-reserva | enviado
  const [codigo, setCodigo] = useState(null)
  const [indicacao, setIndicacao] = useState(null)
  const iniciada = useRef(false)

  /* os botões dos planos e os testes escolhem o plano aqui */
  useEffect(() => {
    const escolher = e => { setD(x => ({ ...x, plano: e.detail })); setMudarPlano(false) }
    window.addEventListener('escolher-plano', escolher)
    return () => window.removeEventListener('escolher-plano', escolher)
  }, [])

  useEffect(() => { if (plano) setD(x => ({ ...x, plano })) }, [plano])

  /* a dashboard conta o ecrã dos dados e o do pagamento */
  useEffect(() => {
    if (estado === 'prioridades' || estado === 'pre-reserva') marcar('passo_visto', { passo: estado, ordem: 2 })
  }, [estado])

  function comecar() {
    if (iniciada.current) return
    iniciada.current = true
    marcar('inscricao_iniciada')
    marcar('passo_visto', { passo: 'dados', ordem: 1 })
  }

  const muda = e => {
    const { name, value, type, checked } = e.target
    setD(x => ({ ...x, [name]: type === 'checkbox' ? checked : value }))
    if (erros[name]) setErros(x => ({ ...x, [name]: undefined }))
  }

  async function enviar(e) {
    e.preventDefault()
    const v = validarInscricao(d)
    if (!v.ok) {
      setErros(v.erros)
      const primeiro = ORDEM.find(c => v.erros[c])
      if (primeiro === 'plano') setMudarPlano(true)
      marcar('inscricao_com_erros', { campos: Object.keys(v.erros) })
      setTimeout(() => document.getElementById(`campo-${primeiro}`)?.focus(), 0)
      return
    }
    setErros({})
    const arm = armazenamento()
    const meu = meuCodigo(arm) || novoCodigo()
    guardarMeuCodigo(arm, meu)
    const escrito = d.indicado_por.trim()
    let ref = codigoValido(escrito) ? normalizarCodigo(escrito) : lerRef(arm, Date.now())
    if (ref === meu) ref = null
    if (ref) guardarRef(arm, ref, Date.now())
    setEstado('a-enviar')
    /* API de Conversões: o servidor só envia à Meta se o marketing estiver aceite, com o mesmo id do píxel */
    const idLead = novoIdEvento()
    const aceite = marketingAceite()
    const { fbp, fbc } = aceite ? idsDoAnuncio() : { fbp: '', fbc: '' }
    try {
      const r = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: codificar({ 'form-name': FORMULARIO, ...d, codigo: meu, indicado_codigo: ref || '', origem: origemDe(window.location.pathname, window.location.search), ...(extra || {}), meta_evento: idLead, meta_consentimento: aceite ? '1' : '', meta_fbp: fbp, meta_fbc: fbc, teste: emTeste() ? '1' : '', 'empresa-site': e.target.elements['empresa-site']?.value || '' }),
      })
      if (!r.ok) throw new Error(String(r.status))
      evento('Lead', {}, idLead)
      marcar('inscricao_enviada', { plano: d.plano, indicado: !!(escrito || ref), por_codigo: !!ref, diagnostico: !!extra?.diagnostico })
      setCodigo(meu)
      setIndicacao(ref)
      /* com pagamento, segue logo para a pré-reserva; na lista de espera, perguntam-se as prioridades */
      setEstado(ESGOTADO ? 'prioridades' : 'pre-reserva')
    } catch {
      setEstado('falhou')
    }
  }

  const ligacao = codigo ? ligacaoPessoal(codigo) : null
  const whatsapp = codigo ? `${TEXTOS.inscrito} ${ligacaoPessoal(codigo, 'whatsapp')}` : ''
  const mostrarPlanos = !d.plano || mudarPlano

  return (
    <div className="cartao prevenda-form">
      <AnimatePresence mode="wait">
        {estado === 'enviado' ? (
          <motion.div key="ok" className="prevenda-ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <ClaraAvatar tamanho={84} viva />
            <h3>{ESGOTADO ? 'Estás na lista de espera.' : 'Estás na lista.'}</h3>
            <p>{ESGOTADO ? 'A partir de 1 de dezembro abrimos 30 vagas por semana, pela ordem da lista. A Clara avisa-te por email quando chegar a tua vez. Dá cá cinco 🖐️' : 'A Clara avisa-te assim que abrirmos. Dá cá cinco 🖐️'}</p>
            <div className="lista-indicar">
              <p><b>{PROGRAMA.nome}.</b> Os {PROGRAMA.vencedores} consultores que trouxerem mais colegas com pré-reserva paga até {PROGRAMA.fim} ganham {PROGRAMA.premio}. O teu código é <b className="codigo">{codigo}</b>.</p>
              <p className="lista-indicar-ligacao">{ligacao}</p>
              <a className="botao" href={`https://wa.me/?text=${encodeURIComponent(whatsapp)}`} target="_blank" rel="noreferrer">Partilhar no WhatsApp</a>
              <Partilhar texto={TEXTOS.inscrito} codigo={codigo} rotulo="Partilhar no LinkedIn, Facebook ou Instagram" />
              <a className="lista-indicar-mais" href={PROGRAMA.pagina}>Ver como funciona o {PROGRAMA.nome}</a>
            </div>
          </motion.div>
        ) : estado === 'prioridades' ? (
          <Prioridades key="prioridades" email={d.email.trim()} titulo="Em que é que a Clara te ajudava mais?" aoAcabar={() => setEstado('enviado')} />
        ) : estado === 'pre-reserva' ? (
          <PreReserva key="pre-reserva" indicacao={indicacao} plano={nomeDoPlano(d.plano)} aoAcabar={() => setEstado('enviado')} />
        ) : (
          <motion.form key="form" name={FORMULARIO} onSubmit={enviar} noValidate exit={{ opacity: 0, y: -10 }} onFocusCapture={comecar}>
            <h3>{ESGOTADO ? 'Entra na lista de espera' : 'Reserva a tua Clara'}</h3>
            <p className="prevenda-form-sub">{ESGOTADO ? 'As 25 licenças com pré-reserva esgotaram. Deixa os teus dados e guardamos o teu lugar: a partir de 1 de dezembro abrimos 30 vagas por semana.' : `Os teus dados e, a seguir, o pagamento da pré-reserva de ${PRE_RESERVA}.`}</p>
            <p className="so-leitores"><label>Não preenchas: <input name="empresa-site" tabIndex={-1} autoComplete="off" /></label></p>
            <div className="prevenda-campos">
              <Campo nome="nome" rotulo="Nome" value={d.nome} onChange={muda} erro={erros.nome} autoComplete="name" />
              <Campo nome="email" rotulo="Email" type="email" inputMode="email" value={d.email} onChange={muda} erro={erros.email} autoComplete="email" />
              <Campo nome="telefone" rotulo="Telemóvel (opcional)" type="tel" inputMode="tel" value={d.telefone} onChange={muda} erro={erros.telefone} autoComplete="tel" />
              <Campo nome="agencia" rotulo="Agência ou rede" placeholder="Ex.: RE/MAX, KW, ERA" value={d.agencia} onChange={muda} erro={erros.agencia} autoComplete="organization" />
              <Campo
                nome="indicado_por" rotulo="Alguém te falou da Clara? (opcional)" value={d.indicado_por} onChange={muda} erro={erros.indicado_por} autoComplete="off"
                placeholder="Nome ou código de 6 letras"
                ajuda={porLigacao ? 'Vieste pela ligação de um colega: o código dele já está aqui.' : null}
              />
            </div>
            {mostrarPlanos ? (
              <fieldset className="passo-planos">
                <legend className="campo-legenda">Que plano te interessa mais?</legend>
                <div role="radiogroup" aria-label="Planos">
                  {PLANOS.map((p, k) => (
                    <button key={p.id} id={k === 0 ? 'campo-plano' : undefined} type="button" role="radio" aria-checked={d.plano === p.id}
                      className={`passo-plano ${d.plano === p.id ? 'passo-plano--escolhido' : ''}`}
                      onClick={() => { setD(x => ({ ...x, plano: p.id })); setErros(x => ({ ...x, plano: undefined })); setMudarPlano(false) }}>{p.nome}</button>
                  ))}
                </div>
                {erros.plano && <small className="erro-solto" role="alert">{erros.plano}</small>}
              </fieldset>
            ) : (
              <p className="form-plano">
                <span>Plano escolhido: <b>{nomeDoPlano(d.plano)}</b></span>
                <button type="button" className="passos-voltar" onClick={() => setMudarPlano(true)}>Mudar</button>
              </p>
            )}
            <label className={`consentimento ${erros.consentimento ? 'campo--erro' : ''}`}>
              <input id="campo-consentimento" type="checkbox" name="consentimento" checked={d.consentimento} onChange={muda} />
              <span>Autorizo a Nº 5 a guardar estes dados e a contactar-me sobre o lançamento da N5 Clara, nos termos da <a href="/privacidade/" target="_blank" rel="noreferrer">política de privacidade</a>.</span>
            </label>
            {erros.consentimento && <small className="erro-solto" role="alert">{erros.consentimento}</small>}
            <button className="botao prevenda-botao" type="submit" disabled={estado === 'a-enviar'}>
              {estado === 'a-enviar' ? 'A enviar…' : ESGOTADO ? 'Quero entrar na lista' : 'Continuar para o pagamento'}
            </button>
            {estado === 'falhou' && <p className="erro-solto">Não conseguimos enviar. Tenta outra vez daqui a pouco.</p>}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
