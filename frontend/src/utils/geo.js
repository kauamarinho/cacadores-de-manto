// Projeção usada pelo shader do COBE 0.6.3.
// Replica a matemática do shader para posicionar elementos HTML (rótulos)
// exatamente em cima dos marcadores desenhados no globo.

const { PI, sin, cos, atan2 } = Math

// Raio do globo no espaço do shader (o COBE desenha a esfera onde dot(b, b) <= 0.64).
const RAIO = 0.8

// Converte latitude/longitude para o ponto 3D que o COBE usa nos marcadores.
export function latLngPara3D(lat, lng) {
  const la = (lat * PI) / 180
  const lo = (lng * PI) / 180 - PI
  const c = cos(la)
  return [-c * cos(lo), sin(la), c * sin(lo)]
}

// Aplica a mesma rotação do shader: mat3 L(theta, phi).
// O shader faz mundo = vista * L, então vista = L * mundo.
function rotacionar([x, y, z], phi, theta) {
  const ct = cos(theta)
  const cp = cos(phi)
  const st = sin(theta)
  const sp = sin(phi)
  return [
    cp * x + sp * z,
    sp * st * x + ct * y - cp * st * z,
    -sp * ct * x + st * y + cp * ct * z,
  ]
}

// Projeta lat/lng na tela.
// Retorna { x, y } em pixels (origem no canto superior esquerdo do canvas),
// a profundidade z (1 = de frente, 0 = na borda, negativo = atrás) e se está visível.
export function projetar(lat, lng, phi, theta, largura, altura, escala = 1) {
  const [vx, vy, vz] = rotacionar(latLngPara3D(lat, lng), phi, theta)
  const bx = vx * RAIO
  const by = vy * RAIO
  // Inverso de: b = (frag / res * 2 - 1) / escala; b.x *= largura / altura
  const ux = (bx * altura) / largura * escala
  const uy = by * escala
  return {
    x: (largura / 2) * (1 + ux),
    y: (altura / 2) * (1 - uy),
    z: vz,
    visivel: vz > 0,
  }
}

// Ângulos (phi, theta) que deixam a coordenada de frente para a câmera.
export function anguloPara(lat, lng) {
  const [x, , z] = latLngPara3D(lat, lng)
  return {
    phi: atan2(-x, z),
    theta: (lat * PI) / 180,
  }
}

// Menor diferença entre dois ângulos, no intervalo (-PI, PI].
export function diferencaAngulo(de, para) {
  const d = (para - de) % (2 * PI)
  if (d > PI) return d - 2 * PI
  if (d <= -PI) return d + 2 * PI
  return d
}
