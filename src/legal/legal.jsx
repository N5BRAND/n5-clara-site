import React from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import PaginaLegal from './PaginaLegal.jsx'
import '../estilos/fontes.js'
import '../estilos/base.css'
import '../estilos/seccoes.css'
import '../estilos/legal.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <PaginaLegal pagina={document.body.dataset.pagina} />
    </MotionConfig>
  </React.StrictMode>,
)
