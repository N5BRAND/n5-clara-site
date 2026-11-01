import { describe, it, expect } from 'vitest'
import { PAGINAS, CENAS_LANDING, DIAGNOSTICO, TUDO, lerPerfil } from '../src/landing/paginas.js'
import { PERGUNTAS, lerNumero, calcularDiagnostico, resumoDiagnostico } from '../src/logica/diagnostico.js'
import { origemDe, etiquetaPagina, guardarAnuncio, anuncioGuardado } from '../src/logica/origem.js'
import { paraGhl } from '../netlify/ghl.js'
import { PLANOS } from '../src/logica/validar.js'
import { PRODUTO } from '../src/legal/produto.js'

describe('landing pages', () => {
  it('cada página tem a sua reserva e as demonstrações dizem que são exemplos', () => {
    for (const [id, p] of Object.entries(PAGINAS)) {
      expect(p.reserva?.titulo, id).toBeTruthy()
      for (const c of p.cenas) expect(c.exemplo, `${id}/${c.id}`).toMatch(/^(Exemplo|Simulação)/)
    }
    expect(DIAGNOSTICO.reserva.titulo).toBeTruthy()
  })

  it('pontuação é prioridade, não probabilidade, e não há exclusividade prometida', () => {
    const texto = JSON.stringify({ PAGINAS, CENAS_LANDING })
    expect(texto).not.toMatch(/probabilidade|só é contactado uma vez/i)
  })

  it('preços, copiloto e particulares como o Pedro decidiu a 31/10', () => {
    expect(PAGINAS.chamadas.nota.texto).toContain('73,50 € em vez de 147 €')
    expect(PRODUTO.oferta).toContain('73,50 € na Clara Elite (147 € por mês)')
    expect(PAGINAS.reativar.nota.texto).toContain('48,50 € em vez de 97 €')
    expect(PAGINAS.crm.nota.texto).toContain('3 meses desde a ativação')
    expect(PAGINAS.crm.nota.texto).toContain('sem cobrança nem mudança automática')
    expect(PAGINAS.angariacao.plano).toBe('pro')
    expect(PAGINAS.angariacao.nota.texto).toContain('não é exclusiva')
    expect(JSON.stringify(PAGINAS)).not.toMatch(/anunciado no lançamento/)
  })

  it('as páginas da Pro e da Elite não acabam na oferta do plano base', () => {
    expect(PAGINAS.chamadas.plano).toBe('elite')
    expect(PAGINAS.chamadas.nota.texto).toContain('Elite')
    expect(PAGINAS.reativar.plano).toBe('pro')
    for (const p of [PAGINAS.chamadas, PAGINAS.reativar]) expect(p.nota.texto).not.toMatch(/plano Clara/)
  })

  it('nenhuma página fala em IVA', () => {
    expect(PAGINAS.crm.nota.texto).toContain('27 €')
    expect(JSON.stringify({ PAGINAS, CENAS_LANDING, DIAGNOSTICO })).not.toMatch(/\bIVA\b/)
  })

  it('há uma página por ângulo dos anúncios, cada uma com cenas e três passos', () => {
    expect(Object.keys(PAGINAS)).toEqual(['leads', 'angariacao', 'proprietarios', 'dia', 'crm', 'reativar', 'chamadas', 'ia'])
    for (const p of Object.values(PAGINAS)) {
      expect(p.h1 && p.lead && p.titulo && p.descricao).toBeTruthy()
      expect(p.cenas.length).toBeGreaterThan(0)
      expect(p.cenas.every(Boolean)).toBe(true)
      expect(p.passos).toHaveLength(3)
      if (p.plano) expect(PLANOS.some(x => x.id === p.plano)).toBe(true)
    }
  })

  it('a página do ChatGPT e do Claude vende a Pro e diz quando a ligação chega', () => {
    const { ia } = PAGINAS
    expect(ia.plano).toBe('pro')
    expect(ia.nota.texto).toMatch(/Clara Pro e da Clara Elite/)
    expect(ia.nota.texto).toContain('desde o lançamento, a 1 de dezembro')
    expect(ia.nota.texto).not.toContain('segunda fase')
    expect(ia.nota.texto).toContain('Grok Bot')
    expect(ia.nota.texto).not.toMatch(/plano Clara/)
    expect(ia.pecas.titulo).toBeTruthy()
    expect(ia.cenas.map(c => c.canal.logo)).toEqual(['chatgpt', 'claude', undefined])
  })

  it('as cenas novas mostram cada peça num passo que existe', () => {
    for (const c of CENAS_LANDING) {
      for (const m of c.mensagens) expect(m.p).toBeGreaterThanOrEqual(1), expect(m.p).toBeLessThanOrEqual(c.passos)
      for (const k of c.cartoes) expect(k.p).toBeGreaterThanOrEqual(1), expect(k.p).toBeLessThanOrEqual(c.passos)
    }
  })

  it('o texto segue as regras do site: sem aprovação, ilustrativo, aviso de gravação nem travessões', () => {
    const texto = JSON.stringify({ PAGINAS, CENAS_LANDING, DIAGNOSTICO, PERGUNTAS, TUDO })
    expect(texto).not.toMatch(/aprovação|aprovar|ilustrativ|consentimento|aviso de grava|—|–/i)
  })
})

