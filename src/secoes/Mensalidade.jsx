import { MENSALIDADE } from '../logica/pagamento.js'

/* mensalidade no lançamento; quando há desconto, o valor normal aparece riscado a laranja, como a diagonal do símbolo */
export default function Mensalidade() {
  const { normal, desconto, comDesconto, meses, plano } = MENSALIDADE
  return (
    <div className="mensalidade">
      <span className="mensalidade-rotulo">No lançamento{plano ? `, plano ${plano}` : ''}</span>
      <span className="mensalidade-valores">
        {desconto ? (
          <>
            <s className="riscado" aria-label={`antes ${normal} por mês`}>{normal}</s>
            <b>{comDesconto}/mês</b>
            <em className="mensalidade-desconto">−{desconto}%</em>
          </>
        ) : (
          <b>{normal}/mês</b>
        )}
      </span>
      {meses && <span className="mensalidade-nota">{meses === 1 ? 'na primeira mensalidade' : `nas primeiras ${meses} mensalidades`}</span>}
    </div>
  )
}
