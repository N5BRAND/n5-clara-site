import Simbolo from '../marca/Simbolo.jsx'
import LigacoesLegais from '../legal/LigacoesLegais.jsx'
import Partilhar from '../partilha/Partilhar.jsx'

export default function Rodape() {
  return (
    <footer className="rodape">
      <div className="contentor rodape-linha">
        <Simbolo largura={56} />
        <p className="rodape-nota">N5 Clara</p>
        {/* acesso discreto para agências: o N5 Imobiliário fica fora do percurso de compra da Clara */}
        <a className="rodape-agencias" href="https://agentic.numerocinco.pt" target="_blank" rel="noreferrer">És uma agência? Conhece o N5 Imobiliário</a>
        <Partilhar />
        <LigacoesLegais />
      </div>
    </footer>
  )
}
