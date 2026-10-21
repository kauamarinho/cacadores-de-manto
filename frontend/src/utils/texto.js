// Remove acentos e padroniza maiúsculas: "São Paulo" → "sao paulo".
export function normalizar(texto) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

// Transforma um nome em trecho de URL: "São Paulo" → "sao-paulo".
export function criarSlug(texto) {
  return normalizar(texto)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const ordenarPt = (a, b) => a.localeCompare(b, 'pt-BR')
