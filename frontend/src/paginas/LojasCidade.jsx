import { Link, useParams } from 'react-router-dom'
import CardLoja from '../components/CardLoja.jsx'
import Pagina from '../components/Pagina.jsx'
import { criarSlug } from '../utils/texto.js'

// Lojas de uma cidade: /lojas/:cidade (ex.: /lojas/sao-paulo).
export default function LojasCidade({ pontos }) {
  const { cidade } = useParams()
  const daCidade = pontos.filter((p) => criarSlug(p.cidade) === cidade)

  if (daCidade.length === 0) {
    return (
      <Pagina titulo="Cidade não encontrada">
        <h1 className="titulo-pagina">Cidade não encontrada</h1>
        <p className="subtitulo">Ainda não temos lojas cadastradas nesta cidade.</p>
        <p className="acoes">
          <Link className="botao" to="/lojas">
            Ver todas as lojas
          </Link>
          <Link className="botao-secundario" to="/sugerir">
            Sugerir uma loja
          </Link>
        </p>
      </Pagina>
    )
  }

  const { cidade: nome, pais } = daCidade[0]

  return (
    <Pagina titulo={`Lojas em ${nome}`}>
      <p className="migalha">
        <Link to="/lojas">Lojas</Link> <span aria-hidden="true">/</span>{' '}
        <Link to={`/lojas?pais=${encodeURIComponent(pais)}`}>{pais}</Link>
      </p>
      <h1 className="titulo-pagina">Lojas em {nome}</h1>
      <p className="subtitulo">{pais}</p>

      <ul className="cards">
        {daCidade.map((ponto) => (
          <CardLoja key={ponto.id} ponto={ponto} />
        ))}
      </ul>
    </Pagina>
  )
}
