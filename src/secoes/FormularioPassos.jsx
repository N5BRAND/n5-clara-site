import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { validarInscricao, erroDoCampo, PLANOS } from '../logica/validar.js'
import { PERGUNTAS, primeiroNome } from '../logica/inscricao.js'
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

const VAZIO = { nome: '', email: '', telefone: '', plano: '', indicado_por: '' }

/* com as 25 pré-reservas esgotadas, quem se inscreve vai para a lista de espera (30 vagas por semana) */
const FORMULARIO = ESGOTADO ? 'lista-espera' : 'lista-clara'

const armazenamento = () => { try { return window.localStorage } catch { return null } }

const nomeDoPlano = id => PLANOS.find(p => p.id === id)?.nome || ''

/* um balão da Clara; com «escreve», mostra primeiro os três pontos de quem está a escrever */
function FalaClara({ texto, ajuda, escreve = false, compacta = false }) {
  const reduzir = useReducedMotion()
  const [pronta, setPronta] = useState(!escreve || reduzir)
  useEffect(() => {
    if (pronta) return
    const t = setTimeout(() => setPronta(true), 550)
    return () => clearTimeout(t)
  }, [pronta])
  return (
    <motion.div className={`clara-fala ${compacta ? 'clara-fala--compacta' : ''}`} initial={compacta ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <ClaraAvatar tamanho={compacta ? 26 : 36} viva={!compacta} />
      <div className="clara-fala-balao">
        {pronta
          ? <><p>{texto}</p>{ajuda && <small>{ajuda}</small>}</>
          : <span className="clara-a-escrever" role="status" aria-label="A Clara está a escrever"><i /><i /><i /></span>}
      </div>
    </motion.div>
  )
}

/* inscrição em conversa: a Clara pergunta o nome, o email e o telemóvel, uma coisa de cada vez; depois, o pagamento.
   plano: o plano que a página ou o teste já escolheram (não se pergunta, segue com a inscrição) */
export default function Formulario({ extra, plano = '' } = {}) {
  const [d, setD] = useState(() => ({ ...VAZIO, plano }))
  const [porLigacao] = useState(() => !!lerRef(armazenamento(), Date.now()))
  const [i, setI] = useState(0)
  const [escreve, setEscreve] = useState(false)
  const [codigoAberto, setCodigoAberto] = useState(false)
  const [erros, setErros] = useState({})
  const [estado, setEstado] = useState('pronto') // pronto | a-enviar | falhou | prioridades | pre-reserva | enviado
  const [codigo, setCodigo] = useState(null)
  const [indicacao, setIndicacao] = useState(null)
  const iniciada = useRef(false)
  /* só depois da primeira resposta é que o campo seguinte recebe o foco: ao abrir a página, nada salta */
  const respondeu = useRef(false)

  /* os botões dos planos e os testes escolhem o plano aqui */
  useEffect(() => {
    const escolher = e => setD(x => ({ ...x, plano: e.detail }))
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
    const { name, value } = e.target
    setD(x => ({ ...x, [name]: value }))
    if (erros[name]) setErros(x => ({ ...x, [name]: undefined }))
  }

  /* voltar a uma pergunta já respondida, pelo «Voltar» ou a tocar na resposta */
  function irPara(k) {
    respondeu.current = true
    setErros({})
    setEscreve(false)
    setI(k)
  }

  function seguinte(e) {
    e.preventDefault()
    const q = PERGUNTAS[i]
    const erro = erroDoCampo(q.id, d)
    if (erro) {
      setErros({ [q.id]: erro })
      marcar('inscricao_com_erros', { campos: [q.id] })
      return
    }
    marcar('inscricao_pergunta', { n: i + 1, id: q.id })
    respondeu.current = true
    if (i + 1 < PERGUNTAS.length) {
      setErros({})
      setEscreve(true)
      setI(i + 1)
    } else enviar(e.target)
  }

  async function enviar(form) {
    const v = validarInscricao(d)
    if (!v.ok) {
      const k = PERGUNTAS.findIndex(p => v.erros[p.id])
      if (k >= 0) { setEscreve(false); setI(k) }
      setErros(v.erros)
      marcar('inscricao_com_erros', { campos: Object.keys(v.erros) })
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
        /* consentimento: dado ao carregar no botão final, logo abaixo do aviso de autorização */
        body: codificar({ 'form-name': FORMULARIO, ...d, plano: nomeDoPlano(d.plano) ? d.plano : '', indicado_por: escrito || ref || '', consentimento: true, codigo: meu, indicado_codigo: ref || '', origem: origemDe(window.location.pathname, window.location.search), ...(extra || {}), meta_evento: idLead, meta_consentimento: aceite ? '1' : '', meta_fbp: fbp, meta_fbc: fbc, teste: emTeste() ? '1' : '', 'empresa-site': form.elements['empresa-site']?.value || '' }),
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
  const q = PERGUNTAS[i]
  const ultima = i === PERGUNTAS.length - 1
  const nome = primeiroNome(d.nome)

  return (
    <div className="cartao prevenda-form">
      <AnimatePresence mode="wait">
        {estado === 'enviado' ? (
          <motion.div key="ok" className="prevenda-ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <ClaraAvatar tamanho={84} viva />
            <h3>{ESGOTADO ? 'Estás na lista de espera.' : 'Estás na lista.'}</h3>
            <p>{ESGOTADO ? 'A partir de 1 de dezembro abrimos 30 vagas por semana, pela ordem da lista. A Clara avisa-te por email quando chegar a tua vez. Dá cá cinco 🖐️' : 'A Clara avisa-te assim que abrirmos. Dá cá cinco 🖐️'}</p>
            <div className="lista-indicar">
              <p><b>{PROGRAMA.nome}.</b> {PROGRAMA.resumo} O teu código é <b className="codigo">{codigo}</b>.</p>
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
          <motion.form key="form" name={FORMULARIO} className="clara-form" onSubmit={seguinte} noValidate exit={{ opacity: 0, y: -10 }} onFocusCapture={comecar}>
            <h3>{ESGOTADO ? 'Entra na lista de espera' : 'Reserva a tua Clara'}</h3>
            <p className="prevenda-form-sub">{ESGOTADO ? 'Três perguntas e guardamos o teu lugar: a partir de 1 de dezembro abrimos 30 vagas por semana.' : `Três perguntas e, a seguir, o pagamento da pré-reserva de ${PRE_RESERVA}.`}</p>
            <p className="so-leitores"><label>Não preenchas: <input name="empresa-site" tabIndex={-1} autoComplete="off" /></label></p>
            <div className="clara-passos">
              <span className="eyebrow">Pergunta {i + 1} de {PERGUNTAS.length}</span>
              {i > 0 && <button type="button" className="clara-voltar" onClick={() => irPara(i - 1)}>← Voltar</button>}
            </div>
            <div className="clara-progresso" aria-hidden="true"><span style={{ width: `${(i / PERGUNTAS.length) * 100}%` }} /></div>
            {/* as respostas ficam à vista como mensagens: fora das gravações do PostHog, que só escondem os campos */}
            <div className="clara-conversa ph-no-capture" aria-live="polite">
              {PERGUNTAS.slice(0, i).map((p, k) => (
                <div key={p.id} className="clara-troca">
                  <FalaClara texto={p.fala(nome)} compacta />
                  <button type="button" className="clara-resposta" onClick={() => irPara(k)} aria-label={`${p.rotulo}: ${d[p.id]}. Mudar`}>{d[p.id]}</button>
                </div>
              ))}
              <FalaClara key={q.id} texto={q.fala(nome)} ajuda={q.ajuda} escreve={escreve} />
            </div>
            <label className={`campo clara-campo ${erros[q.id] ? 'campo--erro' : ''}`}>
              <span className="so-leitores">{q.rotulo}</span>
              <input
                key={q.id} id={`campo-${q.id}`} name={q.id} value={d[q.id]} onChange={muda}
                aria-invalid={!!erros[q.id]} enterKeyHint={ultima ? 'send' : 'next'} autoFocus={respondeu.current}
                {...q.campo}
              />
              {erros[q.id] && <small role="alert">{erros[q.id]}</small>}
            </label>
            {/* quem chega pela ligação de um colega já traz o código; para os outros, fica à mão sem ser mais uma pergunta */}
            {ultima && !porLigacao && (codigoAberto ? (
              <label className={`campo clara-codigo ${erros.indicado_por ? 'campo--erro' : ''}`}>
                <span>Código ou nome do colega que te falou da Clara</span>
                <input id="campo-indicado_por" name="indicado_por" value={d.indicado_por} onChange={muda} autoComplete="off" placeholder="Ex.: ABC234" autoFocus />
                {erros.indicado_por && <small role="alert">{erros.indicado_por}</small>}
              </label>
            ) : (
              <button type="button" className="clara-voltar clara-codigo-abrir" onClick={() => setCodigoAberto(true)}>Tens o código de um colega?</button>
            ))}
            {ultima && <p className="clara-aviso">Ao continuares, autorizas a Nº 5 a guardar estes dados e a contactar-te sobre o lançamento da N5 Clara, nos termos da <a href="/privacidade/" target="_blank" rel="noreferrer">política de privacidade</a>.</p>}
            <button className="botao prevenda-botao" type="submit" disabled={estado === 'a-enviar'}>
              {estado === 'a-enviar' ? 'A enviar…' : !ultima ? 'Seguinte' : ESGOTADO ? 'Quero entrar na lista' : 'Continuar para o pagamento'}
            </button>
            {estado === 'falhou' && <p className="erro-solto">Não conseguimos enviar. Tenta outra vez daqui a pouco.</p>}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
