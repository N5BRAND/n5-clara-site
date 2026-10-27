import { motion } from 'motion/react'

const PLANOS = [
  {
    id: 'clara', nome: 'Clara', para: 'Para teres o dia organizado e nenhuma lead perdida.',
    inclui: ['Qualificação automática com o teu guião', 'Plano do dia por prioridade', 'Notas de voz que se registam sozinhas', 'Checklist de documentos por imóvel', 'Reativação de contactos parados'],
  },
  {
    id: 'pro', nome: 'Clara Pro', para: 'Para quem investe em anúncios e quer tirar mais da base.',
    antes: 'Tudo da Clara, mais:',
    inclui: ['Reativação trimestral de toda a tua base', 'Marketing com IA', 'Mais capacidade de IA'],
  },
  {
    id: 'elite', nome: 'Clara Elite', para: 'Para quem vive ao telefone.', destaque: true,
    antes: 'Tudo do Pro, mais:',
    inclui: ['Chamadas pela Clara com o teu número', 'Gravação e transcrição na ficha do cliente', 'Coaching diário das chamadas', 'Relatórios diário, semanal e mensal', 'Copiloto para o CRM da tua marca', '500 minutos de chamadas incluídos'],
  },
]

/* escolher um plano preenche o formulário da lista de espera e leva até lá */
const escolher = id => {
  window.dispatchEvent(new CustomEvent('escolher-plano', { detail: id }))
  document.getElementById('lista')?.scrollIntoView({ behavior: 'smooth' })
}

export default function Planos() {
  return (
    <section id="planos" className="seccao planos">
      <div className="contentor">
        <div className="seccao-cabeca">
          <p className="eyebrow">Planos</p>
          <h2>Três planos. Escolhe o que se parece contigo.</h2>
        </div>
        <div className="planos-grelha">
          {PLANOS.map((p, i) => (
            <motion.article
              key={p.id}
              className={`cartao plano ${p.destaque ? 'plano--destaque' : ''}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 140, damping: 20, delay: i * 0.12 }}
            >
              {p.destaque && <span className="etiqueta plano-etiqueta">Com chamadas</span>}
              <h3>{p.nome}</h3>
              <p className="plano-para">{p.para}</p>
              {p.antes && <span className="plano-antes">{p.antes}</span>}
              <ul>{p.inclui.map(t => <li key={t}>{t}</li>)}</ul>
              <button type="button" className={`botao ${p.destaque ? '' : 'botao--linha'} plano-botao`} onClick={() => escolher(p.id)}>
                Quero a {p.nome}
              </button>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
