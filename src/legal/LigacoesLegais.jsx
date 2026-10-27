import { abrirCookies } from './AvisoCookies.jsx'

export default function LigacoesLegais() {
  return (
    <nav className="legal-links" aria-label="Informação legal">
      <a href="/privacidade/">Política de privacidade</a>
      <a href="/termos/">Termos e condições</a>
      <a href="/privacidade/#cookies" onClick={abrirCookies}>Definições de cookies</a>
    </nav>
  )
}
