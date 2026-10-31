/* cada formulário do site vira um contacto no GHL: dados, etiquetas para os workflows e uma nota com o resto */
import { etiquetaPagina } from '../src/logica/origem.js'

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
/* a página e o anúncio de onde veio, e o diagnóstico quando o fez: uma etiqueta e linhas na nota */
const daOrigem = d => (d.origem ? [etiquetaPagina(d.origem)].filter(Boolean) : [])
const linhasExtra = d => [...(d.origem ? [`Página: ${d.origem}`] : []), ...(d.diagnostico ? [`Diagnóstico: ${d.diagnostico}`] : [])]

const FORMULARIOS = {
  'lista-clara': d => ({
    contacto: { ...nomeSeparado(d.nome), email: d.email, phone: telefone(d.telefone), companyName: d.agencia, source: `Site ${PRODUTO}` },
    etiquetas: [ETIQUETA, 'lista-clara', `plano-${d.plano || 'nao-sei'}`, ...(indicado(d) ? ['indicado'] : []), ...daOrigem(d)],
    nota: [`Inscrição na lista da ${PRODUTO}.`, `Plano que interessa: ${d.plano || 'não indicado'}`, ...linhasIndicacao(d), ...linhasExtra(d)].join('\n'),
  }),
  'lista-espera': d => ({
    contacto: { ...nomeSeparado(d.nome), email: d.email, phone: telefone(d.telefone), companyName: d.agencia, source: `Site ${PRODUTO}` },
    etiquetas: [ETIQUETA, 'lista-espera', `plano-${d.plano || 'nao-sei'}`, ...(indicado(d) ? ['indicado'] : []), ...daOrigem(d)],
    nota: [`Lista de espera da ${PRODUTO} (as 25 pré-reservas esgotaram): entra pela ordem da lista, 30 vagas por semana a partir de 1 de dezembro.`, `Plano que interessa: ${d.plano || 'não indicado'}`, ...linhasIndicacao(d), ...linhasExtra(d)].join('\n'),
  }),
  prioridades: d => ({
    contacto: { email: d.email },
    etiquetas: [ETIQUETA, 'prioridades-respondidas'],
    nota: [`Prioridades: ${d.prioridades || 'nenhuma'}`, ...(d.crm ? [`CRM: ${d.crm}`] : [])].join('\n'),
  }),
  /* Passa a Clara: quem perdeu a ligação pede-a pelo email; a etiqueta dispara o workflow do GHL que a reenvia,
     com o código do campo personalizado (o mesmo código, a contagem não se perde) */
  'recuperar-ligacao': d => ({
    contacto: { email: d.email },
    etiquetas: [ETIQUETA, 'recuperar-ligacao'],
    nota: 'Pediu outra vez a ligação do Passa a Clara (formulário de recuperação).',
  }),
}

/* o código Passa a Clara também vai para um campo personalizado do contacto, para o workflow de recuperação o usar.
   Só com GHL_CAMPO_CODIGO (id do campo) nas variáveis do site: sem ela, fica só na nota, como antes */
const COM_CODIGO = new Set(['lista-clara', 'lista-espera'])
const campoDoCodigo = (formulario, d, campo) =>
  campo && COM_CODIGO.has(formulario) && /^[A-HJ-NP-Z2-9]{6}$/.test(String(d.codigo || '')) ? { customFields: [{ id: campo, field_value: d.codigo }] } : {}

export function paraGhl(formulario, dados, { campoCodigo } = {}) {
  const f = FORMULARIOS[formulario]
  if (!f || !dados?.email) return null
  const base = f(dados)
  const r = { ...base, contacto: { ...base.contacto, ...campoDoCodigo(formulario, dados, campoCodigo) } }
  /* inscrição de teste (src/legal/teste.js): só a etiqueta «teste», fora das listas e dos workflows */
  if (dados.teste === '1') return { ...r, contacto: sem(r.contacto), etiquetas: [ETIQUETA, 'teste'], nota: `Inscrição de teste.\n${r.nota}` }
  return { ...r, contacto: sem(r.contacto) }
}

/* cria ou atualiza o contacto pelo email, junta as etiquetas e deixa a nota */
export async function enviarParaGhl({ formulario, dados, token, localizacao, pedir = fetch, campoCodigo = typeof process === 'undefined' ? undefined : process.env.GHL_CAMPO_CODIGO }) {
  const r = paraGhl(formulario, dados, { campoCodigo })
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
