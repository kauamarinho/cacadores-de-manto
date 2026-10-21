import { Link, NavLink } from 'react-router-dom'

// Logo e menu principal. A aba "Lojas" está fora do menu por enquanto (a rota continua existindo).
// NavLink marca o item da página atual com aria-current="page".
export default function Cabecalho() {
  return (
    <header className="cabecalho">
      <Link className="logo" to="/">
        <span className="logo-marca" aria-hidden="true">◎</span>
        Caçadores de Manto
      </Link>
      <nav aria-label="Menu principal">
        <ul className="menu">
          <li>
            <NavLink to="/" end>
              Início
            </NavLink>
          </li>
          <li>
            <NavLink to="/sugerir">Sugerir loja</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}
