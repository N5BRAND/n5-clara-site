/* conta o tempo em que a página está mesmo à vista (separador ativo) e avisa uma vez quando chega aos segundos pedidos.
   Serve para só contar uma visualização a quem fica: um clique que sai logo, ou um robô, não chega lá.
   Os navegadores automatizados (navigator.webdriver) nunca contam. */
export const SEGUNDOS_VISUALIZACAO = 6

export function quandoVisivel(segundos, fn, ambiente = {}) {
  const doc = ambiente.doc ?? document
  const nav = ambiente.nav ?? navigator
  const agora = ambiente.agora ?? (() => Date.now())
  const temporizador = ambiente.temporizador ?? { marcar: (f, ms) => setTimeout(f, ms), limpar: t => clearTimeout(t) }
  if (nav?.webdriver) return () => {}

  const alvo = segundos * 1000
  let acumulado = 0
  let desde = null
  let t = null
  let feito = false

  const visivel = () => doc.visibilityState !== 'hidden'
  const parar = () => {
    if (desde !== null) acumulado += agora() - desde
    desde = null
    if (t !== null) temporizador.limpar(t)
    t = null
  }
  const verificar = () => {
    if (feito) return
    parar()
    if (acumulado >= alvo) {
      feito = true
      doc.removeEventListener('visibilitychange', mudou)
      fn(Math.round(acumulado / 1000))
      return
    }
    if (visivel()) {
      desde = agora()
      t = temporizador.marcar(verificar, alvo - acumulado)
    }
  }
  const mudou = () => verificar()

  doc.addEventListener('visibilitychange', mudou)
  verificar()
  return () => { feito = true; parar(); doc.removeEventListener('visibilitychange', mudou) }
}
