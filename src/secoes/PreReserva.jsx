import { motion } from 'motion/react'
import { useState } from 'react'
import Mensalidade from './Mensalidade.jsx'
import { evento } from '../legal/pixel.js'
import { LINK_PRE_RESERVA, VALOR_PRE_RESERVA, VALOR_EUROS, METODOS, linkValido } from '../logica/pagamento.js'

/* passo 3, depois das prioridades: pagar a pré-reserva na Stripe; não há opção de pagar depois */
export default function PreReserva({ aoAcabar }) {
  const temLink = linkValido(LINK_PRE_RESERVA)
  const [aceito, setAceito] = useState(false)

  return (
    <motion.div key="pre-reserva" className="pre-reserva" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <p className="prioridades-feito">✓ Estás na lista.</p>
      <h3>Último passo: conclui a tua inscrição</h3>
      <div className="pre-reserva-valor">
        <div className="pre-reserva-preco">
          <span>{VALOR_PRE_RESERVA}</span>
          <Mensalidade />
        </div>
        <ul>
          <li>30 vagas por semana, a partir de 1 de dezembro, pela ordem do pagamento</li>
          <li>Descontada na primeira mensalidade</li>
          <li>Reembolsável após o dia do lançamento</li>
        </ul>
      </div>
      <div className="pre-reserva-metodos" aria-label="Formas de pagamento">
        {METODOS.map(m => <span key={m}>{m}</span>)}
      </div>
      {temLink ? (
        <>
          <label className="pre-reserva-aceito">
            <input type="checkbox" checked={aceito} onChange={e => setAceito(e.target.checked)} />
            <span>Li e aceito as <a href="/termos/#pre-reserva" target="_blank" rel="noreferrer">condições da pré-reserva e do reembolso</a>.</span>
          </label>
          {aceito ? <a className="botao prevenda-botao" href={LINK_PRE_RESERVA} onClick={() => evento('InitiateCheckout', { value: VALOR_EUROS, currency: 'EUR' })}>Pagar {VALOR_PRE_RESERVA} e garantir a minha vaga</a> : <button type="button" className="botao prevenda-botao" disabled>Pagar {VALOR_PRE_RESERVA} e garantir a minha vaga</button>}
          <p className="pre-reserva-nota">Pagamento seguro na Stripe. Voltas a este site no fim.</p>
        </>
      ) : (
        <p className="pre-reserva-nota pre-reserva-nota--aviso">O pagamento abre nos próximos dias. Enviamos-te o link por email assim que estiver ativo.</p>
      )}
      {!temLink && <button type="button" className="prioridades-saltar" onClick={aoAcabar}>Concluir</button>}
    </motion.div>
  )
}
