import { describe, it, expect, vi } from 'vitest'
import { paraConversoes, enviarConversao, paginaDaInscricao } from '../netlify/meta.js'
import { idsDoAnuncio } from '../src/legal/pixel.js'

const inscricao = {
  nome: 'Rui Costa', email: ' rui@rede.pt ', telefone: '912345678', origem: '/leads/ · cla_n2_leads',
  meta_evento: 'b1f0c2d4-1111-2222-3333-444455556666', meta_consentimento: '1', meta_fbp: 'fb.1.1700000000000.123', meta_fbc: '',
  ip: '1.2.3.4', user_agent: 'Mozilla/5.0',
}

describe('API de Conversões da Meta', () => {
  it('passa a inscrição ao N5 Controlo com o id do píxel e a página', () => {
    expect(paraConversoes('lista-clara', inscricao)).toEqual({
      event: 'Lead', event_id: 'b1f0c2d4-1111-2222-3333-444455556666', email: 'rui@rede.pt', phone: '912345678', name: 'Rui Costa',
      fbp: 'fb.1.1700000000000.123', client_ip: '1.2.3.4', user_agent: 'Mozilla/5.0', source_url: 'https://clara.numerocinco.pt/leads/', consent: true,
    })
  })

  it('não envia nada sem os cookies de marketing aceites', () => {
    expect(paraConversoes('lista-clara', { ...inscricao, meta_consentimento: '' })).toBeNull()
    expect(paraConversoes('lista-clara', { ...inscricao, meta_evento: '' })).toBeNull()
  })

  it('uma inscrição de teste nunca chega à Meta, mesmo com os cookies aceites', () => {
    expect(paraConversoes('lista-clara', { ...inscricao, teste: '1' })).toBeNull()
    expect(paraConversoes('lista-clara', { ...inscricao, teste: '' })).not.toBeNull()
  })

  it('só as inscrições contam como Lead', () => {
    expect(paraConversoes('lista-espera', inscricao)).not.toBeNull()
    expect(paraConversoes('diagnostico', inscricao)).toBeNull()
    expect(paraConversoes('prioridades', inscricao)).toBeNull()
  })

  it('a página principal quando não há origem', () => {
    expect(paginaDaInscricao('')).toBe('https://clara.numerocinco.pt/')
    expect(paginaDaInscricao('/ · cla_n5_primeiros')).toBe('https://clara.numerocinco.pt/')
  })

  it('envia com a chave no cabeçalho e lê a resposta', async () => {
    const pedir = vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ sent: true, events_received: 1 }) }))
    const r = await enviarConversao({ corpo: { event: 'Lead' }, url: 'https://n5controlo.netlify.app/', chave: 'k', pedir })
    expect(pedir).toHaveBeenCalledWith('https://n5controlo.netlify.app/api/v1/conversions', expect.objectContaining({ method: 'POST', headers: expect.objectContaining({ Authorization: 'Bearer k' }) }))
    expect(r).toEqual({ ok: true, estado: 200, enviado: true, motivo: undefined })
  })

  it('lê os identificadores do anúncio dos cookies do píxel', () => {
    expect(idsDoAnuncio('a=1; _fbp=fb.1.2.3; _fbc=fb.1.2.abc')).toEqual({ fbp: 'fb.1.2.3', fbc: 'fb.1.2.abc' })
    expect(idsDoAnuncio('')).toEqual({ fbp: '', fbc: '' })
  })
})
