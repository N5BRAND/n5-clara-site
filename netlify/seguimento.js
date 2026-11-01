/* Seguimento de quem deixa contacto e não faz a pré-reserva: 3 emails pelo GHL, a partir de pedro.ferreira@numerocinco.pt.
   - Entram na lista quem se inscreve (formulário lista-clara) e quem deixa nome e email ao assistente.
   - A função netlify/functions/seguimento.mjs corre a cada 15 minutos e envia, no máximo, um email por pessoa de cada vez.
   - Pára quando a pessoa paga (página de confirmação → /api/pagou, ou a etiqueta pre-reserva-paga no GHL), quando tem
     a etiqueta seguimento-parar, quando está em «não contactar» (DND) no GHL, ou quando as vagas esgotam.
   - Sem SEGUIMENTO_ATIVO=1 nas variáveis do site, só ensaia: regista no log o que enviaria e não envia nada.
   Os registos ficam no Netlify Blobs (loja «seguimento»), um por contacto do GHL. */
import { API } from './ghl.js'
import { linkPagamento } from '../src/logica/indicacoes.js'

export const REMETENTE = 'pedro.ferreira@numerocinco.pt'
/* o mesmo Payment Link de src/logica/pagamento.js (aqui não se importa: esse ficheiro lê variáveis do Vite) */
export const LINK_PRE_RESERVA = 'https://buy.stripe.com/cNi8wRfFv4Cb1fN3DUgrS0a'
export const PARAR = ['pre-reserva-paga', 'seguimento-parar']

const MIN = 60 * 1000
const HORA = 60 * MIN
/* quando sai cada email, contado desde que a pessoa entrou; nos testes (?teste=1) tudo anda em minutos */
export const ESPERAS = {
  inscricao: [1 * HORA, 24 * HORA, 72 * HORA],
  assistente: [15 * MIN, 24 * HORA, 72 * HORA],
}
const ESPERAS_TESTE = [1 * MIN, 16 * MIN, 31 * MIN]
/* entre dois emails à mesma pessoa passa sempre pelo menos este tempo, mesmo que haja atrasos */
const INTERVALO_MINIMO = 20 * HORA
const INTERVALO_MINIMO_TESTE = 10 * MIN

export const novoRegisto = ({ contactId, email, nome = '', tipo, codigo = '', indicado = '', teste = false, agora = Date.now() }) =>
  ({ contactId, email, nome, tipo, codigo, indicado, teste, entrou: agora, enviados: [], fim: '' })

/* o próximo email que toca a este registo agora (0, 1 ou 2), ou null */
export function proximoPasso(r, agora = Date.now()) {
  if (r.fim) return null
  const passo = r.enviados.length
  const esperas = r.teste ? ESPERAS_TESTE : ESPERAS[r.tipo] || ESPERAS.inscricao
  if (passo >= esperas.length) return null
  if (agora - r.entrou < esperas[passo]) return null
  const ultimo = r.enviados[passo - 1]
  if (ultimo && agora - ultimo < (r.teste ? INTERVALO_MINIMO_TESTE : INTERVALO_MINIMO)) return null
  return passo
}

/* a ligação do email: o Payment Link com o email já preenchido e, se a pessoa veio por um colega, o código dele */
export function ligacaoDoEmail(r) {
  const u = new URL(linkPagamento(LINK_PRE_RESERVA, r.indicado))
  if (r.email) u.searchParams.set('prefilled_email', r.email)
  return u.toString()
}

const escapar = t => String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
const primeiroNome = nome => String(nome || '').trim().split(/\s+/)[0].slice(0, 40)

const OFERTA = [
  'Entras a 1 de dezembro, com o primeiro mês pago e a Clara Elite completa.',
  'Se continuares na Clara Pro ou na Clara Elite, tens 50% de desconto na primeira mensalidade.',
  'Copiloto para o CRM da tua marca durante 3 meses, sessão de configuração e 2 formações incluídas.',
]
const DIA = [
  ['08:00', 'O plano do dia chega por prioridade: visitas, angariações e documentos em falta.'],
  ['09:10', 'Entra uma lead e a Clara responde e qualifica em minutos, com o teu guião.'],
  ['11:30', 'Ligas pela aplicação da Clara e a chamada fica gravada e transcrita na ficha do cliente.'],
  ['14:45', 'Gravas uma nota de voz e a Clara regista tudo na ficha certa.'],
  ['16:20', 'Entra uma angariação e a Clara mostra-te os compradores que encaixam.'],
  ['19:00', 'Recebes o relatório do dia.'],
]

