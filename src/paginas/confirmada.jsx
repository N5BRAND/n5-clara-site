import React from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig, motion } from 'motion/react'
import Simbolo from '../marca/Simbolo.jsx'
import Partilhar from '../partilha/Partilhar.jsx'
import OQuePagas from '../secoes/OQuePagas.jsx'
import { TEXTOS } from '../logica/partilha.js'
import { iniciarPixel, evento, idDaCompra } from '../legal/pixel.js'
import { iniciarAnalitica, marcar } from '../legal/analitica.js'
import { OFERTA, VALOR_EUROS } from '../logica/pagamento.js'
import { PROGRAMA, meuCodigo, ligacaoPessoal, iniciarIndicacoes } from '../logica/indicacoes.js'
import { iniciarAssistente } from '../assistente/iniciar.js'
import '../estilos/fontes.js'
import '../estilos/base.css'
import '../estilos/seccoes.css'
import '../estilos/legal.css'

/* o código Passa a Clara fica no navegador onde a pessoa se inscreveu; sem ele, partilha-se o site */
const codigo = (() => { try { return meuCodigo(window.localStorage) } catch { return null } })()
const PARTILHA = `${TEXTOS.inscrito} ${codigo ? ligacaoPessoal(codigo, 'whatsapp') : 'https://clara.numerocinco.pt/'}`

/* página para onde a Stripe devolve quem pagou a pré-reserva */
function Confirmada() {
  return (
    <main className="seccao escuro confirmada">
      <div className="contentor confirmada-caixa">
        <Simbolo fundo="escuro" largura={96} desenhar />
        <motion.div className="confirmada-texto" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
          <p className="eyebrow">Inscrição confirmada</p>
          <h1>A tua vaga está garantida.</h1>
          <p>Tens uma das 25 vagas com as condições de lançamento: a 1 de dezembro a Clara começa a trabalhar contigo. A pré-reserva {OFERTA.resumo}. Tens também o copiloto para o CRM da tua marca durante 3 meses, uma sessão de configuração com a nossa equipa e 2 formações incluídas, para ti e para a tua equipa. Sem fidelização.</p>
          <OQuePagas compacto />
          <p>Se escolheste Multibanco, a inscrição fica feita assim que pagares a referência.</p>
          <p><b>{PROGRAMA.nome}.</b> {PROGRAMA.resumo}{codigo ? <> O teu código é <b>{codigo}</b>.</> : null}</p>
          <a className="botao" href={`https://wa.me/?text=${encodeURIComponent(PARTILHA)}`} target="_blank" rel="noreferrer">Partilhar no WhatsApp</a>
          <Partilhar texto={TEXTOS.inscrito} codigo={codigo} rotulo="Partilhar no LinkedIn, Facebook ou Instagram" />
          <a className="confirmada-voltar" href={PROGRAMA.pagina}>Ver a minha contagem no {PROGRAMA.nome}</a>
          <a className="confirmada-voltar" href="/">Voltar ao site</a>
        </motion.div>
      </div>
    </main>
  )
}

/* Purchase uma vez por sessão, mesmo que a página seja recarregada.
   Só com o id da sessão da Stripe no endereço (o Payment Link volta com ?session_id={CHECKOUT_SESSION_ID}): quem abre a
   página sem ter passado pela Stripe não conta como compra. O id é o event_id do Purchase que o N5 Controlo envia pelo
   servidor, por isso a Meta conta uma compra só.
   Com VITE_COMPRA_PELO_SERVIDOR=1 (API de Conversões ligada no N5 Controlo), a compra vai só pelo servidor quando a Stripe
   confirma o pagamento, também no Multibanco: assim a referência por pagar não conta. */
const COMPRA_PELO_SERVIDOR = import.meta.env.VITE_COMPRA_PELO_SERVIDOR === '1'
const COMPRA = idDaCompra()
iniciarPixel()
iniciarAnalitica()
iniciarIndicacoes(marcar)
iniciarAssistente()
try {
  if (!sessionStorage.getItem('n5-compra-registada')) {
    if (COMPRA && !COMPRA_PELO_SERVIDOR) evento('Purchase', { value: VALOR_EUROS, currency: 'EUR' }, COMPRA)
    marcar('pre_reserva_paga')
    /* os emails de seguimento param (netlify/functions/pagou.mjs) */
    if (codigo) fetch('/api/pagou', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ codigo }), keepalive: true }).catch(() => {})
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
