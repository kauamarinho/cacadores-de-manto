import { useSyncExternalStore } from 'react'

const CONSULTA = '(prefers-reduced-motion: reduce)'

function assinar(callback) {
  const mql = window.matchMedia(CONSULTA)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

// true quando o usuário pediu para reduzir animações no sistema operacional.
export default function useMovimentoReduzido() {
  return useSyncExternalStore(
    assinar,
    () => window.matchMedia(CONSULTA).matches,
    () => false,
  )
}
