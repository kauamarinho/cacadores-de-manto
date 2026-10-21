import { useState } from 'react'

// Mostra a imagem oficial do escudo (public/escudos/) quando existir.
// Sem imagem, ou se ela falhar ao carregar, desenha um escudo genérico com a sigla.
// decorativo: esconde dos leitores de tela quando o nome do clube já aparece ao lado.
export default function Escudo({ clube, tamanho = 40, decorativo = false }) {
  const [falhou, setFalhou] = useState(false)

  if (clube.escudo && !falhou) {
    return (
      <img
        className="escudo"
        src={clube.escudo}
        alt={decorativo ? '' : `Escudo do ${clube.nome}`}
        width={tamanho}
        height={tamanho}
        onError={() => setFalhou(true)}
      />
    )
  }

  const [corPrincipal, corSecundaria] = clube.cores
  const forma = 'M20 2 L36 7 V20 C36 30 29 36 20 39 C11 36 4 30 4 20 V7 Z'
  const acessibilidade = decorativo
    ? { 'aria-hidden': true }
    : { role: 'img', 'aria-label': `Escudo genérico do ${clube.nome}` }

  return (
    <svg className="escudo" viewBox="0 0 40 40" width={tamanho} height={tamanho} {...acessibilidade}>
      <path d={forma} fill={corPrincipal} stroke={corSecundaria} strokeWidth="2.5" />
      <text
        x="20"
        y="23"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Inter, sans-serif"
        fontWeight="700"
        fontSize={clube.sigla.length > 2 ? 10 : 12}
        fill={corSecundaria}
      >
        {clube.sigla}
      </text>
    </svg>
  )
}
