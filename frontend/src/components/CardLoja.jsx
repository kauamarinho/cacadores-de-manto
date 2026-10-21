import { Link } from 'react-router-dom'
import Escudo from './Escudo.jsx'
import { criarSlug } from '../utils/texto.js'

// Card com cidade, país e clube. Com comLink, o card inteiro leva para /lojas/:cidade.
export default function CardLoja({ ponto, comLink = false }) {
  const conteudo = (
    <>
      <Escudo clube={ponto.clube} tamanho={48} decorativo />
      <div className="card-texto">
        <h2 className="card-cidade">{ponto.cidade}</h2>
        <p className="card-pais">{ponto.pais}</p>
        <p className="card-clube">{ponto.clube.nome}</p>
      </div>
    </>
  )

  return (
    <li className="card-item">
      {comLink ? (
        <Link className="card card-link" to={`/lojas/${criarSlug(ponto.cidade)}`}>
          {conteudo}
        </Link>
      ) : (
        <article className="card">{conteudo}</article>
      )}
    </li>
  )
}
