import { describe, it, expect } from 'vitest'
import { PLANOS } from '../src/secoes/Planos.jsx'
import { instrucoes } from '../netlify/assistente/conhecimento.js'

const textos = p => p.inclui.map(x => (typeof x === 'string' ? x : [x.texto, x.detalhe].filter(Boolean).join(' ')))

describe('planos (textos do Pedro de 06/11)', () => {
  it('a Clara Pro é o plano em destaque', () => {
    expect(PLANOS.filter(p => p.destaque).map(p => p.id)).toEqual(['pro'])
  })

  it('a Clara regista por voz no CRM; a Pro já não tem a reativação trimestral; a Elite não tem coaching nem gravação', () => {
    const [clara, pro, elite] = PLANOS.map(textos)
    expect(clara.join(' ')).toContain('Registo e atualização de dados por voz no CRM')
    expect(clara.join(' ')).toMatch(/ficha do cliente.*pipeline.*contactos.*calendário/)
    expect(pro.join(' ')).not.toMatch(/trimestral/i)
    expect(pro).toContain('Reativação de contactos parados')
    expect(pro.join(' ')).toContain('lança as campanhas na Meta')
    expect(elite.join(' ')).not.toMatch(/coaching|Gravação e transcrição/i)
    expect(elite.join(' ')).toContain('IA que analisa as tuas chamadas')
  })

  it('o assistente descreve os planos como os cartões', () => {
    const f = instrucoes()
    expect(f).not.toMatch(/trimestral|coaching diário|notas de voz que se registam sozinhas|ajuda a criar as campanhas/i)
    expect(f).toContain('registo e atualização de dados por voz no CRM')
  })
})
