import React from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import Assistente from './Assistente.jsx'
import '../estilos/assistente.css'

/* uma raiz própria, por cima de qualquer página do site */
export function montar() {
  if (document.getElementById('assistente-raiz')) return
  const raiz = document.createElement('div')
  raiz.id = 'assistente-raiz'
  document.body.appendChild(raiz)
  createRoot(raiz).render(
    <React.StrictMode>
      <MotionConfig reducedMotion="user">
        <Assistente />
      </MotionConfig>
    </React.StrictMode>,
  )
}
