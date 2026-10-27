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
          <h1>A tua vaga está garantida.</h1>
          <p>Abrimos 30 vagas por semana a partir de 1 de dezembro, pela ordem do pagamento, e avisamos-te por email do dia em que a Clara começa a trabalhar contigo. Tens 25% de desconto nas 2 primeiras mensalidades do plano Clara (39 € em vez de 53 €), o copiloto para o CRM da tua marca, uma sessão de configuração com a nossa equipa e 12 formações por ano. Os 27 € saem da primeira mensalidade.</p>
          <p>Se escolheste Multibanco, a inscrição fica feita assim que pagares a referência. Queres passar à frente na ordem de entrada? Traz 3 colegas.</p>
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
