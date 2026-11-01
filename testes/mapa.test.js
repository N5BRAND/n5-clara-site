import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { PAGINAS } from '../src/landing/paginas.js'
import { COMECAR, DORES, MAIS } from '../src/logica/mapa.js'

const todas = [...COMECAR, ...DORES, ...MAIS]
const pasta = href => href.replaceAll('/', '')

describe('por onde começar', () => {
  it('mostra todas as landing pages ativas, cada uma uma vez', () => {
    const hrefs = todas.map(p => p.href)
    expect(new Set(hrefs).size).toBe(hrefs.length)
    for (const id of [...Object.keys(PAGINAS), 'diagnostico', 'arquetipo', 'inquerito', 'passa-a-clara']) expect(hrefs, id).toContain(`/${id}/`)
  })

  it('cada ligação leva a uma página que existe e entra no build', () => {
    const vite = readFileSync('vite.config.js', 'utf8')
    for (const p of todas) {
      expect(existsSync(`${pasta(p.href)}/index.html`), p.href).toBe(true)
      // as landing pages estão na lista de pastas; as outras têm entrada própria com o caminho do index.html
      expect(vite.includes(`'${pasta(p.href)}'`) || vite.includes(`'${pasta(p.href)}/index.html'`), p.href).toBe(true)
    }
  })

  it('cada dor tem a resposta da Clara e o plano bate certo com a página', () => {
    for (const d of DORES) {
      expect(d.dor && d.resposta, d.href).toBeTruthy()
      const plano = PAGINAS[pasta(d.href)].plano
      expect(d.plano ?? null, d.href).toBe({ pro: 'Pro e Elite', elite: 'Elite' }[plano] ?? null)
    }
  })

  it('o texto segue as regras do site', () => {
    expect(JSON.stringify(todas)).not.toMatch(/aprovação|aprovar|ilustrativ|consentimento|aviso de grava|\bIVA\b|—|–/i)
  })
})
