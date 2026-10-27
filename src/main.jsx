import React from 'react'
import { createRoot } from 'react-dom/client'
import { iniciarPixel } from './legal/pixel.js'
import { MotionConfig } from 'motion/react'
import App from './App.jsx'
import './estilos/fontes.js'
import './estilos/base.css'
import './estilos/seccoes.css'
import './estilos/demo.css'
import './estilos/clara.css'
import './estilos/legal.css'

iniciarPixel()

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </React.StrictMode>,
)
