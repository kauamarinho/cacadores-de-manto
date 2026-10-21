import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CampoBusca from './CampoBusca.jsx'
import { criarSlug, ordenarPt } from '../utils/texto.js'

// Pergunta em duas etapas: primeiro o país, depois a cidade.
export default function Busca({ pontos, cidadeEscolhida, onEscolherCidade }) {
  const [pais, setPais] = useState('')
  // null = sem aviso; '' = nada digitado; texto = não encontrado.
  const [naoEncontrado, setNaoEncontrado] = useState(null)
  const campoRef = useRef(null)

  const paises = useMemo(() => [...new Set(pontos.map((p) => p.pais))].sort(ordenarPt), [pontos])

  const cidades = useMemo(
    () =>
      pontos
        .filter((p) => p.pais === pais)
        .map((p) => p.cidade)
        .sort(ordenarPt),
    [pontos, pais],
  )

  const etapaCidade = pais !== ''
  const etapaAnteriorRef = useRef(etapaCidade)

  // Ao trocar de passo o campo é outro: devolve o foco a ele.
  useEffect(() => {
    if (etapaAnteriorRef.current !== etapaCidade) campoRef.current?.focus()
    etapaAnteriorRef.current = etapaCidade
  }, [etapaCidade])

  function confirmarPais(valor, digitado) {
    if (!valor) {
      setNaoEncontrado(digitado)
      return
    }
    setNaoEncontrado(null)
    setPais(valor)
    onEscolherCidade(null)
  }

  function confirmarCidade(valor, digitado) {
    if (!valor) {
      setNaoEncontrado(digitado)
      onEscolherCidade(null)
      return
    }
    setNaoEncontrado(null)
    onEscolherCidade(pontos.find((p) => p.pais === pais && p.cidade === valor) ?? null)
  }

  function voltar() {
    setPais('')
    setNaoEncontrado(null)
    onEscolherCidade(null)
  }

  const pergunta = etapaCidade ? 'Qual cidade?' : 'Onde você está localizado?'

  return (
    <section className="busca" aria-labelledby="pergunta-busca">
      <h2 id="pergunta-busca" className="busca-pergunta">
        {pergunta}
      </h2>

      {etapaCidade ? (
        <CampoBusca
          key="cidade"
          rotulo={`Cidade em ${pais}`}
          placeholder="Digite sua cidade"
          opcoes={cidades}
          onConfirmar={confirmarCidade}
          campoRef={campoRef}
        />
      ) : (
        <CampoBusca
          key="pais"
          rotulo="País"
          placeholder="Digite seu país"
          opcoes={paises}
          onConfirmar={confirmarPais}
          campoRef={campoRef}
        />
      )}

      {etapaCidade && (
        <p className="busca-etapa">
          País: <strong>{pais}</strong> ·{' '}
          <button type="button" className="botao-texto" onClick={voltar}>
            trocar país
          </button>
        </p>
      )}

      <div aria-live="polite">
        {naoEncontrado !== null && (
          <p className="busca-aviso">
            {naoEncontrado
              ? `Ainda não temos lojas em “${naoEncontrado}”.`
              : `Digite ${etapaCidade ? 'uma cidade' : 'um país'} para continuar.`}{' '}
            {naoEncontrado && <Link to="/sugerir">Conhece alguma? Sugira uma loja.</Link>}
          </p>
        )}

        {cidadeEscolhida && (
          <div className="busca-resultado">
            <p>
              Temos lojas em <strong>{cidadeEscolhida.cidade}</strong>, {cidadeEscolhida.pais}.
            </p>
            <Link className="botao" to={`/lojas/${criarSlug(cidadeEscolhida.cidade)}`}>
              Ver lojas em {cidadeEscolhida.cidade}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
