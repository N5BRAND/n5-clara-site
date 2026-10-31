import { describe, it, expect } from 'vitest'
import {
  ARQUETIPOS, PERGUNTAS, DOR_PARA_ARQUETIPO, TITULOS, ORDEM,
  pontuar, escolher, planoDe, porqueDoPlano, resumo, lerDor, tituloDe,
} from '../src/logica/arquetipo.js'
import { ARQUETIPO } from '../src/landing/paginas.js'
import { PLANOS } from '../src/logica/validar.js'

/* as 8 respostas com «Não sei» em todas, para juntar só as que cada teste precisa */
const tudoNaoSei = Object.fromEntries(PERGUNTAS.map(p => [p.id, null]))
const com = r => ({ ...tudoNaoSei, ...r })

describe('teste de arquétipos: o resultado', () => {
  it('cada conjunto de respostas leva ao seu arquétipo', () => {
    expect(escolher(com({ ontem: 'papeis', ligar: 'papeis', registo: 'caderno' })).arquetipo).toBe('bombeiro')
    expect(escolher(com({ ontem: 'imoveis', angariacoes: 'nenhuma', ligar: 'proprietarios' })).arquetipo).toBe('cacador')
    expect(escolher(com({ ontem: 'contactos', ligar: 'whatsapp', resposta: 'dia' })).arquetipo).toBe('malabarista')
    expect(escolher(com({ ontem: 'planeado', ligar: 'lista', mes: 'objetivo' })).arquetipo).toBe('maratonista')
  })

  it('soma os pontos de cada resposta e «Não sei» não dá pontos', () => {
    expect(pontuar(com({ registo: 'por-registar', resposta: 'dia' }))).toEqual({ cacador: 0, bombeiro: 3, malabarista: 4, maratonista: 0 })
    expect(pontuar(tudoNaoSei)).toEqual({ cacador: 0, bombeiro: 0, malabarista: 0, maratonista: 0 })
  })

  it('no empate ganha o arquétipo da P1; sem P1, a ordem Caçador, Bombeiro, Malabarista, Maratonista', () => {
    // Malabarista 3 (P1) contra Caçador 3 (P2)
    expect(escolher(com({ ontem: 'contactos', angariacoes: 'nenhuma' })).arquetipo).toBe('malabarista')
    // P1 «Não sei»: Bombeiro 3 contra Caçador 3
    expect(escolher(com({ ligar: 'papeis', angariacoes: 'nenhuma' })).arquetipo).toBe('cacador')
    // a P1 é de um arquétipo que não está no empate: Caçador 5 contra Bombeiro 5
    expect(escolher(com({ ontem: 'planeado', angariacoes: 'nenhuma', registo: 'sem-visitas', ligar: 'papeis', mes: 'sem-objetivo', resposta: 'dia' })).arquetipo).toBe('cacador')
  })

  it('com tudo «Não sei» usa a dor do anúncio; sem dor não há resultado', () => {
    expect(escolher(tudoNaoSei, 'organizacao')).toEqual({ arquetipo: 'bombeiro', segundo: null, pontos: pontuar(tudoNaoSei) })
    expect(escolher(tudoNaoSei, 'performance').arquetipo).toBe('maratonista')
    expect(escolher(tudoNaoSei).arquetipo).toBeNull()
    expect(escolher(tudoNaoSei, 'xpto').arquetipo).toBeNull()
  })

  it('o segundo arquétipo só aparece com 3 pontos ou mais', () => {
    const base = { ontem: 'papeis', ligar: 'papeis', registo: 'caderno' }
    expect(escolher(com(base)).segundo).toBeNull()
    expect(escolher(com({ ...base, resposta: 'horas' })).segundo).toBeNull() // Malabarista com 2
    expect(escolher(com({ ...base, resposta: 'dia' })).segundo).toBe('malabarista') // Malabarista com 3
  })

  it('nenhum arquétipo parte em vantagem: o máximo de cada um é 10', () => {
    for (const a of ORDEM) {
      const maximo = PERGUNTAS.reduce((soma, p) => soma + Math.max(0, ...p.opcoes.map(([, , pts]) => pts?.[a] || 0)), 0)
      expect(maximo).toBe(10)
    }
  })
})

