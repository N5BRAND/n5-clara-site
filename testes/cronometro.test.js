import { describe, it, expect } from 'vitest'
import { criarCronometro } from '../src/legal/cronometro.js'

describe('cronómetro da visita', () => {
  it('soma o tempo de cada secção e o total', () => {
    const c = criarCronometro(0)
    c.entrou('inicio', 0)
    c.entrou('video', 12000)
    c.saiu('inicio', 12000)
    expect(c.resumo(20000)).toEqual({ total: 20, seccoes: { inicio: 12, video: 8 }, ultima: 'video' })
  })
  it('o tempo entre secções conta no total mas não em nenhuma secção', () => {
    const c = criarCronometro(0)
    c.entrou('inicio', 0)
    c.saiu('inicio', 5000)
    c.entrou('video', 7000)
    expect(c.resumo(10000)).toEqual({ total: 10, seccoes: { inicio: 5, video: 3 }, ultima: 'video' })
  })
  it('com o separador escondido o relógio para', () => {
    const c = criarCronometro(0)
    c.entrou('dia', 0)
    c.visibilidade(false, 4000)
    c.visibilidade(true, 64000)
    expect(c.resumo(66000)).toEqual({ total: 6, seccoes: { dia: 6 }, ultima: 'dia' })
  })
  it('uma página aberta escondida só conta depois de ficar à vista', () => {
    const c = criarCronometro(0, false)
    c.entrou('inicio', 0)
    c.visibilidade(true, 30000)
    expect(c.resumo(33000).total).toBe(3)
  })
  it('a saída de uma secção que já não é a atual não estraga a conta', () => {
    const c = criarCronometro(0)
    c.entrou('promessas', 0)
    c.entrou('dia', 3000)
    c.saiu('promessas', 3500)
    expect(c.resumo(5000)).toEqual({ total: 5, seccoes: { promessas: 3, dia: 2 }, ultima: 'dia' })
  })
  it('a última secção fica a mesma mesmo depois de sair da faixa do meio (ex.: rodapé)', () => {
    const c = criarCronometro(0)
    c.entrou('lista', 0)
    c.saiu('lista', 9000)
    expect(c.resumo(12000)).toEqual({ total: 12, seccoes: { lista: 9 }, ultima: 'lista' })
  })
  it('resumos seguidos não contam o mesmo tempo duas vezes', () => {
    const c = criarCronometro(0)
    c.entrou('inicio', 0)
    c.resumo(2000)
    expect(c.resumo(3000)).toEqual({ total: 3, seccoes: { inicio: 3 }, ultima: 'inicio' })
  })
})
