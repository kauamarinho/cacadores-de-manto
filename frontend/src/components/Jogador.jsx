// Recorte de jogador com camisa histórica, ao lado do globo.
export default function Jogador({ jogador, lado }) {
  return (
    <figure className={`jogador jogador-${lado}`}>
      <img src={jogador.src} alt={jogador.alt} loading="eager" decoding="async" />
      <figcaption>{jogador.legenda}</figcaption>
    </figure>
  )
}
