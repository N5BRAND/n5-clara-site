import { enviarParaGhl } from '../ghl.js'
import { paraConversoes, enviarConversao } from '../meta.js'

/* corre a cada inscrição válida dos formulários da Netlify (o spam fica de fora).
   GHL: precisa de GHL_TOKEN e GHL_LOCATION_ID; sem elas, não envia para o GHL.
   N5 Controlo: precisa de N5_CONTROLO_URL e N5_CONTROLO_CHAVE; sem elas, não envia. Todas as inscrições levam a
   página e o anúncio (para as compras da Stripe); só com os cookies de marketing aceites seguem os dados para a
   API de Conversões da Meta. Uma ligação a falhar não trava a outra. */
export const handler = async event => {
  let payload
  try {
    payload = JSON.parse(event.body).payload
  } catch (e) {
    console.error('inscrição ilegível:', e.message)
    return { statusCode: 200 }
  }
  const { GHL_TOKEN: token, GHL_LOCATION_ID: localizacao, N5_CONTROLO_URL: controlo, N5_CONTROLO_CHAVE: chave } = process.env

  if (!token || !localizacao) {
    console.log('GHL por configurar: falta GHL_TOKEN ou GHL_LOCATION_ID')
  } else {
    try {
      const r = await enviarParaGhl({ formulario: payload.form_name, dados: payload.data, token, localizacao })
      console.log('GHL', payload.form_name, r.ok ? 'contacto atualizado' : r.motivo)
    } catch (e) {
      console.error('GHL falhou:', e.message)
    }
  }

  const corpo = paraConversoes(payload.form_name, payload.data)
  if (corpo && controlo && chave) {
    try {
      const r = await enviarConversao({ corpo, url: controlo, chave })
      console.log('Meta', payload.form_name, r.enviado ? 'Lead enviado à Meta' : `guardado no Controlo, não enviado à Meta (${r.estado}${r.motivo ? `: ${r.motivo}` : ''})`)
    } catch (e) {
      console.error('Meta falhou:', e.message)
    }
  }
  return { statusCode: 200 }
}
