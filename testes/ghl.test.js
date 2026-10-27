import { describe, it, expect, vi } from 'vitest'
import { paraGhl, telefone, enviarParaGhl } from '../netlify/ghl.js'

describe('GHL', () => {
  it('passa a inscrição da lista com o plano e quem indicou', () => {
    const r = paraGhl('lista-clara', { nome: 'Rui', email: 'rui@rede.pt', telefone: '', agencia: 'Rede', plano: 'pro', indicado_por: 'ana@rede.pt' })
    expect(r.contacto).toEqual({ firstName: 'Rui', email: 'rui@rede.pt', companyName: 'Rede', source: 'Site N5 Clara' })
    expect(r.etiquetas).toEqual(['n5-clara', 'lista-clara', 'plano-pro', 'indicado'])
    expect(r.nota).toContain('Indicado por: ana@rede.pt')
  })

  it('passa as prioridades numa nota', () => {
    const r = paraGhl('prioridades', { email: 'a@b.pt', prioridades: 'Responder às leads; Organizar o dia' })
    expect(r.contacto).toEqual({ email: 'a@b.pt' })
    expect(r.etiquetas).toContain('prioridades-respondidas')
    expect(r.nota).toContain('Responder às leads; Organizar o dia')
  })

  it('ignora formulários desconhecidos e envios sem email', () => {
    expect(paraGhl('outro', { email: 'a@b.pt' })).toBeNull()
    expect(paraGhl('prioridades', { email: '' })).toBeNull()
  })

  it('normaliza telefones portugueses', () => {
    expect(telefone('912 345 678')).toBe('+351912345678')
    expect(telefone('+351 912 345 678')).toBe('+351912345678')
    expect(telefone('00351912345678')).toBe('+351912345678')
    expect(telefone('')).toBeUndefined()
  })

  it('cria o contacto, junta as etiquetas e deixa a nota, com o token só no cabeçalho', async () => {
    const pedir = vi.fn(async url => ({ ok: true, json: async () => (url.endsWith('/upsert') ? { contact: { id: 'c1' } } : {}) }))
    const r = await enviarParaGhl({ formulario: 'lista-clara', dados: { nome: 'Rui', email: 'rui@rede.pt', agencia: 'Rede', plano: 'clara' }, token: 'tk', localizacao: 'loc', pedir })
    expect(r).toEqual({ ok: true, id: 'c1' })
    expect(pedir.mock.calls.map(c => c[0])).toEqual([
      'https://services.leadconnectorhq.com/contacts/upsert',
      'https://services.leadconnectorhq.com/contacts/c1/tags',
      'https://services.leadconnectorhq.com/contacts/c1/notes',
    ])
    expect(JSON.parse(pedir.mock.calls[0][1].body).locationId).toBe('loc')
    expect(pedir.mock.calls[0][1].headers.Authorization).toBe('Bearer tk')
    expect(pedir.mock.calls.every(c => !c[1].body.includes('tk'))).toBe(true)
  })
})
