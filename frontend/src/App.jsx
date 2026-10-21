import { useEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Cabecalho from './components/Cabecalho.jsx'
import Pagina from './components/Pagina.jsx'
import Rodape from './components/Rodape.jsx'
import Inicio from './paginas/Inicio.jsx'
import Lojas from './paginas/Lojas.jsx'
import LojasCidade from './paginas/LojasCidade.jsx'
import NaoEncontrada from './paginas/NaoEncontrada.jsx'
import Sugerir from './paginas/Sugerir.jsx'
import { buscarPontos } from './servicos/lojas.js'

// Ao navegar entre páginas, leva o foco para o conteúdo novo (como numa troca de página comum).
function useFocoAoTrocarDeRota() {
  const { pathname } = useLocation()
  const anteriorRef = useRef(pathname)

  useEffect(() => {
    if (anteriorRef.current === pathname) return
    anteriorRef.current = pathname
    window.scrollTo(0, 0)
    document.getElementById('conteudo')?.focus({ preventScroll: true })
  }, [pathname])
}

export default function App() {
  const [pontos, setPontos] = useState(null)
  useFocoAoTrocarDeRota()

  useEffect(() => {
    let ativo = true
    buscarPontos().then((dados) => {
      if (ativo) setPontos(dados)
    })
    return () => {
      ativo = false
    }
  }, [])

  return (
    <>
      <a className="pular-conteudo" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Cabecalho />
      {pontos === null ? (
        <Pagina>
          <p className="carregando" role="status">
            Carregando lojas…
          </p>
        </Pagina>
      ) : (
        <Routes>
          <Route path="/" element={<Inicio pontos={pontos} />} />
          <Route path="/lojas" element={<Lojas pontos={pontos} />} />
          <Route path="/lojas/:cidade" element={<LojasCidade pontos={pontos} />} />
          <Route path="/sugerir" element={<Sugerir pontos={pontos} />} />
          <Route path="*" element={<NaoEncontrada />} />
        </Routes>
      )}
      <Rodape />
    </>
  )
}
