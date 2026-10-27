import { enviarParaGhl } from '../ghl.js'

/* corre a cada inscrição válida dos formulários da Netlify (o spam fica de fora).
   Precisa de GHL_TOKEN e GHL_LOCATION_ID nas variáveis do site; sem elas, não faz nada. */
export const handler = async event => {
  const { GHL_TOKEN: token, GHL_LOCATION_ID: localizacao } = process.env
  if (!token || !localizacao) {
    console.log('GHL por configurar: falta GHL_TOKEN ou GHL_LOCATION_ID')
    return { statusCode: 200 }
  }
  try {
    const { payload } = JSON.parse(event.body)
    const r = await enviarParaGhl({ formulario: payload.form_name, dados: payload.data, token, localizacao })
    console.log('GHL', payload.form_name, r.ok ? 'contacto atualizado' : r.motivo)
  } catch (e) {
    console.error('GHL falhou:', e.message)
  }
  return { statusCode: 200 }
}
