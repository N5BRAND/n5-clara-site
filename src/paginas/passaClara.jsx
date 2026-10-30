import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig, motion } from 'motion/react'
import Simbolo from '../marca/Simbolo.jsx'
import Partilhar, { copiar } from '../partilha/Partilhar.jsx'
import AvisoCookies from '../legal/AvisoCookies.jsx'
import LigacoesLegais from '../legal/LigacoesLegais.jsx'
import { iniciarPixel } from '../legal/pixel.js'
import { iniciarAnalitica, marcar } from '../legal/analitica.js'
import { EMPRESA } from '../legal/empresa.js'
import { TEXTOS } from '../logica/partilha.js'
import { PROGRAMA, meuCodigo, ligacaoPessoal, iniciarIndicacoes } from '../logica/indicacoes.js'
import '../estilos/fontes.js'
import '../estilos/base.css'
import '../estilos/seccoes.css'
import '../estilos/legal.css'
import '../estilos/passa.css'

const armazenamento = () => { try { return window.localStorage } catch { return null } }

/* mensagens prontas para os três colegas que mais vale convidar */
const CONVITES = [
  {
    quem: 'O colega da tua agência',
    porque: 'Trabalham as mesmas leads e sabem o que custa responder tarde.',
    texto: l => `Olá! Inscrevi-me na N5 Clara, uma assistente que responde às leads em minutos e organiza o dia. Lança a 1 de dezembro. Se fizeres a pré-reserva por esta ligação, contas como indicação minha: ${l}`,
  },
  {
    quem: 'O teu team leader',
    porque: 'Decide pela equipa. A pré-reserva inclui 2 formações para a equipa, até 5 consultores.',
    texto: l => `Vi isto e lembrei-me da equipa: a N5 Clara responde às leads de cada consultor em minutos e preenche o CRM por nós. A pré-reserva inclui 2 formações para a equipa, até 5 consultores. Vê aqui: ${l}`,
  },
  {
    quem: 'Quem partilha negócios contigo',
    porque: 'Consultores de outras agências com quem já fechaste negócios.',
    texto: l => `Já que partilhamos negócios: a N5 Clara responde às leads em minutos, a qualquer hora, e organiza o dia. Lança a 1 de dezembro. Vê aqui: ${l}`,
  },
]

const PASSOS = [
  ['Inscreve-te', 'Na inscrição recebes o teu código de 6 letras e a tua ligação pessoal.'],
  ['Passa a Clara', 'Partilha a ligação com colegas pelo WhatsApp, LinkedIn, Facebook ou Instagram, ou dá-lhes o teu código.'],
  ['Soma pré-reservas', `Cada colega que faz a pré-reserva de 27 € soma um traço na tua contagem. A ${PROGRAMA.fim}, os ${PROGRAMA.vencedores} com mais traços ganham.`],
]

/* a contagem ao vivo vem da função da Netlify, que lê a Stripe; só números, nunca nomes */
function Contagem({ codigo }) {
  const [c, setC] = useState(null)
  useEffect(() => {
    let vivo = true
    fetch(`/.netlify/functions/contagem?codigo=${encodeURIComponent(codigo)}`)
      .then(r => (r.ok ? r.json() : { disponivel: false }))
      .catch(() => ({ disponivel: false }))
      .then(r => { if (vivo) setC(r) })
    return () => { vivo = false }
  }, [codigo])

  if (!c) return <p className="passa-contagem-nota">A contar…</p>
  if (!c.disponivel) return <p className="passa-contagem-nota">A contagem ao vivo aparece aqui em breve. Entretanto, todas as pré-reservas com o teu código já estão a contar.</p>
  return (
    <div className="passa-contagem">
      <div className="passa-contagem-num">
        <b>{c.contagem ?? 0}</b>
        <span>{c.contagem === 1 ? 'pré-reserva paga com o teu código' : 'pré-reservas pagas com o teu código'}</span>
      </div>
      <ul>
        {c.posicao ? <li>Estás em <b>{c.posicao}.º</b> lugar.</li> : null}
        <li>Para estares hoje no top {PROGRAMA.vencedores}, precisas de <b>{c.corte}</b> {c.corte === 1 ? 'pré-reserva paga' : 'pré-reservas pagas'}.</li>
        <li><b>{c.participantes}</b> {c.participantes === 1 ? 'consultor já tem' : 'consultores já têm'} pelo menos uma.</li>
      </ul>
    </div>
  )
}

