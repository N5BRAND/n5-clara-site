import { describe, it, expect, vi } from 'vitest'
import { paraGhl, telefone, enviarParaGhl } from '../netlify/ghl.js'

describe('GHL', () => {
  it('passa a inscrição da lista com o plano e quem indicou', () => {
    const r = paraGhl('lista-clara', { nome: 'Rui', email: 'rui@rede.pt', telefone: '', agencia: 'Rede', plano: 'pro', indicado_por: 'ana@rede.pt' })
    expect(r.contacto).toEqual({ firstName: 'Rui', email: 'rui@rede.pt', companyName: 'Rede', source: 'Site N5 Clara' })
    expect(r.etiquetas).toEqual(['n5-clara', 'lista-clara', 'plano-pro', 'indicado'])
    expect(r.nota).toContain('Indicado por: ana@rede.pt')
  })

  it('uma inscrição de teste fica só com a etiqueta «teste», fora da lista e dos workflows', () => {
    const r = paraGhl('lista-clara', { nome: 'Teste', email: 'teste@exemplo.pt', plano: 'pro', teste: '1' })
    expect(r.etiquetas).toEqual(['n5-clara', 'teste'])
    expect(r.nota.startsWith('Inscrição de teste.')).toBe(true)
  })

  it('põe na lista de espera quem chega depois de esgotarem as 25', () => {
    const r = paraGhl('lista-espera', { nome: 'Rui', email: 'rui@rede.pt', telefone: '', agencia: 'Rede', plano: 'elite', indicado_por: '' })
    expect(r.etiquetas).toEqual(['n5-clara', 'lista-espera', 'plano-elite'])
    expect(r.nota).toContain('30 vagas por semana')
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

  it('recuperar a ligação do Passa a Clara: só o email, com a etiqueta que dispara o workflow', () => {
    const r = paraGhl('recuperar-ligacao', { email: 'ana@exemplo.pt' })
    expect(r.contacto).toEqual({ email: 'ana@exemplo.pt' })
    expect(r.etiquetas).toEqual(['n5-clara', 'recuperar-ligacao'])
    expect(paraGhl('recuperar-ligacao', { email: 'ana@exemplo.pt', teste: '1' }).etiquetas).toEqual(['n5-clara', 'teste'])
  })

  it('o código vai para o campo personalizado só quando o campo está configurado', () => {
    const d = { nome: 'Ana Silva', email: 'ana@exemplo.pt', agencia: 'X', plano: 'clara', codigo: 'ABC234' }
    expect(paraGhl('lista-clara', d).contacto.customFields).toBeUndefined()
    expect(paraGhl('lista-clara', d, { campoCodigo: 'campo123' }).contacto.customFields).toEqual([{ id: 'campo123', field_value: 'ABC234' }])
    expect(paraGhl('lista-clara', { ...d, codigo: 'xx' }, { campoCodigo: 'campo123' }).contacto.customFields).toBeUndefined()
    expect(paraGhl('prioridades', { email: 'ana@exemplo.pt', codigo: 'ABC234' }, { campoCodigo: 'campo123' }).contacto.customFields).toBeUndefined()
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
