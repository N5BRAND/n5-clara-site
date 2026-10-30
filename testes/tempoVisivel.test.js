import { describe, it, expect } from 'vitest'
import { quandoVisivel, SEGUNDOS_VISUALIZACAO } from '../src/legal/tempoVisivel.js'

/* separador, relógio e temporizador falsos: o tempo só anda quando o teste o manda andar */
function ambiente({ escondido = false, webdriver = false } = {}) {
  let ms = 0
  let fila = []
  const ouvintes = new Set()
  const doc = {
    visibilityState: escondido ? 'hidden' : 'visible',
    addEventListener: (n, f) => n === 'visibilitychange' && ouvintes.add(f),
    removeEventListener: (n, f) => ouvintes.delete(f),
  }
  const temporizador = {
    marcar: (f, espera) => { const t = { f, quando: ms + espera }; fila.push(t); return t },
    limpar: t => { fila = fila.filter(x => x !== t) },
  }
  const andar = s => {
    const fim = ms + s * 1000
    for (;;) {
      const prox = fila.filter(t => t.quando <= fim).sort((a, b) => a.quando - b.quando)[0]
      if (!prox) break
      ms = prox.quando
      fila = fila.filter(t => t !== prox)
      prox.f()
    }
    ms = fim
  }
  const mudar = estado => { doc.visibilityState = estado; for (const f of [...ouvintes]) f() }
  return { doc, nav: { webdriver }, agora: () => ms, temporizador, andar, mudar, ouvintes }
}

describe('visualização só depois de 6 segundos à vista', () => {
  it('são 6 segundos', () => {
    expect(SEGUNDOS_VISUALIZACAO).toBe(6)
  })
  it('não conta antes dos 6 segundos e conta uma só vez depois', () => {
    const a = ambiente()
    const chamadas = []
    quandoVisivel(6, s => chamadas.push(s), a)
    a.andar(5.9)
    expect(chamadas).toEqual([])
    a.andar(0.2)
    expect(chamadas).toEqual([6])
    a.andar(30)
    expect(chamadas).toEqual([6])
    expect(a.ouvintes.size).toBe(0)
  })
  it('quem clica e sai antes dos 6 segundos nunca conta', () => {
    const a = ambiente()
    const chamadas = []
    quandoVisivel(6, s => chamadas.push(s), a)
    a.andar(2)
    a.mudar('hidden')
    a.andar(60)
    expect(chamadas).toEqual([])
  })
  it('o tempo com o separador escondido não conta; soma os bocados à vista', () => {
    const a = ambiente()
    const chamadas = []
    quandoVisivel(6, s => chamadas.push(s), a)
    a.andar(4)
    a.mudar('hidden')
    a.andar(100)
    a.mudar('visible')
    a.andar(1.9)
    expect(chamadas).toEqual([])
    a.andar(0.2)
    expect(chamadas).toEqual([6])
  })
  it('uma página aberta escondida só começa a contar quando fica à vista', () => {
    const a = ambiente({ escondido: true })
    const chamadas = []
    quandoVisivel(6, s => chamadas.push(s), a)
    a.andar(20)
    expect(chamadas).toEqual([])
    a.mudar('visible')
    a.andar(6)
    expect(chamadas).toEqual([6])
  })
  it('navegadores automatizados (robôs) nunca contam', () => {
    const a = ambiente({ webdriver: true })
    const chamadas = []
    quandoVisivel(6, s => chamadas.push(s), a)
    a.andar(60)
    expect(chamadas).toEqual([])
  })
  it('cancelar antes do fim não conta', () => {
    const a = ambiente()
    const chamadas = []
    const cancelar = quandoVisivel(6, s => chamadas.push(s), a)
    a.andar(3)
    cancelar()
    a.andar(10)
    expect(chamadas).toEqual([])
  })
})
