import { motion } from 'motion/react'

const PERGUNTAS = [
  'De onde vem o meu negócio?',
  'Respondo depressa?',
  'O que estou a perder?',
  'Onde encravam os meus processos?',
  'Quanto demoro a vender a minha carteira?',
  'Onde caem os meus negócios?',
  'Quanto vou faturar este mês?',
  'Estou a melhorar ao telefone?',
]

const MARCOS = [
  { quando: 'Dia 1', titulo: 'Diagnóstico', texto: 'Dois minutos de conversa com a Clara sobre como trabalhas hoje.' },
  { quando: '30 dias', titulo: 'Primeiro Antes e Depois', texto: 'O que mudou face ao diagnóstico, área a área.' },
  { quando: '90 dias', titulo: 'Segundo Antes e Depois', texto: 'A tendência confirmada e onde ainda podes ganhar tempo.' },
]

export default function Saber() {
  return (
    <section data-seccao="saber" className="seccao saber">
      <div className="contentor">
        <div className="seccao-cabeca">
          <p className="eyebrow">O que passas a saber</p>
          <h2>As perguntas que te fazes, respondidas em segundos.</h2>
          <p>A Clara mede o teu trabalho a partir da tua carteira e compara-o com o teu ponto de partida.</p>
        </div>
        <div className="saber-perguntas">
          {PERGUNTAS.map((q, i) => (
            <motion.div
              key={q}
              className="cartao saber-pergunta"
              initial={{ opacity: 0, y: 24, rotate: -1.5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 160, damping: 18, delay: (i % 4) * 0.08 }}
            >
              <span className="saber-q" aria-hidden="true">?</span>
              {q}
            </motion.div>
          ))}
        </div>

        <div className="saber-linha">
          <motion.span
            className="saber-linha-traco"
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
            aria-hidden="true"
          />
          {MARCOS.map((m, i) => (
            <motion.div
              key={m.quando}
              className="saber-marco"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }}
              transition={{ type: 'spring', stiffness: 160, damping: 20, delay: 0.3 + i * 0.35 }}
            >
              <span className="saber-ponto" />
              <span className="eyebrow">{m.quando}</span>
              <h3>{m.titulo}</h3>
              <p>{m.texto}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
