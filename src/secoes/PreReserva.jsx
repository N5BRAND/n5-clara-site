import { motion } from 'motion/react'
import { useState } from 'react'
import OQuePagas from './OQuePagas.jsx'
import { evento, novoIdEvento, cliqueSimples, ESPERA_ANTES_DE_SAIR } from '../legal/pixel.js'
import { marcar } from '../legal/analitica.js'
import { LINK_PRE_RESERVA, PRE_RESERVA, VALOR_EUROS, METODOS, linkValido } from '../logica/pagamento.js'
import { linkPagamento } from '../logica/indicacoes.js'

/* passo 3, depois das prioridades: pagar a pré-reserva na Stripe; não há opção de pagar depois.
   Se a pessoa veio por indicação, o código de quem indicou segue para a Stripe (Passa a Clara). */
export default function PreReserva({ aoAcabar, indicacao = null, plano = '' }) {
  const temLink = linkValido(LINK_PRE_RESERVA)
  const destino = linkPagamento(LINK_PRE_RESERVA, indicacao)
  const [aceito, setAceito] = useState(false)

  /* InitiateCheckout antes de ir para a Stripe; se seguiu para a Meta, dá-lhe tempo de sair antes de mudar de página */
  function pagar(e) {
    marcar('pagamento_aberto')
    const enviado = evento('InitiateCheckout', { value: VALOR_EUROS, currency: 'EUR' }, novoIdEvento())
    if (enviado && cliqueSimples(e)) {
      e.preventDefault()
      setTimeout(() => window.location.assign(destino), ESPERA_ANTES_DE_SAIR)
    }
  }

  return (
    <motion.div key="pre-reserva" className="pre-reserva" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <p className="prioridades-feito">✓ Dados guardados.</p>
      <h3>Último passo: a pré-reserva</h3>
      <dl className="pre-reserva-resumo">
        {plano && <div><dt>Plano escolhido</dt><dd>{plano}</dd></div>}
        <div className="pre-reserva-total"><dt>Pré-reserva: total a pagar agora</dt><dd>{PRE_RESERVA}</dd></div>
      </dl>
      <OQuePagas compacto />
      <ul className="pre-reserva-inclui">
        <li>Uma das 25 vagas com as condições de lançamento: entras a 1 de dezembro</li>
        <li>Copiloto do CRM, sessão de configuração e 2 formações incluídas</li>
        <li>Reembolsável após o dia do lançamento</li>
      </ul>
      <div className="pre-reserva-metodos" aria-label="Formas de pagamento">
        {METODOS.map(m => <span key={m}>{m}</span>)}
      </div>
      {temLink ? (
        <>
          <label className="pre-reserva-aceito">
            <input type="checkbox" checked={aceito} onChange={e => setAceito(e.target.checked)} />
            <span>Li e aceito as <a href="/termos/#pre-reserva" target="_blank" rel="noreferrer">condições da pré-reserva e do reembolso</a>.</span>
          </label>
          {aceito ? <a className="botao prevenda-botao" href={destino} onClick={pagar}>Pagar {PRE_RESERVA} e garantir a minha vaga</a> : <button type="button" className="botao prevenda-botao" disabled>Pagar {PRE_RESERVA} e garantir a minha vaga</button>}
          <p className="pre-reserva-nota">Pagamento seguro na Stripe. Voltas a este site no fim.</p>
        </>
      ) : (
        <p className="pre-reserva-nota pre-reserva-nota--aviso">O pagamento abre nos próximos dias. Enviamos-te o link por email assim que estiver ativo.</p>
      )}
      {!temLink && <button type="button" className="prioridades-saltar" onClick={aoAcabar}>Concluir</button>}
    </motion.div>
  )
}
