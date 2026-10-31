import { motion, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { ClaraAvatar } from '../ilustracoes/Clara.jsx'

const CAMPOS = [
  { rotulo: 'Nome', valor: 'Marta Silva' },
  { rotulo: 'Telefone', valor: '912 345 678' },
  { rotulo: 'Imóvel de interesse', valor: 'T3 · Benfica' },
  { rotulo: 'Visita', valor: 'Sábado, 11h (segunda visita)' },
  { rotulo: 'Feedback', valor: 'Adorou a cozinha; acha o 2.º quarto pequeno.' },
]

/* escreve o texto letra a letra quando chega a vez do campo */
function Escrita({ texto, ativo }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!ativo) { setN(0); return }
    if (n >= texto.length) return
    const t = setTimeout(() => setN(x => x + 1), 28)
    return () => clearTimeout(t)
  }, [ativo, n, texto])
  return <>{texto.slice(0, n)}{ativo && n < texto.length && <span className="cursor" />}</>
}

/* textos por defeito (página principal); a página /crm/ traz os seus, para não repetir a introdução */
const TEXTOS = {
  eyebrow: 'Ao lado do CRM da tua marca',
  titulo: 'Tens um CRM obrigatório? A Clara preenche-o por ti.',
  texto: 'O copiloto trabalha no browser, na sessão que já tens aberta. Contactos, visitas, feedback e documentos que a Clara captou passam para o CRM da tua marca sem escreveres nada. Revês e confirmas antes de gravar. Nunca te pede palavras-passe.',
}

export default function Copiloto(props) {
  const { eyebrow, titulo, texto } = { ...TEXTOS, ...props }
  const ref = useRef(null)
  const visivel = useInView(ref, { amount: 0.5 })
  const [campo, setCampo] = useState(-1)

  useEffect(() => {
    if (!visivel) { setCampo(-1); return }
    if (campo > CAMPOS.length) return
    /* com os campos preenchidos, espera pela confirmação do consultor antes de gravar */
    const t = setTimeout(() => setCampo(c => c + 1), campo < 0 ? 600 : campo === CAMPOS.length ? 1800 : 900)
    return () => clearTimeout(t)
  }, [visivel, campo])

  const aConfirmar = campo === CAMPOS.length
  const gravado = campo > CAMPOS.length

  return (
    <section data-seccao="copiloto" ref={ref} className="seccao copiloto">
      <div className="contentor copiloto-grelha">
        <div className="seccao-cabeca">
          <p className="eyebrow">{eyebrow}</p>
          <h2>{titulo}</h2>
          <p>{texto}</p>
        </div>

        <div className="browser" aria-hidden="true">
          <div className="browser-barra">
            <i /><i /><i />
            <span className="browser-url">crm.da-tua-marca.pt/contactos/novo</span>
            <span className="browser-ext"><ClaraAvatar tamanho={22} /></span>
          </div>
          <div className="browser-corpo">
            <div className="crm-form">
              <b className="crm-titulo">Novo contacto</b>
              {CAMPOS.map((c, i) => (
                <div key={c.rotulo} className={`crm-campo ${i === campo ? 'crm-campo--ativo' : ''}`}>
                  <span>{c.rotulo}</span>
                  <div className="crm-valor"><Escrita texto={c.valor} ativo={campo >= i} /></div>
                </div>
              ))}
              <motion.div className={`crm-gravar ${gravado ? 'crm-gravar--feito' : aConfirmar ? 'crm-gravar--confirmar' : ''}`} animate={gravado || aConfirmar ? { scale: [1, 1.06, 1] } : { scale: 1 }}>
                {gravado ? '✓ Gravado no CRM' : 'Confirmar e gravar'}
              </motion.div>
            </div>
            <div className="crm-clara">
              <div className="crm-clara-topo"><ClaraAvatar tamanho={30} viva={!gravado && !aConfirmar && campo >= 0} /><b>Clara</b></div>
              <p>{gravado ? 'Gravado. Fica marcado na Clara o que já está no CRM da marca.' : aConfirmar ? 'Preenchido. Revê os campos e confirma para gravar.' : campo >= 0 ? 'A preencher com o que captei da tua nota de voz…' : 'Abriste um contacto novo.'}</p>
              <span className="crm-clara-nota">Histórico, tarefas e próxima sugestão ao lado do teu CRM.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