/* os textos dos 3 emails; o primeiro muda para quem só falou com o assistente */
export function textosDoEmail(tipo, passo) {
  if (passo === 0 && tipo === 'assistente') {
    return {
      assunto: 'Obrigado pela conversa com a Clara',
      paragrafos: [
        'Estiveste a falar com a Clara no nosso site e deixaste o teu contacto. Obrigado!',
        'Se quiseres garantir já a tua vaga para 1 de dezembro, a pré-reserva é de 27 € e paga o teu primeiro mês, com a Clara Elite completa. Sem fidelização, e reembolsável depois do dia do lançamento.',
      ],
      botao: 'Garantir a minha vaga',
      depois: ['Se ficou alguma pergunta por responder, responde a este email e falo contigo.'],
    }
  }
  if (passo === 0) {
    return {
      assunto: 'A tua vaga na N5 Clara ainda está por garantir',
      paragrafos: [
        'Começaste a inscrição na N5 Clara, mas a pré-reserva ainda não ficou feita.',
        'A pré-reserva é de 27 € e garante-te uma das 25 vagas com as condições de lançamento:',
      ],
      lista: OFERTA,
      paragrafos2: ['Sem fidelização, e reembolsável depois do dia do lançamento.'],
      botao: 'Concluir a minha pré-reserva',
      depois: ['Se ficou alguma dúvida, responde a este email.'],
    }
  }
  if (passo === 1) {
    return {
      assunto: 'Como fica o teu dia com a Clara',
      paragrafos: ['Em vez de explicar, deixo-te como corre um dia com a Clara a partir de 1 de dezembro:'],
      horas: DIA,
      paragrafos2: ['A tua vaga ainda está à espera: a pré-reserva de 27 € paga o teu primeiro mês, com a Clara Elite completa.'],
      botao: 'Garantir a minha vaga',
      depois: ['Alguma dúvida? Responde a este email.'],
    }
  }
  return {
    assunto: 'Última mensagem sobre a tua vaga',
    paragrafos: [
      'Não te volto a escrever sobre a pré-reserva. Só para saberes: as condições de lançamento existem apenas para as 25 pré-reservas feitas antes de 1 de dezembro, e as vagas são as mesmas para todos.',
      'Depois disso, abrimos 30 vagas por semana, pela ordem da lista.',
    ],
    botao: 'Garantir a minha vaga',
    depois: ['Se preferires esperar, não precisas de fazer nada: continuas na lista.'],
  }
}

