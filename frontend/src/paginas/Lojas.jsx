import { useId, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import CardLoja from '../components/CardLoja.jsx'
import { ordenarPt } from '../utils/texto.js'
import Pagina from '../components/Pagina.jsx'

// Lista de todas as lojas, com filtro por país (guardado na URL: /lojas?pais=Brasil).
export default function Lojas({ pontos }) {
  const [parametros, setParametros] = useSearchParams()
  const idFiltro = useId()
  const pais = parametros.get('pais') ?? ''

  const paises = useMemo(() => [...new Set(pontos.map((p) => p.pais))].sort(ordenarPt), [pontos])

  const filtrados = useMemo(
    () =>
      pontos
        .filter((p) => pais === '' || p.pais === pais)
        .sort((a, b) => ordenarPt(a.pais, b.pais) || ordenarPt(a.cidade, b.cidade)),
    [pontos, pais],
  )

  function trocarPais(evento) {
    const valor = evento.target.value
    setParametros(valor ? { pais: valor } : {}, { replace: true })
  }

  return (
    <Pagina titulo="Lojas">
      <h1 className="titulo-pagina">Lojas</h1>
      <p className="subtitulo">Cidades com lojas físicas de camisas de futebol vintage.</p>

      <div className="filtro">
        <label htmlFor={idFiltro}>Filtrar por país</label>
        <select id={idFiltro} className="campo" value={pais} onChange={trocarPais}>
          <option value="">Todos os países</option>
          {paises.map((nome) => (
            <option key={nome} value={nome}>
              {nome}
            </option>
          ))}
        </select>
      </div>

      <p className="contagem" role="status">
        {filtrados.length === 1 ? '1 cidade encontrada' : `${filtrados.length} cidades encontradas`}
      </p>

      {filtrados.length > 0 ? (
        <ul className="cards">
          {filtrados.map((ponto) => (
            <CardLoja key={ponto.id} ponto={ponto} comLink />
          ))}
        </ul>
      ) : (
        <p className="vazio">Nenhuma loja cadastrada neste país ainda.</p>
      )}
    </Pagina>
  )
}
