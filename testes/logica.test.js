import { describe, it, expect } from 'vitest'
import { cenaDe, passoDe } from '../src/logica/linha-tempo.js'
import { validarInscricao, erroDoCampo, PLANOS } from '../src/logica/validar.js'
import { PERGUNTAS, primeiroNome } from '../src/logica/inscricao.js'
import { LANCAMENTO, tempoAte } from '../src/logica/contagem.js'
import { codificar } from '../src/logica/netlify.js'
import { horaDe } from '../src/logica/hora.js'

describe('cenaDe e passoDe', () => {
  it('convertem o progresso em cena e passo', () => {
    expect(cenaDe(0.5, 6)).toEqual({ indice: 3, avanco: 0 })
    expect(passoDe(0, 4)).toBe(1)
    expect(passoDe(1, 4)).toBe(4)
  })
})

describe('perguntas da inscrição', () => {
  it('a Clara pergunta só o nome, o email e o telemóvel, por esta ordem', () => {
    expect(PERGUNTAS.map(p => p.id)).toEqual(['nome', 'email', 'telefone'])
  })
  it('fala na primeira pessoa e trata a pessoa pelo primeiro nome', () => {
    expect(PERGUNTAS[0].fala('')).toMatch(/Sou a Clara/)
    expect(PERGUNTAS[1].fala(primeiroNome('  ana maria silva '))).toBe('Prazer, Ana! Qual é o teu email?')
    expect(PERGUNTAS[2].fala('Rui')).toContain('Rui')
  })
  it('sem travessões nem aprovações', () => {
    const texto = JSON.stringify(PERGUNTAS.map(p => [p.fala('Rui'), p.ajuda || '']))
    expect(texto).not.toMatch(/aprovação|aprovar|ilustrativ|—|–/i)
  })
})

describe('validarInscricao', () => {
  const base = { nome: 'Rui', email: 'rui@agencia.pt', telefone: '912 345 678', plano: 'elite' }

  it('aceita uma inscrição completa', () => {
    expect(validarInscricao(base)).toEqual({ ok: true, erros: {} })
  })
  it('exige nome, email e telemóvel', () => {
    const r = validarInscricao({ ...base, nome: ' ', email: '', telefone: '' })
    expect(Object.keys(r.erros).sort()).toEqual(['email', 'nome', 'telefone'])
  })
  it('rejeita email inválido e telefone curto', () => {
    expect(validarInscricao({ ...base, email: 'rui@' }).erros.email).toBeTruthy()
    expect(validarInscricao({ ...base, telefone: '123' }).erros.telefone).toBeTruthy()
    expect(validarInscricao({ ...base, telefone: '+351 912 345 678' }).ok).toBe(true)
  })
  it('erroDoCampo valida uma pergunta de cada vez', () => {
    expect(erroDoCampo('nome', { nome: 'Rui' })).toBeNull()
    expect(erroDoCampo('email', { email: 'rui@agencia' })).toBeTruthy()
    expect(erroDoCampo('telefone', { telefone: '' })).toBeTruthy()
    expect(erroDoCampo('telefone', { telefone: '912345678' })).toBeNull()
  })
  it('o plano não se pergunta: pode seguir vazio', () => {
    expect(PLANOS.map(p => p.id)).toEqual(['clara', 'pro', 'elite', 'nao-sei'])
    expect(validarInscricao({ ...base, plano: '' }).ok).toBe(true)
  })
  it('quem te indicou é opcional, mas tem de ser o email válido de outra pessoa', () => {
    expect(validarInscricao({ ...base, indicado_por: '' }).ok).toBe(true)
    expect(validarInscricao({ ...base, indicado_por: 'ana@agencia.pt' }).ok).toBe(true)
    expect(validarInscricao({ ...base, indicado_por: 'ana@' }).erros.indicado_por).toBeTruthy()
    expect(validarInscricao({ ...base, indicado_por: 'Ana Silva' }).ok).toBe(true)
    expect(validarInscricao({ ...base, indicado_por: 'ABC234' }).ok).toBe(true)
    expect(validarInscricao({ ...base, indicado_por: 'x'.repeat(121) }).erros.indicado_por).toBeTruthy()
    expect(validarInscricao({ ...base, indicado_por: base.email.toUpperCase() }).erros.indicado_por).toBeTruthy()
  })
})

describe('tempoAte e codificar', () => {
  it('lançamento a 1 de dezembro de 2026, meia-noite em Lisboa', () => {
    expect(LANCAMENTO.toISOString()).toBe('2026-12-01T00:00:00.000Z')
    expect(tempoAte(LANCAMENTO, new Date('2026-11-30T23:00:00Z')).horas).toBe(1)
  })
  it('codifica o envio do Netlify Forms', () => {
    expect(codificar({ 'form-name': 'lista-clara', nome: 'Rui Sá' })).toBe('form-name=lista-clara&nome=Rui%20S%C3%A1')
  })
})

describe('horaDe', () => {
  const horas = ['08:00', '09:12', '11:30', '14:45', '16:20', '19:00']

  it('a meio de cada cena mostra a hora dessa cena', () => {
    expect(horaDe(1 / 12, horas)).toBe('08:00')
    expect(horaDe(5 / 12, horas)).toBe('11:30')
    expect(horaDe(11 / 12, horas)).toBe('19:00')
  })
  it('começa às 07:30 e acaba às 20:00', () => {
    expect(horaDe(0, horas)).toBe('07:30')
    expect(horaDe(1, horas)).toBe('20:00')
    expect(horaDe(-1, horas)).toBe('07:30')
  })
  it('entre cenas avança aos 5 minutos', () => {
    expect(horaDe(2 / 12, horas)).toBe('08:35')
  })
})
