import { OFERTA } from '../logica/pagamento.js'

/* o que a pessoa paga nos próximos meses, passo a passo; o 1.º mês fica em destaque (pedido do Pedro, 31/10).
   recolhido: em <details>, para o bloco da oferta ficar curto; no passo do pagamento fica sempre à vista */
export default function OQuePagas({ compacto = false, recolhido = false }) {
  const lista = (
    <div className={`o-que-pagas ${compacto ? 'o-que-pagas--compacto' : ''}`}>
      <ol aria-label="O que pagas, mês a mês">
        {OFERTA.meses.map(p => (
          <li key={p.quando} className={p.destaque ? 'o-que-pagas-destaque' : undefined}>
            <small>{p.quando}</small>
            <b>{p.valor}</b>
            <span>{p.texto}</span>
          </li>
        ))}
      </ol>
      {OFERTA.nota && <p className="o-que-pagas-nota">{OFERTA.nota}</p>}
    </div>
  )
  if (!recolhido) return lista
  return (
    <details className="o-que-pagas-detalhe">
      <summary>O que pagas, mês a mês</summary>
      {lista}
    </details>
  )
}
