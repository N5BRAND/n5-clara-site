import { useEffect, useState } from 'react'
import { LANCAMENTO, tempoAte } from '../logica/contagem.js'
import { ESGOTADO } from '../logica/pagamento.js'

/* faixa de urgência no topo das landing pages: só factos da oferta (data, licenças, desconto), sem números inventados */
export default function Urgencia() {
  const [t, setT] = useState(() => tempoAte(LANCAMENTO))
  useEffect(() => {
    const i = setInterval(() => setT(tempoAte(LANCAMENTO)), 60000)
    return () => clearInterval(i)
  }, [])
  if (t.terminou) return null

  const itens = [
    { forte: t.dias === 1 ? '1 dia' : `${t.dias} dias`, texto: 'até ao lançamento, a 1 de dezembro' },
    ESGOTADO
      ? { forte: '30 vagas', texto: 'por semana, pela ordem da lista de espera' }
      : { forte: 'Só 25 licenças', texto: 'entram no primeiro dia' },
    ...(ESGOTADO ? [] : [{ forte: '50% no 1.º mês', texto: 'só com pré-reserva antes de 1 de dezembro' }]),
  ]

  return (
    <ul className="lp-urgencia" aria-label="Condições do lançamento">
      {itens.map(i => (
        <li key={i.forte}>
          <b>{i.forte}</b>
          <span>{i.texto}</span>
        </li>
      ))}
    </ul>
  )
}
