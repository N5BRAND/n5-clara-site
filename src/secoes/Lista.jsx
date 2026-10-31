import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import { LANCAMENTO, tempoAte } from '../logica/contagem.js'
import OQuePagas from './OQuePagas.jsx'
import Formulario from './FormularioPassos.jsx'
import { ESGOTADO, PRE_RESERVA, OFERTA } from '../logica/pagamento.js'

function Contagem() {
  const [t, setT] = useState(() => tempoAte(LANCAMENTO))
  useEffect(() => {
    const i = setInterval(() => setT(tempoAte(LANCAMENTO)), 1000)
    return () => clearInterval(i)
  }, [])
  const partes = [['dias', t.dias], ['horas', t.horas], ['min', t.minutos], ['seg', t.segundos]]
  return (
    <div className="contagem" aria-label={`Faltam ${t.dias} dias para o lançamento`}>
      {partes.map(([r, v]) => (
        <div key={r} className="contagem-parte">
          <span className="contagem-num">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={v} initial={{ y: '-60%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '60%', opacity: 0 }} transition={{ duration: 0.3 }}>
                {String(v).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="contagem-rotulo">{r}</span>
        </div>
      ))}
    </div>
  )
}

/* as 25 vagas são as mesmas em todas as páginas da Clara: uma frase só, igual em todo o lado */
export const VAGAS = 'Nesta primeira fase, disponibilizamos 25 vagas com as condições de lançamento. São as mesmas vagas em todas as páginas da Clara.'

/* título e frase do bloco quando a página não traz os seus */
export const RESERVA = { titulo: '1 de dezembro. A Clara começa a trabalhar contigo.', texto: 'Leads respondidas, dia organizado e oportunidades acompanhadas, desde o primeiro dia.' }

/* extra: campos escondidos que algumas páginas juntam à inscrição (por exemplo, o diagnóstico)
   aviso: nas landing pages, o que a página prometeu e quando chega, junto à oferta
   reserva: título e frase ligados ao benefício da página; plano: o plano que a página já escolheu, mostrado no resumo */
export default function Lista({ extra, aviso, reserva = RESERVA, plano = '' } = {}) {
  return (
    <section id="lista" className="seccao escuro prevenda">
      <div className="contentor prevenda-grelha prevenda-grelha--coluna">
        <div className="prevenda-texto">
          <p className="eyebrow">{ESGOTADO ? 'Lista de espera' : 'Reserva'}</p>
          <h2>{ESGOTADO ? RESERVA.titulo : reserva.titulo || RESERVA.titulo}</h2>
          <Contagem />
          {ESGOTADO ? (
            <>
              <p className="prevenda-lead">
                As 25 licenças com pré-reserva esgotaram e entram a 1 de dezembro. A seguir, abrimos 30 vagas por semana, pela ordem da lista de espera:
                entra já na lista e és dos próximos a ter a tua assistente comercial, com leads respondidas, dia organizado e coaching das tuas chamadas. Sem fidelização.
              </p>
              {aviso && <p className="lp-aviso"><b>{aviso.titulo}.</b> {aviso.texto}</p>}
              <div className="lista-oferta">
                <div className="lista-oferta-cartao lista-oferta-cartao--destaque">
                  <small>Lista de espera</small>
                  <b>30 vagas por semana</b>
                  <p>A partir de 1 de dezembro, pela ordem da lista. Avisamos-te por email quando chegar a tua vez.</p>
                </div>
                <div className="lista-oferta-cartao">
                  <small>Licenças reservadas</small>
                  <b>Esgotadas</b>
                  <p>As 25 licenças com pré-reserva entram a 1 de dezembro.</p>
                </div>
              </div>
              <p className="prevenda-porque"><b>Porquê por vagas?</b> Cada consultor que entra tem a Clara configurada com o acompanhamento da nossa equipa. Para o fazermos bem, reservamos 25 licenças para o primeiro dia. Depois, abrimos 30 vagas por semana, pela ordem da lista de espera.</p>
            </>
          ) : (
            <>
              <p className="prevenda-lead">{reserva.texto || RESERVA.texto}</p>
              {aviso && <p className="lp-aviso"><b>{aviso.titulo}.</b> {aviso.texto}</p>}
              <motion.div
                className="prevenda-reserva prevenda-reserva--explicada"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <p className="prevenda-reserva-titulo">A pré-reserva é de <b>{PRE_RESERVA}</b> e {OFERTA.resumo}. <b>Sem fidelização.</b></p>
                <OQuePagas />
                <ul className="prevenda-reserva-condicoes">
                  <li>Uma das 25 vagas com as condições de lançamento: entras a 1 de dezembro</li>
                  <li>Copiloto para o CRM da tua marca durante 3 meses, sessão de configuração com a equipa da Nº5 e 2 formações, para ti e para a tua equipa até 5 consultores</li>
                  <li>Reembolsável após o dia do lançamento, nas <a href="/termos/#pre-reserva" target="_blank" rel="noreferrer">condições da pré-reserva</a></li>
                </ul>
              </motion.div>
              <p className="prevenda-porque">{VAGAS}</p>
            </>
          )}
          <Formulario extra={extra} plano={plano} />
        </div>
      </div>
    </section>
  )
}
