import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { validarInscricao, PLANOS } from '../logica/validar.js'
import { PASSOS, erroDoPasso, primeiroPassoComErro, primeiroNome } from '../logica/passos.js'
import { codificar } from '../logica/netlify.js'
import Prioridades from './Prioridades.jsx'
import PreReserva from './PreReserva.jsx'
import { evento } from '../legal/pixel.js'
import { marcar } from '../legal/analitica.js'
import { ClaraAvatar } from '../ilustracoes/Clara.jsx'
import { ESGOTADO } from '../logica/pagamento.js'
import Partilhar from '../partilha/Partilhar.jsx'
import { TEXTOS } from '../logica/partilha.js'
import { PROGRAMA, codigoValido, normalizarCodigo, lerRef, guardarRef, meuCodigo, guardarMeuCodigo, novoCodigo, ligacaoPessoal } from '../logica/indicacoes.js'

const VAZIO = { nome: '', email: '', telefone: '', agencia: '', plano: '', indicado_por: '', consentimento: false }

/* com as 25 pré-reservas esgotadas, quem se inscreve vai para a lista de espera (30 vagas por semana) */
const FORMULARIO = ESGOTADO ? 'lista-espera' : 'lista-clara'

const armazenamento = () => { try { return window.localStorage } catch { return null } }

/* o que a Clara pergunta em cada passo */
function textoDoPasso(id, d, porLigacao) {
  const nome = primeiroNome(d.nome)
  switch (id) {
    case 'nome': return { pergunta: 'Como queres que a Clara te chame?', ajuda: 'É o nome que ela vai usar quando falar contigo.' }
    case 'email': return { pergunta: `${nome ? `${nome}, em` : 'Em'} que email é que a Clara te deve contactar?`, ajuda: 'É para aí que vão as novidades do lançamento e o teu acesso.' }
    case 'telefone': return { pergunta: 'Qual é o teu telemóvel?', ajuda: 'Opcional. Só o usamos para falar contigo sobre o lançamento.' }
    case 'agencia': return { pergunta: 'Em que agência ou rede trabalhas?', ajuda: 'Por exemplo RE/MAX, KW, ERA, Century 21 ou o nome da tua agência.' }
    case 'indicado': return porLigacao
      ? { pergunta: 'Um colega indicou-te a Clara.', ajuda: 'Vieste pela ligação dele e o código já está aqui. Se foi outra pessoa, escreve o nome ou o código dela.' }
      : { pergunta: 'Alguém te falou da Clara?', ajuda: 'Se sim, escreve o nome de quem te indicou ou o código de 6 letras que te deu. Se não, continua.' }
    case 'plano': return { pergunta: 'Que plano te interessa mais?', ajuda: 'Podes mudar depois. Os três planos estão descritos mais acima.' }
    default: return { pergunta: 'Último passo: podemos guardar estes dados?', ajuda: '' }
  }
}

