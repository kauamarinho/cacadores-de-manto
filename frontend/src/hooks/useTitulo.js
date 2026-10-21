import { useEffect } from 'react'

const NOME_SITE = 'Caçadores de Manto'

// Atualiza o título da aba (lido pelos leitores de tela ao trocar de página).
export default function useTitulo(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} · ${NOME_SITE}` : NOME_SITE
  }, [titulo])
}
