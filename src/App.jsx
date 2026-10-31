import Topo from './secoes/Topo.jsx'
import Hero from './secoes/Hero.jsx'
import Video from './secoes/Video.jsx'
import Promessas from './secoes/Promessas.jsx'
import Dia from './dia/Dia.jsx'
import Copiloto from './secoes/Copiloto.jsx'
import Saber from './secoes/Saber.jsx'
import Planos from './secoes/Planos.jsx'
import MaisInfo from './secoes/MaisInfo.jsx'
import Lista from './secoes/Lista.jsx'
import Rodape from './secoes/Rodape.jsx'
import AvisoCookies from './legal/AvisoCookies.jsx'

export default function App() {
  return (
    <>
      <Topo />
      <main>
        <Hero />
        <Video />
        <Promessas />
        <Dia />
        <Copiloto />
        <Saber />
        <Planos />
        <MaisInfo />
        <Lista />
      </main>
      <Rodape />
      <AvisoCookies />
    </>
  )
}
