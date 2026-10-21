import { Link } from 'react-router-dom'
import Pagina from '../components/Pagina.jsx'

export default function NaoEncontrada() {
  return (
    <Pagina titulo="Página não encontrada">
      <h1 className="titulo-pagina">Página não encontrada</h1>
      <p className="subtitulo">O endereço que você abriu não existe.</p>
      <p className="acoes">
        <Link className="botao" to="/">
          Voltar para o início
        </Link>
      </p>
    </Pagina>
  )
}
