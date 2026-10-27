import React from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig, motion } from 'motion/react'
import Simbolo from '../marca/Simbolo.jsx'
import { iniciarPixel, evento } from '../legal/pixel.js'
import { VALOR_EUROS } from '../logica/pagamento.js'
import '../estilos/fontes.js'
import '../estilos/base.css'
import '../estilos/seccoes.css'
import '../estilos/legal.css'

/* mensagem para partilhar com colegas; leva só o endereço do site, sem dados de ninguém */
const PARTILHA = 'Inscrevi-me na N5 Clara, a assistente comercial para consultores imobiliários. Inscreve-te também e põe o meu email em «Quem te indicou»: https://n5-clara.netlify.app/#lista'

/* página para onde a Stripe devolve quem pagou a pré-reserva */
function Confirmada() {
  return (
    <main className="seccao escuro confirmada">
      <div className="contentor confirmada-caixa">
        <Simbolo fundo="escuro" largura={96} desenhar />
        <motion.div className="confirmada-texto" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
          <p className="eyebrow">Inscrição confirmada</p>
          <h1>Entras no primeiro dia.</h1>
          <p>A 1 de dezembro a Clara começa a trabalhar contigo. Os 27 € saem da primeira mensalidade e são reembolsáveis após o dia do lançamento.</p>
          <p>Se escolheste Multibanco, a inscrição fica feita assim que pagares a referência. Antes de 1 de dezembro enviamos-te por email os próximos passos. Queres também a sessão de configuração 1:1? Traz 3 colegas.</p>
          <a className="botao" href={`https://wa.me/?text=${encodeURIComponent(PARTILHA)}`} target="_blank" rel="noreferrer">Partilhar no WhatsApp</a>
          <a className="confirmada-voltar" href="/">Voltar ao site</a>
        </motion.div>
      </div>
    </main>
  )
}

/* Purchase uma vez por sessão, mesmo que a página seja recarregada */
iniciarPixel()
try {
  if (!sessionStorage.getItem('n5-compra-registada')) {
    evento('Purchase', { value: VALOR_EUROS, currency: 'EUR' })
    sessionStorage.setItem('n5-compra-registada', '1')
  }
} catch { /* sem armazenamento: não regista */ }

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <Confirmada />
    </MotionConfig>
  </React.StrictMode>,
)
