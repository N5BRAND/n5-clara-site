/* cada formulário do site vira um contacto no GHL: dados, etiquetas para os workflows e uma nota com o resto */
export const PRODUTO = 'N5 Clara'
export const ETIQUETA = 'n5-clara'
export const API = 'https://services.leadconnectorhq.com'

const nomeSeparado = nome => {
  const [primeiro, ...resto] = String(nome || '').trim().split(/\s+/)
  return resto.length ? { firstName: primeiro, lastName: resto.join(' ') } : { firstName: primeiro }
}

/* números portugueses sem indicativo passam a +351; o resto segue como veio */
export function telefone(t) {
  const digitos = String(t || '').replace(/[^\d+]/g, '')
  if (!digitos) return undefined
  if (digitos.startsWith('+')) return digitos
  if (digitos.startsWith('00')) return '+' + digitos.slice(2)
  if (digitos.length === 9) return '+351' + digitos
  return '+' + digitos
}

const sem = o => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== ''))

/* programa Passa a Clara: o código da pessoa e o de quem a indicou ficam na nota e nas etiquetas */
const indicado = d => !!(d.indicado_por || d.indicado_codigo)
const linhasIndicacao = d => [
  ...(d.indicado_por ? [`Indicado por: ${d.indicado_por}`] : []),
  ...(d.indicado_codigo ? [`Indicado pelo código: ${d.indicado_codigo}`] : []),
  ...(d.codigo ? [`Código Passa a Clara: ${d.codigo}`] : []),
]

const FORMULARIOS = {
  'lista-clara': d => ({
    contacto: { ...nomeSeparado(d.nome), email: d.email, phone: telefone(d.telefone), companyName: d.agencia, source: `Site ${PRODUTO}` },
    etiquetas: [ETIQUETA, 'lista-clara', `plano-${d.plano || 'nao-sei'}`, ...(indicado(d) ? ['indicado'] : [])],
    nota: [`Inscrição na lista da ${PRODUTO}.`, `Plano que interessa: ${d.plano || 'não indicado'}`, ...linhasIndicacao(d)].join('\n'),
  }),
  'lista-espera': d => ({
    contacto: { ...nomeSeparado(d.nome), email: d.email, phone: telefone(d.telefone), companyName: d.agencia, source: `Site ${PRODUTO}` },
    etiquetas: [ETIQUETA, 'lista-espera', `plano-${d.plano || 'nao-sei'}`, ...(indicado(d) ? ['indicado'] : [])],
    nota: [`Lista de espera da ${PRODUTO} (as 25 pré-reservas esgotaram): entra pela ordem da lista, 30 vagas por semana a partir de 1 de dezembro.`, `Plano que interessa: ${d.plano || 'não indicado'}`, ...linhasIndicacao(d)].join('\n'),
  }),
  prioridades: d => ({
    contacto: { email: d.email },
    etiquetas: [ETIQUETA, 'prioridades-respondidas'],
    nota: [`Prioridades: ${d.prioridades || 'nenhuma'}`, ...(d.crm ? [`CRM: ${d.crm}`] : [])].join('\n'),
  }),
}

export function paraGhl(formulario, dados) {
  const f = FORMULARIOS[formulario]
  if (!f || !dados?.email) return null
  const r = f(dados)
  return { ...r, contacto: sem(r.contacto) }
}

/* cria ou atualiza o contacto pelo email, junta as etiquetas e deixa a nota */
export async function enviarParaGhl({ formulario, dados, token, localizacao, pedir = fetch }) {
  const r = paraGhl(formulario, dados)
  if (!r) return { ok: false, motivo: 'formulario-desconhecido' }
  const cabecalhos = { Authorization: `Bearer ${token}`, Version: '2021-07-28', 'Content-Type': 'application/json', Accept: 'application/json' }
  const chamar = async (caminho, corpo) => {
    const resp = await pedir(API + caminho, { method: 'POST', headers: cabecalhos, body: JSON.stringify(corpo) })
    if (!resp.ok) throw new Error(`GHL ${caminho} respondeu ${resp.status}`)
    return resp.json()
  }
  const { contact } = await chamar('/contacts/upsert', { locationId: localizacao, ...r.contacto })
  await chamar(`/contacts/${contact.id}/tags`, { tags: r.etiquetas })
  await chamar(`/contacts/${contact.id}/notes`, { body: r.nota })
  return { ok: true, id: contact.id }
}
