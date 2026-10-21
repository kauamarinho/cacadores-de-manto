import useRevelar from '../hooks/useRevelar.js'

// Uma foto no formato de polaroid, que "cai" na mesa quando aparece na tela.
function Polaroid({ cidade, indice }) {
  const [ref, visivel] = useRevelar()

  return (
    <li
      ref={ref}
      className={visivel ? 'polaroid visivel' : 'polaroid'}
      style={{ '--atraso': `${(indice % 4) * 90}ms` }}
    >
      <figure>
        <div className="polaroid-foto">
          <img src={cidade.foto} alt={cidade.alt} loading="lazy" decoding="async" />
        </div>
        <figcaption>
          <span className="polaroid-cidade">{cidade.cidade}</span>
          <span className="polaroid-legenda">{cidade.legenda}</span>
        </figcaption>
      </figure>
    </li>
  )
}

// Galeria de cidades famosas do futebol, no estilo de fotos de câmera polaroid.
export default function Polaroids({ cidades }) {
  return (
    <section className="polaroids" aria-labelledby="titulo-polaroids">
      <p className="sobretitulo">Pelo mundo</p>
      <h2 id="titulo-polaroids" className="sobre-titulo">
        Cidades que respiram futebol
      </h2>
      <ul className="polaroids-mesa">
        {cidades.map((cidade, i) => (
          <Polaroid key={cidade.id} cidade={cidade} indice={i} />
        ))}
      </ul>
    </section>
  )
}
