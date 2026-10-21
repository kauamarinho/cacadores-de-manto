import { useState } from 'react'
import Busca from '../components/Busca.jsx'
import Globo from '../components/Globo.jsx'
import Jogador from '../components/Jogador.jsx'
import Pagina from '../components/Pagina.jsx'
import Polaroids from '../components/Polaroids.jsx'
import Sobre from '../components/Sobre.jsx'
import { cidadesFamosas } from '../dados/cidadesFamosas.js'
import { jogadores } from '../dados/jogadores.js'

export default function Inicio({ pontos }) {
  const [cidadeEscolhida, setCidadeEscolhida] = useState(null)

  return (
    <Pagina className="pagina-inicial">
      <h1 className="visualmente-oculto">
        Caçadores de Manto: lojas de camisas de futebol vintage pelo mundo
      </h1>
      <Busca
        pontos={pontos}
        cidadeEscolhida={cidadeEscolhida}
        onEscolherCidade={setCidadeEscolhida}
      />
      <div className="palco">
        <Jogador jogador={jogadores.esquerda} lado="esquerda" />
        <Globo pontos={pontos} cidadeEscolhida={cidadeEscolhida} />
        <Jogador jogador={jogadores.direita} lado="direita" />
      </div>
      <Sobre />
      <Polaroids cidades={cidadesFamosas} />
    </Pagina>
  )
}
