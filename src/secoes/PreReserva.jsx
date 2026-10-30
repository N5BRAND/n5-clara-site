import { motion } from 'motion/react'
import { useState } from 'react'
import Mensalidade from './Mensalidade.jsx'
import { evento } from '../legal/pixel.js'
import { marcar } from '../legal/analitica.js'
import { LINK_PRE_RESERVA, VALOR_PRE_RESERVA, VALOR_EUROS, METODOS, linkValido } from '../logica/pagamento.js'
import { linkPagamento } from '../logica/indicacoes.js'

/* passo 3, depois das prioridades: pagar a pré-reserva na Stripe; não há opção de pagar depois.
   Se a pessoa veio por indicação, o código de quem indicou segue para a Stripe (Passa a Clara). */
export default function PreReserva({ aoAcabar, indicacao = null }) {
  const temLink = linkValido(LINK_PRE_RESERVA)
  const destino = linkPagamento(LINK_PRE_RESERVA, indicacao)
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
          <li>50% na 1.ª mensalidade: os 27 € pagam o teu 1.º mês</li>
          <li>Uma das 25 licenças: entras no primeiro dia</li>
          <li>Copiloto do CRM, sessão de configuração e 2 formações incluídas</li>
          <li>Os 0,50 € que sobram saem do 2.º mês: 52,50 €</li>
          <li>Sem fidelização. Reembolsável após o dia do lançamento</li>
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
          {aceito ? <a className="botao prevenda-botao" href={destino} onClick={() => { evento('InitiateCheckout', { value: VALOR_EUROS, currency: 'EUR' }); marcar('pagamento_aberto') }}>Pagar {VALOR_PRE_RESERVA} e garantir a minha vaga</a> : <button type="button" className="botao prevenda-botao" disabled>Pagar {VALOR_PRE_RESERVA} e garantir a minha vaga</button>}
          <p className="pre-reserva-nota">Pagamento seguro na Stripe. Voltas a este site no fim.</p>
        </>
      ) : (
        <p className="pre-reserva-nota pre-reserva-nota--aviso">O pagamento abre nos próximos dias. Enviamos-te o link por email assim que estiver ativo.</p>
      )}
      {!temLink && <button type="button" className="prioridades-saltar" onClick={aoAcabar}>Concluir</button>}
    </motion.div>
  )
}