/* inscrição passo a passo: uma pergunta de cada vez; depois as prioridades e a pré-reserva */
export default function Formulario() {
  const [d, setD] = useState(() => {
    const ref = lerRef(armazenamento(), Date.now())
    return ref ? { ...VAZIO, indicado_por: ref } : VAZIO
  })
  const [porLigacao] = useState(() => !!lerRef(armazenamento(), Date.now()))
  const [i, setI] = useState(0)
  const [erro, setErro] = useState('')
  const [estado, setEstado] = useState('pronto') // pronto | a-enviar | falhou | prioridades | pre-reserva | enviado
  const [codigo, setCodigo] = useState(null)
  const [indicacao, setIndicacao] = useState(null)
  const vistos = useRef(new Set())
  const montado = useRef(false) // o primeiro passo não rouba o foco ao abrir a página; os seguintes focam o campo ao aparecer

  const passo = PASSOS[i]
  const ultimo = i === PASSOS.length - 1
  const { pergunta, ajuda } = textoDoPasso(passo.id, d, porLigacao)

  /* cada passo conta uma vez por visita, para a dashboard ver onde as pessoas desistem */
  const ver = id => {
    if (vistos.current.has(id)) return
    vistos.current.add(id)
    marcar('passo_visto', { passo: id, ordem: vistos.current.size })
  }

  /* os botões dos planos escolhem o plano aqui */
  useEffect(() => {
    const escolher = e => setD(x => ({ ...x, plano: e.detail }))
    window.addEventListener('escolher-plano', escolher)
    return () => window.removeEventListener('escolher-plano', escolher)
  }, [])

  useEffect(() => {
    if (!montado.current) { montado.current = true; return }
    ver(passo.id)
  }, [i])

  useEffect(() => {
    if (estado === 'prioridades' || estado === 'pre-reserva') ver(estado)
  }, [estado])

  function comecar() {
    if (vistos.current.has('nome')) return
    marcar('inscricao_iniciada')
    ver('nome')
  }

  const muda = e => {
    const { name, value, type, checked } = e.target
    setD(x => ({ ...x, [name]: type === 'checkbox' ? checked : value }))
    if (erro) setErro('')
  }

  function seguir(e) {
    e.preventDefault()
    const problema = erroDoPasso(passo, d)
    if (problema) {
      setErro(problema)
      marcar('inscricao_com_erros', { campos: [passo.campo] })
      return
    }
    setErro('')
    if (ultimo) enviar(e.target.elements['empresa-site']?.value || '')
    else setI(i + 1)
  }

  function voltar() {
    setErro('')
    setI(Math.max(0, i - 1))
  }

  async function enviar(armadilha) {
    const v = validarInscricao(d)
    if (!v.ok) {
      const p = primeiroPassoComErro(d)
      setI(p)
      setErro(v.erros[PASSOS[p].campo])
      return
    }
    const arm = armazenamento()
    const meu = meuCodigo(arm) || novoCodigo()
    guardarMeuCodigo(arm, meu)
    const escrito = d.indicado_por.trim()
    let ref = codigoValido(escrito) ? normalizarCodigo(escrito) : lerRef(arm, Date.now())
    if (ref === meu) ref = null
    if (ref) guardarRef(arm, ref, Date.now())
    setEstado('a-enviar')
    try {
      const r = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: codificar({ 'form-name': FORMULARIO, ...d, codigo: meu, indicado_codigo: ref || '', 'empresa-site': armadilha }),
      })
      if (!r.ok) throw new Error(String(r.status))
      evento('Lead')
      marcar('inscricao_enviada', { plano: d.plano, indicado: !!(escrito || ref), por_codigo: !!ref })
      setCodigo(meu)
      setIndicacao(ref)
      setEstado('prioridades')
    } catch {
      setEstado('falhou')
    }
  }

  const ligacao = codigo ? ligacaoPessoal(codigo) : null
  const whatsapp = codigo ? `${TEXTOS.inscrito} ${ligacaoPessoal(codigo, 'whatsapp')}` : ''

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
          <Prioridades key="prioridades" email={d.email.trim()} titulo="Em que é que a Clara te ajudava mais?" aoAcabar={() => setEstado(ESGOTADO ? 'enviado' : 'pre-reserva')} />
        ) : estado === 'pre-reserva' ? (
          <PreReserva key="pre-reserva" indicacao={indicacao} aoAcabar={() => setEstado('enviado')} />
        ) : (
          <motion.form key="form" name={FORMULARIO} onSubmit={seguir} noValidate exit={{ opacity: 0, y: -10 }} onFocusCapture={comecar}>
            <h3>{ESGOTADO ? 'Entra na lista de espera' : 'Inscreve-te na N5 Clara'}</h3>
            <p className="prevenda-form-sub">{ESGOTADO ? 'As 25 licenças com pré-reserva esgotaram. Deixa os teus dados e guardamos o teu lugar: a partir de 1 de dezembro abrimos 30 vagas por semana.' : 'A inscrição é uma pré-reserva de 27 €, que paga a tua primeira mensalidade. Primeiro os teus dados, depois o pagamento.'}</p>
            <p className="so-leitores"><label>Não preenchas: <input name="empresa-site" tabIndex={-1} autoComplete="off" /></label></p>
            <div className="passos-progresso">
              <span>Passo {i + 1} de {PASSOS.length}</span>
              <div className="passos-barra" aria-hidden="true"><i style={{ width: `${((i + 1) / PASSOS.length) * 100}%` }} /></div>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={passo.id} className="passo" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.2 }}>
                {passo.id === 'plano' ? (
                  <fieldset className="passo-planos">
                    <legend className="passo-pergunta">{pergunta}</legend>
                    <p className="passo-ajuda">{ajuda}</p>
                    <div role="radiogroup" aria-label="Planos">
                      {PLANOS.map((p, k) => (
                        <button key={p.id} type="button" role="radio" aria-checked={d.plano === p.id} autoFocus={k === 0 && i > 0}
                          className={`passo-plano ${d.plano === p.id ? 'passo-plano--escolhido' : ''}`}
                          onClick={() => { setD(x => ({ ...x, plano: p.id })); setErro('') }}>{p.nome}</button>
                      ))}
                    </div>
                  </fieldset>
                ) : passo.id === 'autorizacao' ? (
                  <>
                    <p className="passo-pergunta">{pergunta}</p>
                    <label className="consentimento">
                      <input type="checkbox" name="consentimento" checked={d.consentimento} onChange={muda} autoFocus />
                      <span>Autorizo a Nº 5 a guardar estes dados e a contactar-me sobre o lançamento da N5 Clara, nos termos da <a href="/privacidade/" target="_blank" rel="noreferrer">política de privacidade</a>.</span>
                    </label>
                  </>
                ) : (
                  <>
                    <label className="passo-pergunta" htmlFor={`passo-${passo.id}`}>{pergunta}</label>
                    <p className="passo-ajuda">{ajuda}</p>
                    <input id={`passo-${passo.id}`} autoFocus={i > 0} className="passo-campo" name={passo.campo} value={d[passo.campo]} onChange={muda}
                      aria-invalid={!!erro}
                      type={passo.id === 'email' ? 'email' : passo.id === 'telefone' ? 'tel' : 'text'}
                      inputMode={passo.id === 'telefone' ? 'tel' : passo.id === 'email' ? 'email' : undefined}
                      autoComplete={{ nome: 'name', email: 'email', telefone: 'tel', agencia: 'organization' }[passo.id] || 'off'} />
                  </>
                )}
                {erro && <small className="erro-solto" role="alert">{erro}</small>}
              </motion.div>
            </AnimatePresence>
            <div className="passos-acoes">
              {i > 0 && <button type="button" className="passos-voltar" onClick={voltar}>Voltar</button>}
              <button className="botao prevenda-botao" type="submit" disabled={estado === 'a-enviar'}>
                {estado === 'a-enviar' ? 'A enviar…' : ultimo ? (ESGOTADO ? 'Quero entrar na lista' : 'Quero a Clara') : passo.opcional && !String(d[passo.campo]).trim() ? 'Saltar' : 'Continuar'}
              </button>
            </div>
            {estado === 'falhou' && <p className="erro-solto">Não conseguimos enviar. Tenta outra vez daqui a pouco.</p>}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
