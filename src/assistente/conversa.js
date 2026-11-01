import { erroDoCampo } from '../logica/validar.js'

/* assistente do site: a Clara pergunta, 2 segundos depois de a página abrir, se a pessoa precisa de ajuda, responde ao
   que lhe perguntarem e pede o nome e um contacto. Este ficheiro serve o navegador e a função netlify/functions/assistente.mjs */
export const ESPERA_MS = 2000
export const SAUDACAO = 'Olá! Sou a Clara 👋 Precisas de ajuda com alguma coisa?'
export const SUGESTOES = ['O que faz a Clara por mim?', 'Quanto custa?', 'Como funciona a pré-reserva?', 'Funciona com o CRM da minha marca?']
export const LIMITES = { mensagens: 40, texto: 800 }

/* mensagens: [{ de: 'clara' | 'visitante', texto }], como chegam do navegador */
export function conversaValida(mensagens) {
  return Array.isArray(mensagens) && mensagens.length > 0 && mensagens.length <= LIMITES.mensagens
    && mensagens.every(m => m && (m.de === 'clara' || m.de === 'visitante') && typeof m.texto === 'string' && m.texto.length <= 4 * LIMITES.texto)
    && mensagens[mensagens.length - 1].de === 'visitante'
}

/* para a API: começa no visitante (a saudação fica de fora) e junta mensagens seguidas do mesmo lado */
export function paraModelo(mensagens) {
  const r = []
  for (const m of mensagens) {
    const role = m.de === 'visitante' ? 'user' : 'assistant'
    const texto = String(m.texto || '').trim().slice(0, LIMITES.texto)
    if (!texto || (!r.length && role === 'assistant')) continue
    if (r.length && r[r.length - 1].role === role) r[r.length - 1].content += `\n\n${texto}`
    else r.push({ role, content: texto })
  }
  return r
}

/* o nome e o contacto só contam se passarem a mesma validação do formulário */
export function contactoDe({ nome, email, telefone } = {}) {
  const d = { nome: String(nome || '').trim().slice(0, 80), email: String(email || '').trim().slice(0, 120), telefone: String(telefone || '').trim().slice(0, 30) }
  const ok = c => d[c] && !erroDoCampo(c, d) ? d[c] : ''
  return { nome: ok('nome'), email: ok('email'), telefone: ok('telefone') }
}

/* junta o contacto que já se sabia com o que chegou agora: o novo ganha, o vazio não apaga */
export const juntarContacto = (antes, agora) => {
  const a = contactoDe(antes), b = contactoDe(agora)
  return { nome: b.nome || a.nome, email: b.email || a.email, telefone: b.telefone || a.telefone }
}

export const temContacto = c => !!(c?.nome && (c.email || c.telefone))

/* a conversa toda, para a nota do contacto no GHL */
export function transcricao(mensagens, { pagina = '', quando = new Date() } = {}) {
  const hora = quando.toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon', dateStyle: 'short', timeStyle: 'short' })
  const linhas = mensagens.map(m => `${m.de === 'clara' ? 'Clara' : 'Visitante'}: ${String(m.texto).trim()}`)
  return [`Conversa com o assistente do site da N5 Clara (atualizada a ${hora}).`, ...(pagina ? [`Página: ${pagina}`] : []), '', ...linhas].join('\n').slice(0, 20000)
}
