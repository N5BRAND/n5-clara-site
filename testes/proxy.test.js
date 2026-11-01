import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/* o PostHog sai pelo próprio domínio: o endereço em .env.production tem de bater certo com o proxy do netlify.toml */
const raiz = resolve(__dirname, '..')
const env = readFileSync(resolve(raiz, '.env.production'), 'utf8')
const toml = readFileSync(resolve(raiz, 'netlify.toml'), 'utf8')
const regras = [...toml.matchAll(/from = "([^"]+)"\s+to = "([^"]+)"\s+status = (\d+)\s+force = (\w+)/g)]
  .map(([, from, to, status, force]) => ({ from, to, status: Number(status), force: force === 'true' }))

describe('PostHog pelo próprio domínio', () => {
  it('o site manda os eventos para /r', () => {
    expect(env).toMatch(/^VITE_POSTHOG_HOST=\/r\s*$/m)
  })

  it('a Netlify passa /r ao PostHog da UE, com os ficheiros antes do resto', () => {
    expect(regras.map(r => [r.from, r.to])).toEqual([
      ['/r/static/*', 'https://eu-assets.i.posthog.com/static/:splat'],
      ['/r/array/*', 'https://eu-assets.i.posthog.com/array/:splat'],
      ['/r/*', 'https://eu.i.posthog.com/:splat'],
    ])
    expect(regras.every(r => r.status === 200 && r.force)).toBe(true)
  })
})
