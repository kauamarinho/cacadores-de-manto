import { creditos } from '../dados/creditos.js'

const GRUPOS = [
  { tipo: 'jogador', titulo: 'Jogadores' },
  { tipo: 'cidade', titulo: 'Cidades' },
  { tipo: 'escudo', titulo: 'Escudos' },
]

// Rodapé com os créditos das imagens (exigidos pelas licenças Creative Commons).
export default function Rodape() {
  return (
    <footer className="rodape">
      <p className="rodape-marca">Caçadores de Manto</p>
      <p className="rodape-texto">
        Um mapa das lojas físicas de camisas de futebol vintage pelo mundo.
      </p>

      <details className="creditos">
        <summary>Créditos das imagens</summary>
        <p className="creditos-nota">
          Imagens do Wikimedia Commons, com licença livre ou em domínio público. Os escudos são
          marcas dos seus clubes e aparecem aqui só para identificar cada cidade; alguns são versões
          históricas.
        </p>
        {GRUPOS.map((grupo) => (
          <div key={grupo.tipo}>
            <h2 className="creditos-grupo">{grupo.titulo}</h2>
            <ul className="creditos-lista">
              {creditos
                .filter((c) => c.tipo === grupo.tipo)
                .map((c) => (
                  <li key={c.arquivo}>
                    <a href={c.pagina} target="_blank" rel="noreferrer">
                      {c.titulo}
                    </a>{' '}
                    — {c.autor} · {c.licenca}
                    {c.observacao ? ` · ${c.observacao}` : ''}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </details>
    </footer>
  )
}
