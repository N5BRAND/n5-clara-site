import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import { LANCAMENTO, tempoAte } from '../logica/contagem.js'
import Mensalidade from './Mensalidade.jsx'
import Formulario from './FormularioPassos.jsx'
import { PROGRAMA } from '../logica/indicacoes.js'
import { ESGOTADO } from '../logica/pagamento.js'

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

/* extra: campos escondidos que algumas páginas juntam à inscrição (por exemplo, o diagnóstico) */
export default function Lista({ extra } = {}) {
  return (
    <section id="lista" className="seccao escuro prevenda">
      <div className="contentor prevenda-grelha prevenda-grelha--coluna">
        <div className="prevenda-texto">
          <p className="eyebrow">{ESGOTADO ? 'Lista de espera' : 'Inscrição'}</p>
          <h2>1 de dezembro. A Clara começa a trabalhar contigo.</h2>
          <Contagem />
          {ESGOTADO ? (
            <p className="prevenda-lead">
              As 25 licenças com pré-reserva esgotaram e entram a 1 de dezembro. A seguir, abrimos 30 vagas por semana, pela ordem da lista de espera:
              entra já na lista e és dos próximos a ter a tua assistente comercial, com leads respondidas, dia organizado e coaching das tuas chamadas. Sem fidelização.
            </p>
          ) : (
          <p className="prevenda-lead">
            Inscreve-te e és dos primeiros a ter a tua assistente comercial: leads respondidas, dia organizado e coaching das tuas chamadas.
            Há 25 licenças reservadas, com pré-reserva de 27 €: entras no primeiro dia e tens 50% de desconto na primeira mensalidade, o copiloto para o CRM da tua marca, uma sessão de configuração com a nossa equipa e 2 formações incluídas. Sem fidelização.
          </p>
          )}
          <div className="lista-oferta">
            <motion.div
              className="lista-oferta-cartao lista-oferta-cartao--destaque"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <small>{ESGOTADO ? 'Lista de espera' : 'Desconto'}</small>
              <b>{ESGOTADO ? '30 vagas por semana' : '50% no 1.º mês'}</b>
              <p>{ESGOTADO ? 'A partir de 1 de dezembro, pela ordem da lista. Avisamos-te por email quando chegar a tua vez.' : 'Para quem faz a pré-reserva antes de 1 de dezembro: a 1.ª mensalidade do plano Clara fica a 26,50 € em vez de 53 €, e os 27 € da pré-reserva pagam-na.'}</p>
            </motion.div>
            <motion.div
              className="lista-oferta-cartao"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <small>Licenças reservadas</small>
              <b>{ESGOTADO ? 'Esgotadas' : 'Só 25'}</b>
              <p>{ESGOTADO ? 'As 25 licenças com pré-reserva entram a 1 de dezembro.' : 'As 25 licenças com pré-reserva entram a 1 de dezembro. Depois, abrimos 30 vagas por semana, pela ordem da lista de espera.'}</p>
            </motion.div>
            <motion.div
              className="lista-oferta-cartao"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <small>{PROGRAMA.nome}</small>
              <b>3 meses grátis</b>
              <p>Para os {PROGRAMA.vencedores} consultores que trouxerem mais colegas com pré-reserva paga até {PROGRAMA.fim}.</p>
              <a className="botao botao--linha lista-oferta-botao" href={PROGRAMA.pagina}>Quero explorar as minhas oportunidades de ter 3 meses grátis</a>
            </motion.div>
          </div>
          <p className="prevenda-porque"><b>{ESGOTADO ? 'Porquê por vagas?' : 'Porquê só 25 licenças?'}</b> Cada consultor que entra tem a Clara configurada com o acompanhamento da nossa equipa. Para o fazermos bem, reservamos 25 licenças para o primeiro dia. Depois, abrimos 30 vagas por semana, pela ordem da lista de espera.</p>
          {!ESGOTADO && <motion.div
            className="prevenda-reserva prevenda-reserva--explicada"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <p className="prevenda-reserva-titulo">Faz a pré-reserva de 27 € antes de 1 de dezembro, numa das 25 licenças reservadas, e tens <b>50% de desconto na primeira mensalidade</b> do plano Clara. Os 27 € que pagas agora pagam o teu 1.º mês, e os 0,50 € que sobram saem do 2.º.</p>
            <ol className="prevenda-pagamentos" aria-label="Quanto pagas, mês a mês">
              <li><small>Agora</small><b>27 €</b><span>pré-reserva</span></li>
              <li><small>1.º mês</small><b>0 €</b><span>26,50 €, já pagos com a pré-reserva</span></li>
              <li><small>2.º mês</small><b>52,50 €</b><span>53 € menos os 0,50 € que sobram</span></li>
              <li><small>A partir do 3.º</small><b>53 €</b><span>valor do plano Clara</span></li>
            </ol>
            <div className="prevenda-reserva-linha">
            <div className="prevenda-reserva-valor">
              <small>Pré-reserva</small>
              <span>27 €</span>
              <Mensalidade />
            </div>
            <ul className="prevenda-reserva-condicoes">
              <li>Uma das 25 licenças reservadas: entras no primeiro dia, a 1 de dezembro</li>
              <li>Copiloto para o CRM da tua marca incluído</li>
              <li>Sessão de configuração com a equipa da Nº5</li>
              <li>2 formações incluídas, para ti e para a tua equipa até 5 consultores</li>
              <li>Os 27 € pagam a 1.ª mensalidade, já com o desconto</li>
              <li>Sem fidelização: cancelas quando quiseres</li>
              <li>Reembolsável após o dia do lançamento</li>
            </ul>
            </div>
          </motion.div>}
          <Formulario extra={extra} />
        </div>
      </div>
    </section>
  )
}
