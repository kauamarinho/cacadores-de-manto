import useTitulo from '../hooks/useTitulo.js'

// Área principal de cada página. O id e o tabIndex permitem que o link
// "Pular para o conteúdo" e a troca de rota levem o foco do teclado até aqui.
export default function Pagina({ titulo, className = '', children }) {
  useTitulo(titulo)

  return (
    <main id="conteudo" tabIndex={-1} className={`pagina ${className}`.trim()}>
      {children}
    </main>
  )
}
