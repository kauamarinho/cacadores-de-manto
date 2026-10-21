// Regras de validação do formulário "Sugerir loja".

export const LIMITE_OBSERVACOES = 500

// Nome de usuário do Instagram: até 30 letras, números, ponto ou sublinhado,
// sem começar/terminar com ponto e sem dois pontos seguidos.
const USUARIO_INSTAGRAM = /^(?!\.)(?!.*\.\.)[A-Za-z0-9._]{1,30}(?<!\.)$/

// Aceita "@loja", "loja" ou o link do perfil ("instagram.com/loja").
// Devolve "@loja" ou null se o formato for inválido.
export function normalizarInstagram(valor) {
  let texto = valor.trim()
  const link = texto.match(/^(?:https?:\/\/)?(?:www\.)?instagram\.com\/([^/?#]+)\/?(?:[?#].*)?$/i)
  if (link) texto = link[1]
  texto = texto.replace(/^@/, '')
  return USUARIO_INSTAGRAM.test(texto) ? `@${texto}` : null
}

// Devolve um objeto { campo: 'mensagem de erro' } só com os campos inválidos.
export function validarSugestao(dados) {
  const erros = {}

  if (!dados.nome.trim()) erros.nome = 'Informe o nome da loja.'
  if (!dados.cidade.trim()) erros.cidade = 'Informe a cidade.'
  if (!dados.pais.trim()) erros.pais = 'Informe o país.'
  if (!dados.endereco.trim()) erros.endereco = 'Informe o endereço.'

  if (dados.instagram.trim() && !normalizarInstagram(dados.instagram)) {
    erros.instagram =
      'Instagram inválido. Use @usuario (letras, números, ponto ou _, até 30 caracteres).'
  }

  if (dados.observacoes.length > LIMITE_OBSERVACOES) {
    erros.observacoes = `As observações podem ter no máximo ${LIMITE_OBSERVACOES} caracteres.`
  }

  return erros
}
