import { Link } from 'react-router-dom'

const PASSOS = [
  {
    titulo: 'Encontre perto de você',
    texto:
      'Diga em que país e cidade você está. O globo gira até lá e mostra onde existem lojas físicas de camisas antigas.',
  },
  {
    titulo: 'Veja de perto antes de comprar',
    texto:
      'Na loja dá para conferir tecido, etiqueta, patrocinador e numeração — o jeito mais seguro de fugir das réplicas.',
  },
  {
    titulo: 'Ajude o mapa a crescer',
    texto:
      'Conhece um brechó, sebo ou colecionador que vende camisas vintage? Sugira a loja e ela entra no globo.',
  },
]

// Texto sobre o objetivo do site, abaixo do globo.
export default function Sobre() {
  return (
    <section className="sobre" aria-labelledby="titulo-sobre">
      <p className="sobretitulo">Sobre o projeto</p>
      <h2 id="titulo-sobre" className="sobre-titulo">
        Toda camisa antiga guarda uma história
      </h2>
      <div className="sobre-texto">
        <p>
          Para quem ama futebol, a camisa nunca é só roupa: é o manto. Ela lembra um gol, uma
          final, uma geração inteira de torcedores. Só que as camisas que marcaram época estão
          espalhadas pelo mundo, em lojinhas de bairro, feiras e acervos que pouca gente conhece.
        </p>
        <p>
          O <strong>Caçadores de Manto</strong> nasceu para juntar essas lojas num só lugar. A ideia
          é simples: um mapa colaborativo das lojas físicas de camisas de futebol vintage, para você
          achar a mais próxima, visitar pessoalmente e sair de lá com um pedaço da história do seu
          clube.
        </p>
      </div>

      <ol className="passos">
        {PASSOS.map((passo, i) => (
          <li key={passo.titulo} className="passo">
            <span className="passo-numero" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3>{passo.titulo}</h3>
            <p>{passo.texto}</p>
          </li>
        ))}
      </ol>

      <p className="acoes acoes-centro">
        <Link className="botao" to="/sugerir">
          Sugerir uma loja
        </Link>
      </p>
    </section>
  )
}
