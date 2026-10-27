import { motion } from 'motion/react'
import { useState } from 'react'
import { PRIORIDADES, MAX_PRIORIDADES, CRMS, alternarPrioridade, textoPrioridades } from '../logica/prioridades.js'
import { codificar } from '../logica/netlify.js'

/* passo 2, logo a seguir à inscrição: até 3 prioridades (e o CRM, quando se pergunta). Pode saltar-se. */
export default function Prioridades({ email, titulo, aoAcabar }) {
  const [escolhidas, setEscolhidas] = useState([])
  const [crm, setCrm] = useState('')
  const [crmOutro, setCrmOutro] = useState('')
  const [aEnviar, setAEnviar] = useState(false)
  const cheio = escolhidas.length >= MAX_PRIORIDADES

  const enviar = async () => {
    setAEnviar(true)
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: codificar({ 'form-name': 'prioridades', email, prioridades: textoPrioridades(escolhidas), ...(CRMS ? { crm: crm === 'Outro' && crmOutro.trim() ? `Outro: ${crmOutro.trim()}` : crm } : {}), 'empresa-site': '' }),
      })
    } catch {
      // a inscrição já ficou feita no passo 1; as prioridades são um extra e não bloqueiam ninguém
    }
    aoAcabar()
  }

  return (
    <motion.div key="prioridades" className="prioridades" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <p className="prioridades-feito">✓ Estás na lista.</p>
      <h3>{titulo}</h3>
      <p className="prevenda-form-sub">Escolhe até {MAX_PRIORIDADES}. Assim mostramos-te primeiro o que conta para ti.</p>
      <div className="prioridades-lista" role="group" aria-label={titulo}>
        {PRIORIDADES.map(p => {
          const ligada = escolhidas.includes(p.id)
          return (
            <motion.button
              key={p.id}
              type="button"
              className={`prioridade ${ligada ? 'prioridade--ligada' : ''}`}
              aria-pressed={ligada}
              disabled={!ligada && cheio}
              onClick={() => setEscolhidas(e => alternarPrioridade(e, p.id))}
              whileTap={{ scale: 0.97 }}
            >
              <span className="prioridade-marca" aria-hidden="true">{ligada ? escolhidas.indexOf(p.id) + 1 : ''}</span>
              {p.texto}
            </motion.button>
          )
        })}
      </div>
      {CRMS && (
        <label className="campo">
          <span>Que CRM usam hoje? (opcional)</span>
          <select value={crm} onChange={e => setCrm(e.target.value)}>
            <option value="">Escolhe</option>
            {CRMS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
      )}
      {CRMS && crm === 'Outro' && (
        <motion.label className="campo" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
          <span>Qual é o CRM?</span>
          <input name="crm-outro" value={crmOutro} onChange={e => setCrmOutro(e.target.value)} placeholder="Escreve o nome do CRM" autoComplete="off" autoFocus />
        </motion.label>
      )}
      <div className="prioridades-botoes">
        <button type="button" className="botao prevenda-botao" disabled={!escolhidas.length || aEnviar} onClick={enviar}>
          {aEnviar ? 'A enviar…' : `Enviar ${escolhidas.length ? `(${escolhidas.length} de ${MAX_PRIORIDADES})` : ''}`}
        </button>
        <button type="button" className="prioridades-saltar" onClick={aoAcabar}>Saltar</button>
      </div>
    </motion.div>
  )
}