/* o email em HTML simples, com estilos na linha, como o do voucher do inquérito */
export function emailSeguimento(r, passo) {
  const t = textosDoEmail(r.tipo, passo)
  const tinta = '#15181D'
  const dourado = '#E8A13C'
  const cinza = '#5B6068'
  const p = txt => `<p style="font-size:16px;line-height:1.55;margin:0 0 14px;color:${tinta}">${escapar(txt)}</p>`
  const ola = primeiroNome(r.nome) ? `Olá ${primeiroNome(r.nome)},` : 'Olá,'
  const html = `<!doctype html><html lang="pt-PT"><body style="margin:0;background:#F5F4F0">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F4F0"><tr><td align="center" style="padding:28px 14px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border-radius:18px;font-family:Arial,Helvetica,sans-serif"><tr><td style="padding:28px">
${p(ola)}
${t.paragrafos.map(p).join('')}
${t.lista ? `<ul style="margin:0 0 14px;padding-left:20px;font-size:16px;line-height:1.55;color:${tinta}">${t.lista.map(x => `<li style="margin-bottom:4px">${escapar(x)}</li>`).join('')}</ul>` : ''}
${t.horas ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 14px">${t.horas.map(([h, x]) => `<tr><td style="padding:6px 12px 6px 0;font-weight:700;color:${dourado};white-space:nowrap;vertical-align:top;font-size:15px">${h}</td><td style="padding:6px 0;font-size:15px;line-height:1.5;color:${tinta}">${escapar(x)}</td></tr>`).join('')}</table>` : ''}
${(t.paragrafos2 || []).map(p).join('')}
<p style="margin:20px 0 22px"><a href="${escapar(ligacaoDoEmail(r))}" style="display:inline-block;background:${dourado};color:${tinta};font-weight:700;font-size:16px;text-decoration:none;padding:14px 24px;border-radius:999px">${escapar(t.botao)}</a></p>
${t.depois.map(p).join('')}
<p style="font-size:16px;line-height:1.55;margin:0">Pedro Ferreira<br><span style="color:${cinza}">N5 Clara</span></p>
<p style="font-size:12px;line-height:1.5;margin:22px 0 0;color:${cinza}">Não queres receber estes emails? Responde «sair» e não voltamos a escrever sobre isto.</p>
</td></tr></table></td></tr></table></body></html>`
  return { assunto: `${r.teste ? '[Teste] ' : ''}${t.assunto}`, html }
}

/* GHL: o contacto (etiquetas e «não contactar»), o envio do email e as etiquetas */
const cabecalhos = (token, versao = '2021-07-28') => ({ Authorization: `Bearer ${token}`, Version: versao, 'Content-Type': 'application/json', Accept: 'application/json' })

export async function contactoGhl({ contactId, token, pedir = fetch }) {
  const r = await pedir(`${API}/contacts/${contactId}`, { headers: cabecalhos(token) })
  if (!r.ok) throw new Error(`GHL /contacts respondeu ${r.status}`)
  return (await r.json()).contact || {}
}

export async function enviarEmail({ r, passo, token, pedir = fetch }) {
  const { assunto, html } = emailSeguimento(r, passo)
  const resp = await pedir(`${API}/conversations/messages`, {
    method: 'POST',
    headers: cabecalhos(token, '2021-04-15'),
    body: JSON.stringify({ type: 'Email', contactId: r.contactId, emailFrom: REMETENTE, subject: assunto, html }),
  })
  if (!resp.ok) throw new Error(`GHL /conversations/messages respondeu ${resp.status}`)
}

export async function juntarEtiquetas({ contactId, tags, token, pedir = fetch }) {
  const r = await pedir(`${API}/contacts/${contactId}/tags`, { method: 'POST', headers: cabecalhos(token), body: JSON.stringify({ tags }) })
  if (!r.ok) throw new Error(`GHL /tags respondeu ${r.status}`)
}

/* porque é que este contacto já não recebe emails, ou '' */
export function motivoParaParar(contacto) {
  const tags = (contacto.tags || []).map(t => String(t).toLowerCase())
  const parar = PARAR.find(t => tags.includes(t))
  if (parar) return parar
  if (contacto.dnd === true || contacto.dndSettings?.Email?.status === 'active') return 'nao-contactar'
  return ''
}

/* entra na lista (só na primeira vez); quem já estava como «assistente» e se inscreve passa a «inscricao» */
export async function registarSeguimento(loja, dados) {
  if (!dados.contactId || !dados.email) return false
  const chave = `c/${dados.contactId}`
  const atual = await loja.get(chave, { type: 'json' })
  if (!atual) {
    await loja.setJSON(chave, novoRegisto(dados))
    return true
  }
  if (atual.tipo === 'assistente' && dados.tipo === 'inscricao' && !atual.fim) {
    await loja.setJSON(chave, { ...atual, tipo: 'inscricao', codigo: dados.codigo || atual.codigo, indicado: dados.indicado || atual.indicado })
  }
  return false
}

/* a página de confirmação avisa que esta pessoa pagou (pelo código Passa a Clara do navegador dela) */
export async function marcarPago(loja, codigo) {
  if (!/^[A-HJ-NP-Z2-9]{6}$/.test(String(codigo || ''))) return []
  const { blobs } = await loja.list({ prefix: 'c/' })
  const pagos = []
  for (const { key } of blobs) {
    const r = await loja.get(key, { type: 'json' })
    if (r && r.codigo === codigo && !r.fim) {
      await loja.setJSON(key, { ...r, fim: 'pre-reserva-paga' })
      pagos.push(r.contactId)
    }
  }
  return pagos
}

/* uma volta: vê a quem toca um email e envia (ou, sem «ativo», só regista o que enviaria) */
export async function correr({ loja, token, ativo = false, esgotado = false, agora = Date.now(), pedir = fetch, log = console.log }) {
  const resumo = { vistos: 0, enviados: 0, ensaiados: 0, parados: 0, erros: 0 }
  if (esgotado) { log('seguimento: vagas esgotadas, não envia nada'); return resumo }
  const { blobs } = await loja.list({ prefix: 'c/' })
  for (const { key } of blobs) {
    const r = await loja.get(key, { type: 'json' })
    if (!r) continue
    resumo.vistos++
    const passo = proximoPasso(r, agora)
    if (passo === null) continue
    try {
      const contacto = await contactoGhl({ contactId: r.contactId, token, pedir })
      const motivo = motivoParaParar(contacto)
      if (motivo) {
        await loja.setJSON(key, { ...r, fim: motivo })
        resumo.parados++
        continue
      }
      if (!ativo) {
        log(`seguimento (ensaio): enviaria o email ${passo + 1} (${r.tipo}) a ${r.contactId}`)
        resumo.ensaiados++
        continue
      }
      await enviarEmail({ r, passo, token, pedir })
      const enviados = [...r.enviados, agora]
      await loja.setJSON(key, { ...r, enviados, fim: enviados.length >= 3 ? 'sequencia-completa' : '' })
      await juntarEtiquetas({ contactId: r.contactId, tags: [`seguimento-${passo + 1}`], token, pedir }).catch(() => {})
      resumo.enviados++
    } catch (e) {
      log(`seguimento: falhou ${r.contactId}: ${e.message}`)
      resumo.erros++
    }
  }
  return resumo
}
