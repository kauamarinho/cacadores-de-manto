import { pontos as pontosLocais } from '../dados/pontos.js'

// Endereço da API definido em .env (VITE_API_URL). Sem .env, usa o padrão do Spring Boot.
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '')

// Tempo máximo esperando a API antes de usar os dados locais.
const TEMPO_LIMITE_MS = 3000

// Busca os pontos (cidades com lojas) na API.
// Se a API não responder, der erro ou devolver algo inesperado, usa src/dados/pontos.js.
// A API deve devolver uma lista no mesmo formato dos objetos de pontos.js.
export async function buscarPontos() {
  const controle = new AbortController()
  const timer = setTimeout(() => controle.abort(), TEMPO_LIMITE_MS)

  try {
    const resposta = await fetch(`${API_URL}/api/lojas`, { signal: controle.signal })
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`)

    const dados = await resposta.json()
    if (!Array.isArray(dados)) throw new Error('Resposta da API não é uma lista')

    return dados
  } catch (erro) {
    console.info(`API indisponível (${erro.message}); usando dados locais.`)
    return pontosLocais
  } finally {
    clearTimeout(timer)
  }
}
