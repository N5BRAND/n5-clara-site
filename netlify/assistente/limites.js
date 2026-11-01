/* limites do assistente, para ninguém disparar a conta da OpenAI: por endereço IP cifrado e no total do dia.
   Só contam os pedidos que iam chamar o modelo. Acima de um limite, a conversa continua com os textos fixos (sem nunca
   falar em limites) e a Clara pede o contacto. Os valores por IP são largos de propósito: nas redes móveis e nos
   escritórios muitas pessoas saem pelo mesmo IP; quem trava o custo é o teto do dia (e o limite de gasto na OpenAI).
   Mudam-se nas variáveis do site, sem publicar código */
export const LIMITES_USO = { ip10min: 30, ipDia: 150, dia: 3000 }
const DEZ_MIN = 10 * 60 * 1000

export function limitesDoAmbiente(env = {}) {
  const n = (v, d) => { const x = parseInt(v, 10); return x > 0 ? x : d }
  return {
    ip10min: n(env.ASSISTENTE_LIMITE_IP_10MIN, LIMITES_USO.ip10min),
    ipDia: n(env.ASSISTENTE_LIMITE_IP_DIA, LIMITES_USO.ipDia),
    dia: n(env.ASSISTENTE_LIMITE_DIA, LIMITES_USO.dia),
  }
}

/* o registo de um IP no dia: quantos pedidos e as horas dos últimos 10 minutos; null se já não couber mais nenhum */
export function somarIp(registo, agora, limites) {
  const n = registo?.n || 0
  const recentes = (registo?.recentes || []).filter(t => agora - t < DEZ_MIN)
  if (n >= limites.ipDia || recentes.length >= limites.ip10min) return null
  return { n: n + 1, recentes: [...recentes, agora] }
}

export function somarTotal(registo, limites) {
  const n = registo?.n || 0
  return n >= limites.dia ? null : { n: n + 1 }
}

/* lê, soma e grava só se ninguém gravou entretanto (etag do Netlify Blobs); com pedidos ao mesmo tempo, tenta outra vez.
   Se não conseguir gravar, conta como limite atingido: na dúvida, não se chama o modelo */
async function somar(loja, chave, somarUm) {
  for (let i = 0; i < 5; i++) {
    const atual = await loja.getWithMetadata(chave, { type: 'json', consistency: 'strong' })
    const novo = somarUm(atual?.data)
    if (!novo) return { ok: false }
    const { modified } = await loja.setJSON(chave, novo, atual ? { onlyIfMatch: atual.etag } : { onlyIfNew: true })
    if (modified) return { ok: true, primeiro: !atual }
  }
  return { ok: false }
}

/* os contadores de dias anteriores apagam-se no primeiro pedido de cada dia */
export async function limparAntigos(loja, dia) {
  const { blobs } = await loja.list()
  await Promise.all(blobs.filter(b => !b.key.startsWith(`${dia}/`)).map(b => loja.delete(b.key)))
}

/* id: o IP cifrado. Devolve { permitido, motivo: 'ip' | 'total', limpar } */
export async function consumir({ loja, id, agora = Date.now(), limites = LIMITES_USO }) {
  const dia = new Date(agora).toISOString().slice(0, 10)
  const ip = await somar(loja, `${dia}/ip/${id}`, r => somarIp(r, agora, limites))
  if (!ip.ok) return { permitido: false, motivo: 'ip' }
  const total = await somar(loja, `${dia}/total`, r => somarTotal(r, limites))
  if (!total.ok) return { permitido: false, motivo: 'total' }
  return { permitido: true, limpar: total.primeiro ? () => limparAntigos(loja, dia) : null }
}
