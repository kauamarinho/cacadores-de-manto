import { useEffect, useRef, useState } from 'react'
import createGlobe from 'cobe'
import Escudo from './Escudo.jsx'
import useMovimentoReduzido from '../hooks/useMovimentoReduzido.js'
import { anguloPara, diferencaAngulo, projetar } from '../utils/geo.js'

const VELOCIDADE_ROTACAO = 0.003
const SUAVIZACAO_FOCO = 0.08
const THETA_PADRAO = 0.25
const TROCA_ROTULO_MS = 3000
const ALTURA_ROTULO = 30
const FOLGA_ROTULO = 4

// Globo COBE com rótulos HTML que alternam entre o nome da cidade e o escudo do clube.
// Os rótulos são posicionados a cada quadro por projetar(), que replica o shader.
export default function Globo({ pontos, cidadeEscolhida }) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const rotulosRef = useRef(new Map())
  const largurasRef = useRef(new Map())
  const focoRef = useRef(null)
  const destaqueRef = useRef(null)
  const movimentoReduzido = useMovimentoReduzido()
  const movimentoReduzidoRef = useRef(movimentoReduzido)
  const [tamanho, setTamanho] = useState(0)
  const [mostrarEscudo, setMostrarEscudo] = useState(false)

  // Guarda valores para o loop de renderização ler sem recriar o globo.
  useEffect(() => {
    focoRef.current = cidadeEscolhida ? anguloPara(cidadeEscolhida.lat, cidadeEscolhida.lng) : null
    destaqueRef.current = cidadeEscolhida?.id ?? null
  }, [cidadeEscolhida])

  useEffect(() => {
    movimentoReduzidoRef.current = movimentoReduzido
  }, [movimentoReduzido])

  // Acompanha a largura disponível (o globo é sempre quadrado).
  useEffect(() => {
    const el = containerRef.current
    const observador = new ResizeObserver(([entrada]) => {
      setTamanho(Math.round(entrada.contentRect.width))
    })
    observador.observe(el)
    return () => observador.disconnect()
  }, [])

  // Alterna rótulos entre cidade e escudo.
  useEffect(() => {
    const id = setInterval(() => setMostrarEscudo((v) => !v), TROCA_ROTULO_MS)
    return () => clearInterval(id)
  }, [])

  // A largura dos rótulos muda com o tamanho do globo e quando as fontes terminam de carregar.
  useEffect(() => {
    largurasRef.current.clear()
    document.fonts?.ready.then(() => largurasRef.current.clear())
  }, [tamanho, pontos])

  useEffect(() => {
    if (!tamanho) return undefined

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let phi = 0
    let theta = THETA_PADRAO

    function larguraDoRotulo(id, el) {
      let largura = largurasRef.current.get(id)
      if (largura === undefined) {
        largura = el.firstElementChild.offsetWidth
        largurasRef.current.set(id, largura)
      }
      return largura
    }

    function posicionarRotulos() {
      const destaque = destaqueRef.current
      const itens = []

      for (const ponto of pontos) {
        const el = rotulosRef.current.get(ponto.id)
        if (!el) continue
        const p = projetar(ponto.lat, ponto.lng, phi, theta, tamanho, tamanho)
        // Some suavemente perto da borda e esconde quando está atrás do globo.
        const opacidade = Math.max(0, Math.min(1, (p.z - 0.15) / 0.25))
        itens.push({ id: ponto.id, el, ...p, opacidade, prioridade: ponto.id === destaque })
      }

      // Rótulo em destaque primeiro, depois os mais de frente. Quem colide com um já aceito some.
      itens.sort((a, b) => b.prioridade - a.prioridade || b.z - a.z)
      const aceitos = []

      for (const item of itens) {
        const largura = item.opacidade > 0 ? larguraDoRotulo(item.id, item.el) : 0
        // Mantém o rótulo inteiro dentro do globo para não cortar nem criar rolagem lateral.
        const metade = largura / 2 + FOLGA_ROTULO
        const x = Math.min(Math.max(item.x, metade), tamanho - metade)
        const caixa = {
          esquerda: x - metade,
          direita: x + metade,
          topo: item.y - ALTURA_ROTULO - FOLGA_ROTULO,
          base: item.y,
        }
        const colide = aceitos.some(
          (c) =>
            caixa.esquerda < c.direita &&
            caixa.direita > c.esquerda &&
            caixa.topo < c.base &&
            caixa.base > c.topo,
        )
        const opacidade = colide ? 0 : item.opacidade
        if (opacidade > 0) aceitos.push(caixa)

        item.el.style.transform = `translate(${x}px, ${item.y}px)`
        item.el.style.opacity = String(opacidade)
        item.el.style.visibility = opacidade > 0 ? 'visible' : 'hidden'
        item.el.style.zIndex = String(Math.round(item.z * 100) + (item.prioridade ? 200 : 0))
      }
    }

    const globo = createGlobe(canvasRef.current, {
      devicePixelRatio: dpr,
      width: tamanho * dpr,
      height: tamanho * dpr,
      phi,
      theta,
      dark: 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      mapBaseBrightness: 0,
      baseColor: [1, 1, 1],
      markerColor: [0.72, 0.15, 0.12],
      glowColor: [0.94, 0.93, 0.9],
      markers: pontos.map((p) => ({ location: [p.lat, p.lng], size: 0.045 })),
      onRender: (estado) => {
        const foco = focoRef.current
        const reduzido = movimentoReduzidoRef.current
        // Com movimento reduzido: sem rotação automática e o foco muda sem animação.
        const suavizacao = reduzido ? 1 : SUAVIZACAO_FOCO
        if (foco) {
          phi += diferencaAngulo(phi, foco.phi) * suavizacao
          theta += (foco.theta - theta) * suavizacao
        } else {
          if (!reduzido) phi += VELOCIDADE_ROTACAO
          theta += (THETA_PADRAO - theta) * suavizacao
        }
        estado.phi = phi
        estado.theta = theta
        estado.width = tamanho * dpr
        estado.height = tamanho * dpr
        posicionarRotulos()
      },
    })

    // Pausa a renderização quando a aba vai para segundo plano.
    function aoMudarVisibilidade() {
      globo.toggle(!document.hidden)
    }
    document.addEventListener('visibilitychange', aoMudarVisibilidade)
    aoMudarVisibilidade()

    canvasRef.current.style.opacity = '1'
    return () => {
      document.removeEventListener('visibilitychange', aoMudarVisibilidade)
      globo.destroy()
    }
  }, [tamanho, pontos])

  return (
    <div className="globo" ref={containerRef}>
      <canvas
        ref={canvasRef}
        className="globo-canvas"
        style={{ width: tamanho, height: tamanho }}
        role="img"
        aria-label="Globo com as cidades que têm lojas de camisas vintage"
      />
      <ul className="globo-rotulos" aria-hidden="true">
        {pontos.map((ponto) => (
          <li
            key={ponto.id}
            ref={(el) => {
              if (el) rotulosRef.current.set(ponto.id, el)
              else rotulosRef.current.delete(ponto.id)
            }}
            className={[
              'rotulo',
              mostrarEscudo ? 'mostra-escudo' : '',
              cidadeEscolhida?.id === ponto.id ? 'destaque' : '',
            ].join(' ')}
          >
            <span className="rotulo-conteudo">
              <span className="rotulo-cidade">{ponto.cidade}</span>
              <span className="rotulo-escudo">
                <Escudo clube={ponto.clube} tamanho={28} decorativo />
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
