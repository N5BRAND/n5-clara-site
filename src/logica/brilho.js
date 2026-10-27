/* brilho que segue o rato: laranja suave nos fundos claros, branco nos escuros.
   Só em computadores com rato e sem «reduzir movimento»; não apanha cliques. */

/* fundo escuro por baixo do ponto: sobe pelos elementos até encontrar uma cor de fundo opaca */
export function fundoEscuro(elemento) {
  for (let n = elemento; n && n.nodeType === 1; n = n.parentElement) {
    const m = getComputedStyle(n).backgroundColor.match(/[\d.]+/g)
    if (!m) continue
    const [r, g, b, a = 1] = m.map(Number)
    if (a < 0.5) continue
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.45
  }
  return false
}

export function iniciarBrilho() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const el = document.createElement('div')
  el.className = 'brilho-rato'
  el.setAttribute('aria-hidden', 'true')
  document.body.appendChild(el)

  let alvoX = 0, alvoY = 0, x = 0, y = 0, aMover = false, primeiro = true

  const passo = () => {
    x += (alvoX - x) * 0.16
    y += (alvoY - y) * 0.16
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`
    aMover = Math.abs(alvoX - x) > 0.5 || Math.abs(alvoY - y) > 0.5
    if (aMover) requestAnimationFrame(passo)
  }

  window.addEventListener('mousemove', e => {
    alvoX = e.clientX
    alvoY = e.clientY
    if (primeiro) { x = alvoX; y = alvoY; primeiro = false }
    el.classList.add('brilho-rato--visivel')
    el.classList.toggle('brilho-rato--escuro', fundoEscuro(document.elementFromPoint(alvoX, alvoY)))
    if (!aMover) { aMover = true; requestAnimationFrame(passo) }
  }, { passive: true })

  document.documentElement.addEventListener('mouseleave', () => el.classList.remove('brilho-rato--visivel'))
}
