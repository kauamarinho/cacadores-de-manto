import { useEffect, useRef, useState } from 'react'

// Navegadores sem IntersectionObserver mostram tudo de uma vez.
const temObservador = typeof window !== 'undefined' && 'IntersectionObserver' in window

// Diz quando o elemento entrou na tela (uma vez só), para animar ao rolar a página.
export default function useRevelar({ margem = '0px 0px -10% 0px' } = {}) {
  const ref = useRef(null)
  const [visivel, setVisivel] = useState(!temObservador)

  useEffect(() => {
    const el = ref.current
    if (!el || visivel) return undefined
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true)
          observador.disconnect()
        }
      },
      { rootMargin: margem },
    )
    observador.observe(el)
    return () => observador.disconnect()
  }, [margem, visivel])

  return [ref, visivel]
}