describe('diagnóstico', () => {
  it('aceita números escritos à portuguesa e devolve null para «não sei» ou valores impossíveis', () => {
    expect(lerNumero('30 000 €')).toBe(30000)
    expect(lerNumero('30.000')).toBe(30000)
    expect(lerNumero('12,4')).toBe(12)
    expect(lerNumero('')).toBeNull()
    expect(lerNumero('-3')).toBeNull()
    expect(lerNumero('abc')).toBeNull()
    expect(lerNumero('999999', 5000)).toBeNull()
  })

  it('faz as contas só com os números da pessoa', () => {
    const r = calcularDiagnostico({ leads: 20, resposta: 'horas', negocios: 6, faturacao: 30000, objetivo: 50000, angariacoes: 4, dificuldades: ['tempo', 'documentos'] })
    const objetivo = r.blocos.find(b => b.id === 'objetivo')
    expect(objetivo.numero).toBe('+4')
    expect(objetivo.texto).toContain('5000 €')
    expect(objetivo.texto).toContain('cerca de 10 negócios')
    const leads = r.blocos.find(b => b.id === 'leads')
    expect(leads.numero).toBe('240')
    expect(leads.texto).toContain('1 negócio por cada 40 leads')
    expect(leads.texto).toContain('a Clara responde em minutos')
    expect(r.focos.map(f => f.id)).toEqual(['resposta', 'tempo', 'documentos'])
    expect(r.plano).toBe('clara')
  })

  it('recomenda a Pro a quem tem falta de leads e não inventa números quando a pessoa não sabe', () => {
    const r = calcularDiagnostico({ leads: null, negocios: null, faturacao: null, objetivo: null, angariacoes: null, dificuldades: ['falta-leads'] })
    expect(r.blocos).toEqual([])
    expect(r.plano).toBe('pro')
    expect(r.resumo).toContain('não sei')
  })

  it('o resumo leva todas as perguntas', () => {
    const resumo = resumoDiagnostico({ anos: '2-5', dificuldades: ['credito'] })
    expect(resumo.split(' | ')).toHaveLength(PERGUNTAS.length)
    expect(resumo).toContain('2 a 5 anos')
    expect(resumo).toContain('Crédito')
  })
})

