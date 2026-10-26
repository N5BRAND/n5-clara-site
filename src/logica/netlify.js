/* corpo application/x-www-form-urlencoded que o Netlify Forms espera */
export const codificar = obj =>
  Object.entries(obj)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
