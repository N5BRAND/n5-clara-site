/* detalhes técnicos da página principal, recolhidos: quem quer saber como a Clara funciona por dentro abre-os.
   Substitui a secção dos nove agentes (pedido do Pedro, 31/10) */
const AGENTES = [
  { nome: 'Qualificação', faz: 'Responde e qualifica cada lead com o teu guião, em minutos.' },
  { nome: 'Seguimento', faz: 'Faz os follow-ups e lembra-te dos compradores e proprietários parados.' },
  { nome: 'Plano do dia', faz: 'Organiza a tua agenda e as prioridades de cada manhã.' },
  { nome: 'Matching', faz: 'Cruza compradores e imóveis da tua carteira e diz-te porquê.' },
  { nome: 'Documentos', faz: 'Pede e acompanha os documentos de cada imóvel.' },
  { nome: 'Previsão', faz: 'Prevê os negócios que podes fechar e mede os tempos do teu processo.' },
  { nome: 'Memória', faz: 'Transcreve as tuas notas de voz e regista tudo na ficha certa.' },
  { nome: 'Copiloto', faz: 'Preenche e grava o CRM da tua marca por ti.' },
  { nome: 'Chamadas', faz: 'Analisa as chamadas que fazes pela aplicação e faz o coaching.' },
]

const LIGACOES = ['WhatsApp e Meta', 'Google Calendar', 'O teu telefone', 'CRM da tua marca', 'ChatGPT, Claude e Grok Bot']

export default function MaisInfo() {
  return (
    <section data-seccao="mais-info" className="seccao mais-info">
      <div className="contentor">
        <p className="eyebrow">Mais informação</p>
        <details className="mais-info-bloco">
          <summary>Como a Clara funciona por dentro</summary>
          <p>Falas só com a Clara. Por trás, nove agentes tratam cada um de uma parte do teu trabalho:</p>
          <ul className="mais-info-agentes">
            {AGENTES.map(a => <li key={a.nome}><b>{a.nome}.</b> {a.faz}</li>)}
          </ul>
        </details>
        <details className="mais-info-bloco">
          <summary>Com que ferramentas se liga</summary>
          <div className="chips">{LIGACOES.map(l => <span key={l} className="chip">{l}</span>)}</div>
          <p>Na Clara Pro e na Clara Elite também ligas a Clara ao teu ChatGPT, ao teu Claude ou ao teu Grok Bot, e falas com o sistema a partir deles.</p>
        </details>
      </div>
    </section>
  )
}
