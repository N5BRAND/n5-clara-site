import { enviarParaGhl } from '../ghl.js'
import { codigoVoucher, enviarEmailVoucher } from '../voucher.js'
import { paraConversoes, enviarConversao } from '../meta.js'
import { connectLambda, getStore } from '@netlify/blobs'
import { registarSeguimento } from '../seguimento.js'

/* corre a cada inscrição válida dos formulários da Netlify (o spam fica de fora).
   GHL: precisa de GHL_TOKEN e GHL_LOCATION_ID; sem elas, não envia para o GHL. No inquérito, o GHL também envia o email
   com o voucher (netlify/voucher.js).
   API de Conversões da Meta: precisa de N5_CONTROLO_URL e N5_CONTROLO_CHAVE; sem elas, não envia; e só segue
   para quem aceitou os cookies de marketing. Uma ligação a falhar não trava a outra. */
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
      const inquerito = payload.form_name === 'inquerito-clara'
      const dados = inquerito ? { ...payload.data, voucher: codigoVoucher(payload.data?.email) } : payload.data
      const r = await enviarParaGhl({ formulario: payload.form_name, dados, token, localizacao })
      console.log('GHL', payload.form_name, r.ok ? 'contacto atualizado' : r.motivo)
      /* inscrição sem pagamento: entra no seguimento por email (netlify/seguimento.js); se pagar, sai sozinha */
      if (payload.form_name === 'lista-clara' && r.ok) {
        const d = payload.data || {}
        try {
          /* esta função usa o formato antigo (handler): o Netlify Blobs só fica disponível depois de connectLambda, e sem a
             leitura com consistência forte (que precisa de uncachedEdgeURL); para registar uma pessoa nova chega a normal */
          connectLambda(event)
          const novo = await registarSeguimento(getStore({ name: 'seguimento' }), { contactId: r.id, email: d.email, nome: d.nome, tipo: 'inscricao', codigo: d.codigo, indicado: d.indicado_codigo, teste: d.teste === '1' })
          console.log('seguimento:', novo ? 'entrou' : 'já estava')
        } catch (e) {
          console.error('seguimento: não registou:', e.message)
        }
      }
      /* inquérito: o voucher e o plano seguem por email, pelo GHL, para o contacto que acabou de ser criado */
      if (inquerito && r.ok) {
        try {
          await enviarEmailVoucher({ contactId: r.id, nome: dados.nome, email: dados.email, respostas: dados.respostas, teste: dados.teste === '1', token })
          console.log('GHL inquerito-clara: email do voucher enviado')
        } catch (e) {
          console.error('email do voucher falhou:', e.message)
        }
      }
    } catch (e) {
      console.error('GHL falhou:', e.message)
    }
  }

  const corpo = paraConversoes(payload.form_name, payload.data)
  if (corpo && controlo && chave) {
    try {
      const r = await enviarConversao({ corpo, url: controlo, chave })
      console.log('Meta', payload.form_name, r.enviado ? 'Lead enviado' : `não enviado (${r.estado}${r.motivo ? `: ${r.motivo}` : ''})`)
    } catch (e) {
      console.error('Meta falhou:', e.message)
    }
  }
  return { statusCode: 200 }
}