describe('origem da inscrição', () => {
  it('junta a página e o anúncio, sem mais nada do endereço', () => {
    expect(origemDe('/leads/', '?utm_source=meta&utm_content=c01_leads&email=x@y.pt')).toBe('/leads/ · c01_leads')
    expect(origemDe('/', '')).toBe('/')
    expect(origemDe('/crm/', '?utm_content=<script>')).toBe('/crm/ · script')
  })

  it('guarda o anúncio da chegada durante a visita, para a inscrição noutra página contar para ele', () => {
    const mem = new Map()
    const arm = { getItem: k => mem.get(k) ?? null, setItem: (k, v) => mem.set(k, String(v)) }
    expect(guardarAnuncio('?utm_source=meta&utm_content=cla_n2_leads', arm)).toBe('cla_n2_leads')
    expect(anuncioGuardado(arm)).toBe('cla_n2_leads')
    expect(origemDe('/', '', arm)).toBe('/ · cla_n2_leads')
    // o anúncio do endereço manda sobre o guardado
    expect(origemDe('/dia/', '?utm_content=cla_n3_dia', arm)).toBe('/dia/ · cla_n3_dia')
    expect(guardarAnuncio('?utm_source=meta', arm)).toBeNull()
    expect(anuncioGuardado(null)).toBeNull()
  })

  it('dá uma etiqueta por página ao GHL', () => {
    expect(etiquetaPagina('/leads/ · c01_leads')).toBe('pagina-leads')
    expect(etiquetaPagina('/')).toBe('pagina-inicio')
    expect(etiquetaPagina('')).toBeNull()
  })

  it('a inscrição chega ao GHL com a página e o diagnóstico', () => {
    const r = paraGhl('lista-clara', { nome: 'Rui', email: 'rui@rede.pt', agencia: 'Rede', plano: 'pro', origem: '/diagnostico/ · c16', diagnostico: 'Leads por mês? 20' })
    expect(r.etiquetas).toEqual(['n5-clara', 'lista-clara', 'plano-pro', 'pagina-diagnostico'])
    expect(r.nota).toContain('Página: /diagnostico/ · c16')
    expect(r.nota).toContain('Diagnóstico: Leads por mês? 20')
  })

  it('o diagnóstico sem email não vai para o GHL', () => {
    expect(paraGhl('diagnostico', { respostas: 'x' })).toBeNull()
  })
})

describe('tudo num sítio (/tudo/)', () => {
  it('o topo muda com ?perfil= e um valor desconhecido fica no geral', () => {
    expect(lerPerfil('?perfil=rede')).toBe('rede')
    expect(lerPerfil('?perfil=conta-propria&utm_content=cla_pos_conta_propria')).toBe('conta-propria')
    expect(lerPerfil('?perfil=outra')).toBe('geral')
    expect(lerPerfil('')).toBe('geral')
    expect(TUDO.perfis.geral.h1).toBe('Tudo num sítio.')
    expect(TUDO.perfis.rede.h1).toBe('Não precisas de trocar de CRM.')
    for (const p of Object.values(TUDO.perfis)) expect(p.h1 && p.lead).toBeTruthy()
  })

  it('o copiloto usa o texto da página /crm/ e a ficha diz que é um exemplo', () => {
    expect(TUDO.crmMarca.nota).toBe(PAGINAS.crm.nota)
    expect(TUDO.ficha.exemplo).toMatch(/^Exemplo/)
    expect(TUDO.cena.exemplo).toMatch(/^Exemplo/)
    for (const m of TUDO.cena.mensagens) expect(m.p).toBeLessThanOrEqual(TUDO.cena.passos)
    expect(TUDO.plano).toBe('clara')
  })

  it('fala das fichas de contactos e imóveis como os anúncios, e o histórico fica de fora', () => {
    const texto = JSON.stringify(TUDO)
    expect(TUDO.conta.parcelas[0].texto).toContain('Fichas de contactos e imóveis')
    expect(TUDO.excel.linhas[0][1]).toContain('Fichas de contactos e imóveis')
    expect(TUDO.perfis.geral.lead).toContain('contactos e imóveis')
    expect(TUDO.perfis['conta-propria'].lead).toContain('Fichas de contactos e imóveis')
    expect(texto).not.toMatch(/histórico/i)
    expect(texto).not.toMatch(/\bIVA\b/)
  })
})