describe('teste de arquétipos: o plano', () => {
  it('3 ou mais horas ao telefone dá Elite', () => {
    expect(planoDe(com({ telefone: '3-mais', anuncios: 'sim' }), 'bombeiro')).toBe('elite')
    expect(planoDe(com({ telefone: '3-mais' }), 'maratonista')).toBe('elite')
  })

  it('quem paga anúncios ou portais tem a Pro, e o Maratonista também', () => {
    expect(planoDe(com({ anuncios: 'sim' }), 'cacador')).toBe('pro')
    expect(planoDe(com({ anuncios: 'as-vezes', telefone: '1-3' }), 'malabarista')).toBe('pro')
    expect(planoDe(com({ anuncios: 'nao' }), 'maratonista')).toBe('pro')
  })

  it('os outros ficam no plano Clara', () => {
    expect(planoDe(com({ anuncios: 'nao', telefone: 'menos-1' }), 'bombeiro')).toBe('clara')
    expect(planoDe(tudoNaoSei, 'cacador')).toBe('clara')
  })

  it('os planos existem no formulário e cada um tem o seu porquê', () => {
    for (const plano of ['clara', 'pro', 'elite']) expect(PLANOS.some(p => p.id === plano)).toBe(true)
    expect(porqueDoPlano('elite', 'bombeiro')).toBe('Passas mais de 3 horas por dia ao telefone.')
    expect(porqueDoPlano('pro', 'cacador')).toBe('Pagas para ter contactos.')
    expect(porqueDoPlano('pro', 'maratonista')).toBe('O calendário de performance faz parte da Pro.')
    expect(porqueDoPlano('clara', 'malabarista')).toBe('Tudo o que precisas está no plano base.')
  })
})

describe('teste de arquétipos: o resumo que segue com a inscrição', () => {
  const respostas = com({ ontem: 'papeis', ligar: 'papeis', registo: 'caderno', resposta: 'dia', telefone: '1-3', anuncios: 'nao' })
  const resultado = escolher(respostas)

  it('leva o arquétipo, o plano e as 8 respostas, com «não sei» onde a pessoa não soube', () => {
    const r = resumo(respostas, resultado)
    const partes = r.split(' | ')
    expect(partes).toHaveLength(2 + PERGUNTAS.length)
    expect(partes[0]).toBe('Arquétipo: Bombeiro (com um pé de Malabarista)')
    expect(partes[1]).toBe('Plano: Clara')
    expect(partes[2]).toBe('Ontem, o que te ocupou mais tempo? Papéis, mensagens e registos')
    expect(r).toContain('Quantas angariações novas fizeste no último mês? não sei')
    expect(r).toContain('Pagas anúncios ou portais para ter contactos? Não')
  })

  it('junta as contas quando a pessoa as fez', () => {
    const r = resumo(respostas, resultado, { faturacao: 43200, negocios: 9, objetivo: 60000 })
    expect(r.endsWith('Faturação 12 meses: 43.200 € | Negócios 12 meses: 9 | Objetivo 12 meses: 60.000 €')).toBe(true)
    expect(resumo(respostas, resultado, { faturacao: null, negocios: 9, objetivo: null })).toContain('Faturação 12 meses: não sei | Negócios 12 meses: 9')
  })

  it('sem resultado, diz que o arquétipo e o plano ficaram por definir', () => {
    const r = resumo(tudoNaoSei, escolher(tudoNaoSei))
    expect(r.startsWith('Arquétipo: por definir | Plano: por definir')).toBe(true)
  })
})

describe('teste de arquétipos: o topo e os textos', () => {
  it('o título segue a dor do anúncio e uma dor desconhecida conta como nenhuma', () => {
    expect(lerDor('?dor=organizacao&utm_content=cla_arq_bombeiro_espelho')).toBe('organizacao')
    expect(lerDor('?dor=xpto')).toBeNull()
    expect(lerDor('')).toBeNull()
    expect(tituloDe('organizacao')).toBe('São 19h e ainda estás a pedir documentos por WhatsApp?')
    expect(tituloDe(null)).toBe('Que tipo de consultor és?')
    expect(tituloDe('xpto')).toBe('Que tipo de consultor és?')
    for (const [dor, a] of Object.entries(DOR_PARA_ARQUETIPO)) {
      expect(ARQUETIPOS[a]).toBeTruthy()
      expect(TITULOS[dor]).toBeTruthy()
    }
  })

  it('cada arquétipo tem todos os textos do resultado e só o Caçador e o Maratonista têm aviso', () => {
    for (const a of ORDEM) {
      const x = ARQUETIPOS[a]
      expect(x.nome && x.feminino && x.dor && x.frase && x.reconheces && x.forte && x.perdes && x.clara).toBeTruthy()
      expect(x.ver.length).toBeGreaterThan(0)
    }
    expect(Object.keys(ARQUETIPOS).filter(a => ARQUETIPOS[a].aviso)).toEqual(['cacador', 'maratonista'])
    // a lista de proprietários a vender sozinhos não é prometida para o primeiro dia
    expect(ARQUETIPOS.cacador.clara).not.toMatch(/sozinh/)
    expect(ARQUETIPOS.cacador.aviso.texto).toContain('depois do lançamento')
  })

  it('o texto segue as regras do site: sem aprovação, ilustrativo, aviso de gravação nem travessões', () => {
    const texto = JSON.stringify({ ARQUETIPOS, PERGUNTAS, TITULOS, ARQUETIPO })
    expect(texto).not.toMatch(/aprovação|aprovar|ilustrativ|consentimento|aviso de grava|—|–/i)
    expect(ARQUETIPO.titulo && ARQUETIPO.descricao && ARQUETIPO.eyebrow && ARQUETIPO.lead).toBeTruthy()
  })
})
