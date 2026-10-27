import Simbolo from '../marca/Simbolo.jsx'
import LigacoesLegais from '../legal/LigacoesLegais.jsx'

export default function Rodape() {
  return (
    <footer className="rodape">
      <div className="contentor rodape-linha">
        <Simbolo largura={56} />
        <p className="rodape-nota">N5 Clara</p>
        <LigacoesLegais />
      </div>
    </footer>
  )
}
