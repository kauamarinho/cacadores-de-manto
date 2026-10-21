import { useId, useMemo, useState } from 'react'
import { normalizar } from '../utils/texto.js'

const MAXIMO_SUGESTOES = 6

// Campo de texto arredondado com sugestões (padrão ARIA "combobox" com lista).
// Teclado: ↑/↓ percorrem as sugestões, Enter escolhe (ou confirma o texto), Esc fecha a lista.
export default function CampoBusca({
  rotulo,
  placeholder,
  opcoes,
  onConfirmar,
  campoRef,
  textoBotao = 'Continuar',
}) {
  const [texto, setTexto] = useState('')
  const [aberta, setAberta] = useState(false)
  const [ativa, setAtiva] = useState(-1)
  const idBase = useId()
  const idLista = `${idBase}-lista`
  const idCampo = `${idBase}-campo`

  const sugestoes = useMemo(() => {
    const busca = normalizar(texto)
    if (!busca) return opcoes.slice(0, MAXIMO_SUGESTOES)
    const comecam = opcoes.filter((o) => normalizar(o).startsWith(busca))
    const contem = opcoes.filter((o) => !comecam.includes(o) && normalizar(o).includes(busca))
    return [...comecam, ...contem].slice(0, MAXIMO_SUGESTOES)
  }, [texto, opcoes])

  const listaVisivel = aberta && sugestoes.length > 0

  function escolher(valor) {
    setTexto(valor)
    setAberta(false)
    onConfirmar(valor)
  }

  function confirmar() {
    if (ativa >= 0 && listaVisivel) {
      escolher(sugestoes[ativa])
      return
    }
    // Aceita o texto digitado se ele bater (sem acento/maiúscula) com uma opção.
    const exato = opcoes.find((o) => normalizar(o) === normalizar(texto))
    const unica = sugestoes.length === 1 && normalizar(texto).length >= 3 ? sugestoes[0] : null
    const valor = exato ?? unica
    if (valor) escolher(valor)
    else onConfirmar(null, texto.trim())
  }

  function aoTeclar(evento) {
    switch (evento.key) {
      case 'ArrowDown':
        evento.preventDefault()
        setAberta(true)
        setAtiva((i) => Math.min(i + 1, sugestoes.length - 1))
        break
      case 'ArrowUp':
        evento.preventDefault()
        setAtiva((i) => Math.max(i - 1, -1))
        break
      case 'Escape':
        if (listaVisivel) {
          evento.preventDefault()
          setAberta(false)
          setAtiva(-1)
        }
        break
      default:
        break
    }
  }

  function enviar(evento) {
    evento.preventDefault()
    confirmar()
  }

  return (
    <form className="campo-busca" onSubmit={enviar} role="search">
      <label className="visualmente-oculto" htmlFor={idCampo}>
        {rotulo}
      </label>
      <div className="campo-busca-caixa">
        <input
          ref={campoRef}
          id={idCampo}
          className="campo-busca-input"
          type="text"
          autoComplete="off"
          spellCheck="false"
          placeholder={placeholder}
          value={texto}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={listaVisivel}
          aria-controls={idLista}
          aria-activedescendant={listaVisivel && ativa >= 0 ? `${idLista}-${ativa}` : undefined}
          onChange={(e) => {
            setTexto(e.target.value)
            setAberta(true)
            // A lista muda a cada letra: volta a seleção para o início.
            setAtiva(-1)
          }}
          onFocus={() => setAberta(true)}
          onBlur={() => setAberta(false)}
          onKeyDown={aoTeclar}
        />
        <button type="submit" className="campo-busca-botao">
          {textoBotao}
        </button>
      </div>

      <ul id={idLista} role="listbox" className="campo-busca-lista" hidden={!listaVisivel}>
        {sugestoes.map((opcao, i) => (
          <li
            key={opcao}
            id={`${idLista}-${i}`}
            role="option"
            aria-selected={i === ativa}
            className={i === ativa ? 'ativa' : undefined}
            // mousedown em vez de click: escolhe antes de o campo perder o foco.
            onMouseDown={(e) => {
              e.preventDefault()
              escolher(opcao)
            }}
          >
            {opcao}
          </li>
        ))}
      </ul>
    </form>
  )
}
