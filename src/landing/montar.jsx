import React from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import { iniciarPixel } from '../legal/pixel.js'
import { iniciarAnalitica, marcar } from '../legal/analitica.js'
import { iniciarIndicacoes } from '../logica/indicacoes.js'
import { iniciarOrigem } from '../logica/origem.js'
import { iniciarBrilho } from '../logica/brilho.js'
import { iniciarAssistente } from '../assistente/iniciar.js'
import { PAGINAS, DIAGNOSTICO, ARQUETIPO } from './paginas.js'
import Landing from './Landing.jsx'
import DiagnosticoPagina from './Diagnostico.jsx'
import ArquetipoPagina from './Arquetipo.jsx'
import '../estilos/fontes.js'
import '../estilos/base.css'
import '../estilos/seccoes.css'
import '../estilos/demo.css'
import '../estilos/clara.css'
import '../estilos/legal.css'
import '../estilos/landing.css'

/* cada pasta (leads/, angariacao/, ...) tem o seu index.html com data-landing no body; o conteúdo vem de paginas.js */
const id = document.body.dataset.landing

iniciarPixel()
iniciarAnalitica()
iniciarIndicacoes(marcar)
iniciarOrigem()
iniciarBrilho()
iniciarAssistente()

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      {id === 'diagnostico' ? <DiagnosticoPagina p={DIAGNOSTICO} />
        : id === 'arquetipo' ? <ArquetipoPagina p={ARQUETIPO} />
        : <Landing p={PAGINAS[id]} />}
    </MotionConfig>
  </React.StrictMode>,
)