function Convite({ c, ligacao }) {
  const [copiado, setCopiado] = useState(false)
  const texto = c.texto(ligacao)
  return (
    <article className="passa-convite">
      <h3>{c.quem}</h3>
      <p className="passa-convite-porque">{c.porque}</p>
      <p className="passa-convite-texto">{texto}</p>
      <button type="button" className="botao botao--linha" onClick={() => { copiar(texto); setCopiado(true); marcar('passa_mensagem_copiada', { quem: c.quem }) }}>
        {copiado ? 'Copiada' : 'Copiar mensagem'}
      </button>
    </article>
  )
}

function PassaClara() {
  const [codigo] = useState(() => meuCodigo(armazenamento()))
  const [copiada, setCopiada] = useState(false)
  const ligacao = codigo ? ligacaoPessoal(codigo) : 'https://clara.numerocinco.pt/'
  const whatsapp = `${TEXTOS.inscrito} ${codigo ? ligacaoPessoal(codigo, 'whatsapp') : ligacao}`

  return (
    <>
      <header className="legal-topo">
        <div className="contentor legal-topo-linha">
          <a href="/" className="topo-marca legal-marca" aria-label="N5 Clara, início">
            <Simbolo largura={40} />
            <span>N5 Clara</span>
          </a>
          <a href="/#lista" className="legal-voltar">Lista de espera</a>
        </div>
      </header>

      <main>
        <section className="seccao escuro passa-hero">
          <div className="contentor passa-hero-grelha">
            <div>
              <p className="eyebrow">Programa de indicações · até {PROGRAMA.fim}</p>
              <h1>{PROGRAMA.nome}.</h1>
              <p className="passa-lead">Conheces consultores que perdem leads por não responderem a tempo? Passa-lhes a Clara. Os {PROGRAMA.vencedores} consultores que trouxerem mais colegas com pré-reserva paga até {PROGRAMA.fim} ganham {PROGRAMA.premio}.</p>
              {codigo
                ? <a className="botao" href="#a-tua-ligacao">Partilhar a minha ligação</a>
                : <a className="botao" href="/#lista">Inscrever-me e receber a minha ligação</a>}
            </div>
            <motion.div className="passa-hero-simbolo" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Simbolo fundo="escuro" largura={260} desenhar titulo="Cada colega que entra soma um traço" />
              <p>Cada colega que entra soma um traço.</p>
            </motion.div>
          </div>
        </section>

        <section className="seccao passa-como">
          <div className="contentor">
            <h2>Como funciona</h2>
            <ol className="passa-passos">
              {PASSOS.map(([t, d], k) => (
                <li key={t}><span className="passa-passo-n">{k + 1}</span><b>{t}</b><p>{d}</p></li>
              ))}
            </ol>
          </div>
        </section>

        <section className="seccao passa-ligacao" id="a-tua-ligacao">
          <div className="contentor">
            <div className="cartao passa-cartao">
              {codigo ? (
                <>
                  <p className="eyebrow">A tua ligação</p>
                  <h2>O teu código é <span className="passa-codigo">{codigo}</span></h2>
                  <div className="passa-ligacao-linha">
                    <code>{ligacao}</code>
                    <button type="button" className="botao" onClick={() => { copiar(ligacao); setCopiada(true); marcar('passa_ligacao_copiada') }}>{copiada ? 'Copiada' : 'Copiar ligação'}</button>
                  </div>
                  <div className="passa-partilhar">
                    <a className="botao botao--linha" href={`https://wa.me/?text=${encodeURIComponent(whatsapp)}`} target="_blank" rel="noreferrer" onClick={() => marcar('partilha', { rede: 'whatsapp', indicacao: true })}>Partilhar no WhatsApp</a>
                    <Partilhar texto={TEXTOS.inscrito} codigo={codigo} rotulo="LinkedIn, Facebook ou Instagram" />
                  </div>
                  <h3>A tua contagem</h3>
                  <Contagem codigo={codigo} />
                </>
              ) : (
                <>
                  <p className="eyebrow">A tua ligação</p>
                  <h2>Ainda não tens código.</h2>
                  <p>Inscreve-te na N5 Clara e recebes logo o teu código e a tua ligação pessoal. Ficam guardados neste navegador.</p>
                  <a className="botao" href="/#lista">Inscrever-me</a>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="seccao passa-convidar">
          <div className="contentor">
            <h2>Quem vale a pena convidar</h2>
            <p className="passa-sub">Três colegas, três mensagens prontas{codigo ? ', já com a tua ligação' : ''}.</p>
            <div className="passa-convites">
              {CONVITES.map(c => <Convite key={c.quem} c={c} ligacao={ligacao} />)}
            </div>
          </div>
        </section>

        <section className="seccao passa-regras">
          <div className="contentor passa-regras-grelha">
            <div>
              <h2>Regras</h2>
              <ul>
                <li>Contam as pré-reservas de 27 € pagas até {PROGRAMA.fim} de 2026, às 23h59 de Lisboa, por colegas que se inscrevam pela tua ligação ou com o teu código.</li>
                <li>Ganham os {PROGRAMA.vencedores} consultores com mais pré-reservas pagas, com pelo menos uma. Em caso de empate, ganha quem lá chegou primeiro. Não há sorteio.</li>
                <li>O prémio são 3 meses do plano Clara grátis. Se já fizeste a pré-reserva, não pagas o 2.º, o 3.º e o 4.º mês.</li>
                <li>Não contam pré-reservas tuas, pré-reservas reembolsadas nem pagamentos feitos sem o teu código.</li>
                <li>Os vencedores são anunciados por email a {PROGRAMA.anuncio}.</li>
              </ul>
              <p><a href="/termos/#passa-a-clara">Regulamento completo</a></p>
            </div>
            <div className="passa-faq">
              <h2>Perguntas</h2>
              <details>
                <summary>Tenho de ter feito a pré-reserva para participar?</summary>
                <p>Não. Basta estares inscrito: é a inscrição que te dá o código e a ligação.</p>
              </details>
              <details>
                <summary>Um colega inscreveu-se e não aparece na contagem.</summary>
                <p>A contagem soma quando o colega paga a pré-reserva. Se não veio pela tua ligação, tem de escrever o teu código em «Alguém te falou da Clara?» quando se inscreve.</p>
              </details>
              <details>
                <summary>Perdi a minha ligação.</summary>
                <p>O código fica guardado no navegador onde te inscreveste. Se mudaste de computador ou de telemóvel, escreve-nos para {EMPRESA.email} e reenviamos.</p>
              </details>
              <details>
                <summary>E se eu não ficar no top {PROGRAMA.vencedores}?</summary>
                <p>Os colegas que trouxeste ficam com a Clara e com os 50% de desconto na primeira mensalidade, como toda a gente que faz a pré-reserva.</p>
              </details>
            </div>
          </div>
        </section>
      </main>

      <footer className="rodape">
        <div className="contentor rodape-linha">
          <Simbolo largura={56} />
          <p className="rodape-nota">N5 Clara · {PROGRAMA.nome}</p>
          <LigacoesLegais />
        </div>
      </footer>
      <AvisoCookies />
    </>
  )
}

iniciarPixel()
iniciarAnalitica()
iniciarIndicacoes(marcar)

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <PassaClara />
    </MotionConfig>
  </React.StrictMode>,
)
