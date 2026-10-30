import { describe, it, expect } from 'vitest'
import { PASSOS, erroDoPasso, primeiroPassoComErro, primeiroNome } from '../src/logica/passos.js'

const vazio = { nome: '', email: '', telefone: '', agencia: '', plano: '', indicado_por: '', consentimento: false }
const passo = id => PASSOS.find(p => p.id === id)

describe('inscrição passo a passo', () => {
  it('uma pergunta de cada vez, pela ordem combinada', () => {
    expect(PASSOS.map(p => p.id)).toEqual(['nome', 'email', 'telefone', 'agencia', 'indicado', 'plano', 'autorizacao'])
  })
  it('cada passo só olha para o seu campo', () => {
    expect(erroDoPasso(passo('nome'), vazio)).toBeTruthy()
    expect(erroDoPasso(passo('nome'), { ...vazio, nome: 'Rui' })).toBe('')
    expect(erroDoPasso(passo('email'), { ...vazio, email: 'rui@' })).toBeTruthy()
  })
  it('telefone e quem indicou podem ficar em branco', () => {
    expect(erroDoPasso(passo('telefone'), vazio)).toBe('')
    expect(erroDoPasso(passo('indicado'), vazio)).toBe('')
    expect(erroDoPasso(passo('telefone'), { ...vazio, telefone: '12' })).toBeTruthy()
  })
  it('ao enviar, volta ao primeiro passo que ficou mal', () => {
    const quase = { nome: 'Rui', email: 'rui@rede.pt', telefone: '', agencia: '', plano: 'clara', indicado_por: '', consentimento: true }
    expect(primeiroPassoComErro(quase)).toBe(3)
    expect(primeiroPassoComErro({ ...quase, agencia: 'Rede' })).toBe(-1)
  })
  it('a Clara trata a pessoa pelo primeiro nome', () => {
    expect(primeiroNome('  Rui Costa ')).toBe('Rui')
    expect(primeiroNome('')).toBe('')
  })
})
