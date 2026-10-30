import React from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig, motion } from 'motion/react'
import Simbolo from '../marca/Simbolo.jsx'
import Partilhar from '../partilha/Partilhar.jsx'
import { TEXTOS } from '../logica/partilha.js'
import { iniciarPixel, evento } from '../legal/pixel.js'
import { iniciarAnalitica, marcar } from '../legal/analitica.js'
import { VALOR_EUROS } from '../logica/pagamento.js'
import { PROGRAMA, meuCodigo, ligacaoPessoal, iniciarIndicacoes } from '../logica/indicacoes.js'
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
          <h1>A tua licença está garantida.</h1>
          <p>És um dos 25 consultores que entram no primeiro dia: a 1 de dezembro a Clara começa a trabalhar contigo. Tens 50% de desconto na 1.ª mensalidade do plano Clara e os 27 € já a pagam: pagas 0 € no 1.º mês, 52,50 € no 2.º e 53 € a partir do 3.º. Tens também o copiloto para o CRM da tua marca, uma sessão de configuração com a nossa equipa e 2 formações incluídas, para ti e para a tua equipa.</p>
          <p>Se escolheste Multibanco, a inscrição fica feita assim que pagares a referência.</p>
          <p><b>{PROGRAMA.nome}.</b> Os {PROGRAMA.vencedores} consultores que trouxerem mais colegas com pré-reserva paga até {PROGRAMA.fim} ganham {PROGRAMA.premio}.{codigo ? <> O teu código é <b>{codigo}</b>.</> : null}</p>
          <a className="botao" href={`https://wa.me/?text=${encodeURIComponent(PARTILHA)}`} target="_blank" rel="noreferrer">Partilhar no WhatsApp</a>
          <Partilhar texto={TEXTOS.inscrito} codigo={codigo} rotulo="Partilhar no LinkedIn, Facebook ou Instagram" />
          <a className="confirmada-voltar" href={PROGRAMA.pagina}>Ver a minha contagem no {PROGRAMA.nome}</a>
          <a className="confirmada-voltar" href="/">Voltar ao site</a>
        </motion.div>
      </div>
    </main>
  )
}

/* Purchase uma vez por sessão, mesmo que a página seja recarregada */
iniciarPixel()
iniciarAnalitica()
iniciarIndicacoes(marcar)
try {
  if (!sessionStorage.getItem('n5-compra-registada')) {
    evento('Purchase', { value: VALOR_EUROS, currency: 'EUR' })
    marcar('pre_reserva_paga')
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
