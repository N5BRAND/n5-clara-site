import Topo from './secoes/Topo.jsx'
import Hero from './secoes/Hero.jsx'
import Promessas from './secoes/Promessas.jsx'
import Dia from './dia/Dia.jsx'
import Agentes from './secoes/Agentes.jsx'
import Copiloto from './secoes/Copiloto.jsx'
import Saber from './secoes/Saber.jsx'
import Planos from './secoes/Planos.jsx'
import Cresce from './secoes/Cresce.jsx'
import Lista from './secoes/Lista.jsx'
import Rodape from './secoes/Rodape.jsx'

export default function App() {
  return (
    <>
      <Topo />
      <main>
        <Hero />
        <Promessas />
        <Dia />
        <Agentes />
        <Copiloto />
        <Saber />
        <Planos />
        <Cresce />
        <Lista />
      </main>
      <Rodape />
    </>
  )
}
