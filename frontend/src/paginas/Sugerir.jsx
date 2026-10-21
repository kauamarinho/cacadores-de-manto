import { useId, useMemo, useRef, useState } from 'react'
import Pagina from '../components/Pagina.jsx'
import { ordenarPt } from '../utils/texto.js'
import { LIMITE_OBSERVACOES, normalizarInstagram, validarSugestao } from '../utils/validacao.js'

const VAZIO = { nome: '', cidade: '', pais: '', endereco: '', instagram: '', observacoes: '' }

const CAMPOS = [
  { nome: 'nome', rotulo: 'Nome da loja', obrigatorio: true, autoComplete: 'organization' },
  { nome: 'cidade', rotulo: 'Cidade', obrigatorio: true, autoComplete: 'address-level2' },
  { nome: 'pais', rotulo: 'País', obrigatorio: true, autoComplete: 'country-name', lista: true },
  { nome: 'endereco', rotulo: 'Endereço', obrigatorio: true, autoComplete: 'street-address' },
  {
    nome: 'instagram',
    rotulo: 'Instagram',
    dica: 'Ex.: @nomedaloja ou instagram.com/nomedaloja',
    autoComplete: 'off',
  },
]

// Formulário para sugerir uma loja nova. Valida no front; o envio ainda é simulado.
export default function Sugerir({ pontos }) {
  const [dados, setDados] = useState(VAZIO)
  const [erros, setErros] = useState({})
  const [tentouEnviar, setTentouEnviar] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const resumoRef = useRef(null)
  const sucessoRef = useRef(null)
  const prefixo = useId()
  const idDe = (campo) => `${prefixo}-${campo}`

  const paises = useMemo(() => [...new Set(pontos.map((p) => p.pais))].sort(ordenarPt), [pontos])

  function alterar(evento) {
    const { name, value } = evento.target
    const novos = { ...dados, [name]: value }
    setDados(novos)
    setEnviado(false)
    // Depois da primeira tentativa, os erros somem assim que o campo é corrigido.
    if (tentouEnviar) setErros(validarSugestao(novos))
  }

  function enviar(evento) {
    evento.preventDefault()
    setTentouEnviar(true)
    const encontrados = validarSugestao(dados)
    setErros(encontrados)

    if (Object.keys(encontrados).length > 0) {
      // Espera o resumo de erros aparecer na tela antes de levar o foco até ele.
      requestAnimationFrame(() => resumoRef.current?.focus())
      return
    }

    const sugestao = {
      nome: dados.nome.trim(),
      cidade: dados.cidade.trim(),
      pais: dados.pais.trim(),
      endereco: dados.endereco.trim(),
      instagram: dados.instagram.trim() ? normalizarInstagram(dados.instagram) : null,
      observacoes: dados.observacoes.trim() || null,
    }

    // TODO: enviar para POST /api/sugestoes
    console.log('Sugestão de loja:', sugestao)

    setDados(VAZIO)
    setErros({})
    setTentouEnviar(false)
    setEnviado(true)
    requestAnimationFrame(() => sucessoRef.current?.focus())
  }

  const listaErros = Object.entries(erros)
  const restantes = LIMITE_OBSERVACOES - dados.observacoes.length

  function propsDoCampo(campo, idDica) {
    const temErro = Boolean(erros[campo])
    const descricoes = [idDica, temErro ? idDe(`${campo}-erro`) : null].filter(Boolean)
    return {
      id: idDe(campo),
      name: campo,
      value: dados[campo],
      onChange: alterar,
      'aria-invalid': temErro || undefined,
      'aria-describedby': descricoes.length ? descricoes.join(' ') : undefined,
      className: temErro ? 'campo campo-erro' : 'campo',
    }
  }

  return (
    <Pagina titulo="Sugerir loja" className="pagina-estreita">
      <h1 className="titulo-pagina">Sugerir loja</h1>
      <p className="subtitulo">
        Conhece uma loja física de camisas vintage que não está no mapa? Conte para a gente.
      </p>

      {enviado && (
        <div ref={sucessoRef} className="aviso aviso-sucesso" role="status" tabIndex={-1}>
          <strong>Obrigado pela sugestão!</strong> Vamos conferir a loja e, se estiver tudo certo,
          ela aparece no mapa.
        </div>
      )}

      {listaErros.length > 0 && (
        <div
          ref={resumoRef}
          className="aviso aviso-erro"
          role="alert"
          tabIndex={-1}
          aria-labelledby={idDe('resumo')}
        >
          <p id={idDe('resumo')}>
            <strong>
              {listaErros.length === 1
                ? 'Corrija 1 campo para enviar:'
                : `Corrija ${listaErros.length} campos para enviar:`}
            </strong>
          </p>
          <ul>
            {listaErros.map(([campo, mensagem]) => (
              <li key={campo}>
                <a href={`#${idDe(campo)}`}>{mensagem}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form className="formulario" onSubmit={enviar} noValidate>
        <p className="legenda-obrigatorio">
          Campos marcados com <span aria-hidden="true">*</span>
          <span className="visualmente-oculto">asterisco</span> são obrigatórios.
        </p>

        {CAMPOS.map((campo) => {
          const idDica = campo.dica ? idDe(`${campo.nome}-dica`) : null
          return (
            <div key={campo.nome} className="grupo">
              <label htmlFor={idDe(campo.nome)}>
                {campo.rotulo}
                {campo.obrigatorio ? (
                  <span className="obrigatorio" aria-hidden="true">
                    {' '}
                    *
                  </span>
                ) : (
                  <span className="opcional"> (opcional)</span>
                )}
              </label>
              {campo.dica && (
                <p id={idDica} className="dica">
                  {campo.dica}
                </p>
              )}
              <input
                type="text"
                autoComplete={campo.autoComplete}
                required={campo.obrigatorio}
                list={campo.lista ? idDe('paises') : undefined}
                {...propsDoCampo(campo.nome, idDica)}
              />
              {erros[campo.nome] && (
                <p id={idDe(`${campo.nome}-erro`)} className="erro">
                  {erros[campo.nome]}
                </p>
              )}
            </div>
          )
        })}

        <datalist id={idDe('paises')}>
          {paises.map((nome) => (
            <option key={nome} value={nome} />
          ))}
        </datalist>

        <div className="grupo">
          <label htmlFor={idDe('observacoes')}>
            Observações<span className="opcional"> (opcional)</span>
          </label>
          <p id={idDe('observacoes-dica')} className="dica">
            Horário, especialidade, faixa de preço… ({restantes} caracteres restantes)
          </p>
          <textarea rows={5} {...propsDoCampo('observacoes', idDe('observacoes-dica'))} />
          {erros.observacoes && (
            <p id={idDe('observacoes-erro')} className="erro">
              {erros.observacoes}
            </p>
          )}
        </div>

        <button type="submit" className="botao">
          Enviar sugestão
        </button>
      </form>
    </Pagina>
  )
}
