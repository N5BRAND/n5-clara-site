import { ESPERA_MS } from './conversa.js'

/* o assistente só carrega 2 segundos depois de a página abrir, num ficheiro à parte, para não atrasar o arranque */
export function iniciarAssistente() {
  if (typeof window === 'undefined') return
  setTimeout(() => {
    import('./montar.jsx').then(m => m.montar()).catch(e => console.warn('assistente:', e.message))
  }, ESPERA_MS)
}
