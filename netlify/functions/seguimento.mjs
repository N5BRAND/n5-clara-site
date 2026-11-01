import { getStore } from '@netlify/blobs'
import { correr } from '../seguimento.js'

/* a cada 15 minutos: os emails de seguimento de quem deixou contacto e não fez a pré-reserva (netlify/seguimento.js).
   Só envia com SEGUIMENTO_ATIVO=1 nas variáveis do site; sem ela, ensaia e regista no log o que enviaria. */
export default async () => {
  const { GHL_TOKEN: token, SEGUIMENTO_ATIVO, VITE_ESGOTADO } = process.env
  if (!token) { console.log('seguimento: falta GHL_TOKEN'); return }
  const resumo = await correr({ loja: getStore({ name: 'seguimento', consistency: 'strong' }), token, ativo: SEGUIMENTO_ATIVO === '1', esgotado: VITE_ESGOTADO === '1' })
  console.log('seguimento:', JSON.stringify(resumo))
}

export const config = { schedule: '*/15 * * * *' }
