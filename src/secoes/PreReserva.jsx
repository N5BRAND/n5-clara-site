import { motion } from 'motion/react'
import { LINK_PRE_RESERVA, VALOR_PRE_RESERVA, METODOS, linkValido } from '../logica/pagamento.js'

/* passo 3, depois das prioridades: pagar a pré-reserva na Stripe ou deixar para depois */
export default function PreReserva({ aoAcabar }) {
  const temLink = linkValido(LINK_PRE_RESERVA)

  return (
    <motion.div key="pre-reserva" className="pre-reserva" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <p className="prioridades-feito">✓ Estás na lista.</p>
      <h3>Último passo: conclui a tua inscrição</h3>
      <div className="pre-reserva-valor">
        <span>{VALOR_PRE_RESERVA}</span>
        <ul>
          <li>Entras no primeiro dia, a 1 de dezembro</li>
          <li>Descontada na primeira mensalidade</li>
          <li>Reembolsável após o dia do lançamento</li>
        </ul>
      </div>
      <div className="pre-reserva-metodos" aria-label="Formas de pagamento">
        {METODOS.map(m => <span key={m}>{m}</span>)}
      </div>
      {temLink ? (
        <>
          <a className="botao prevenda-botao" href={LINK_PRE_RESERVA}>Pagar {VALOR_PRE_RESERVA} e entrar no primeiro dia</a>
          <p className="pre-reserva-nota">Pagamento seguro na Stripe. Voltas a este site no fim.</p>
        </>
      ) : (
        <p className="pre-reserva-nota pre-reserva-nota--aviso">O pagamento abre nos próximos dias. Enviamos-te o link por email assim que estiver ativo.</p>
      )}
      <button type="button" className="prioridades-saltar" onClick={aoAcabar}>{temLink ? 'Prefiro pagar depois' : 'Concluir'}</button>
    </motion.div>
  )
}
