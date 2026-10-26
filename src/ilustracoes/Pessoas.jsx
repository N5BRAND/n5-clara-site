import { motion } from 'motion/react'

const TINTA = '#15181D'
const CREME = '#F5F4F0'
const DOURADO = '#E8A13C'
const caixa = { transformBox: 'fill-box', transformOrigin: 'center' }

function Olhos({ x1 = 50, x2 = 70, y = 58, cor = TINTA }) {
  return (
    <motion.g
      style={caixa}
      animate={{ scaleY: [1, 1, 0.1, 1] }}
      transition={{ duration: 4, times: [0, 0.92, 0.96, 1], repeat: Infinity, delay: Math.random() * 2 }}
    >
      <circle cx={x1} cy={y} r="2.8" fill={cor} />
      <circle cx={x2} cy={y} r="2.8" fill={cor} />
    </motion.g>
  )
}

function Boca({ fala }) {
  return fala ? (
    <motion.ellipse
      cx="60" cy="70" rx="6" fill={TINTA} style={caixa}
      animate={{ ry: [1.5, 4.5, 2, 4, 1.5] }}
      transition={{ duration: 0.9, repeat: Infinity }}
    />
  ) : (
    <path d="M52 68 Q60 75 68 68" stroke={TINTA} strokeWidth="3" fill="none" strokeLinecap="round" />
  )
}

const CABELOS = {
  curto: { cor: TINTA, d: 'M33 54 C 31 24, 89 24, 87 54 C 82 42, 70 36, 56 39 C 46 41, 38 46, 33 54 Z' },
  comprido: { cor: '#B4761A', d: 'M31 60 C 26 22, 94 22, 89 60 L 93 96 C 86 99, 81 93, 82 80 C 84 62, 77 42, 60 41 C 43 42, 36 62, 38 80 C 39 93, 34 99, 27 96 Z' },
  apanhado: { cor: TINTA, d: 'M34 52 C 32 26, 88 26, 86 52 C 78 40, 42 40, 34 52 Z M52 22 C 52 10, 68 10, 68 22 Z' },
}

/* pessoa de frente, em traço da marca; «acessorio»: telemovel, auscultadores ou nada */
export function Pessoa({ largura = 120, x, y, cor = DOURADO, cabelo = 'curto', acessorio, fala = false, toque = false }) {
  const c = CABELOS[cabelo]
  return (
    <svg viewBox="0 0 120 150" width={largura} height={(largura * 150) / 120} x={x} y={y} aria-hidden="true" overflow="visible">
      {cabelo === 'comprido' && <path d={c.d} fill={c.cor} />}
      <rect x="52" y="78" width="16" height="24" fill={CREME} stroke={TINTA} strokeWidth="4" />
      <path d="M12 150 C 12 110, 34 98, 60 98 C 86 98, 108 110, 108 150 Z" fill={cor} stroke={TINTA} strokeWidth="4" strokeLinejoin="round" />
      <path d="M50 99 L60 114 L70 99" stroke={TINTA} strokeWidth="3" fill="none" strokeLinejoin="round" />
      <circle cx="60" cy="56" r="27" fill={CREME} stroke={TINTA} strokeWidth="4" />
      {cabelo !== 'comprido' && <path d={c.d} fill={c.cor} />}
      {cabelo === 'comprido' && <path d="M35 52 C 36 30, 84 30, 85 52 C 76 40, 44 40, 35 52 Z" fill={c.cor} />}
      <Olhos />
      <Boca fala={fala} />

      {acessorio === 'auscultadores' && (
        <g>
          <path d="M31 56 C 29 18, 91 18, 89 56" stroke={TINTA} strokeWidth="6" fill="none" strokeLinecap="round" />
          <rect x="24" y="48" width="13" height="20" rx="6" fill={DOURADO} stroke={TINTA} strokeWidth="3" />
          <rect x="83" y="48" width="13" height="20" rx="6" fill={DOURADO} stroke={TINTA} strokeWidth="3" />
          <path d="M31 67 C 33 82, 44 86, 52 81" stroke={TINTA} strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="53" cy="80" r="3.5" fill={TINTA} />
        </g>
      )}

      {acessorio === 'telemovel' && (
        <g>
          <rect x="68" y="100" width="26" height="42" rx="6" fill={TINTA} />
          <rect x="72" y="105" width="18" height="30" rx="3" fill={DOURADO} opacity="0.85" />
          <circle cx="66" cy="126" r="7" fill={CREME} stroke={TINTA} strokeWidth="3" />
          <circle cx="96" cy="124" r="7" fill={CREME} stroke={TINTA} strokeWidth="3" />
          {toque && (
            <motion.circle
              cx="81" cy="118" r="4" fill="none" stroke={CREME} strokeWidth="2.5" style={caixa}
              animate={{ scale: [0.4, 2.4], opacity: [1, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.4 }}
            />
          )}
        </g>
      )}
    </svg>
  )
}

/* o agente de IA: cabeça de ecrã, antena dourada, olhos que piscam e boca que fala */
export function Agente({ largura = 110, fala = false }) {
  return (
    <svg viewBox="0 0 120 150" width={largura} height={(largura * 150) / 120} aria-hidden="true" overflow="visible">
      <line x1="60" y1="12" x2="60" y2="30" stroke={TINTA} strokeWidth="4" />
      <motion.circle
        cx="60" cy="10" r="7" fill={DOURADO} stroke={TINTA} strokeWidth="3" style={caixa}
        animate={{ scale: fala ? [1, 1.35, 1] : 1 }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
      <path d="M14 150 C 14 112, 34 100, 60 100 C 86 100, 106 112, 106 150 Z" fill={DOURADO} stroke={TINTA} strokeWidth="4" />
      <text x="60" y="134" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="16" fill={TINTA}>IA</text>
      <rect x="22" y="28" width="76" height="66" rx="22" fill={TINTA} />
      <rect x="31" y="38" width="58" height="44" rx="14" fill="#2A2E36" />
      <motion.g
        style={caixa}
        animate={{ scaleY: [1, 1, 0.1, 1] }}
        transition={{ duration: 3.2, times: [0, 0.9, 0.95, 1], repeat: Infinity }}
      >
        <rect x="44" y="50" width="8" height="12" rx="4" fill={DOURADO} />
        <rect x="68" y="50" width="8" height="12" rx="4" fill={DOURADO} />
      </motion.g>
      <motion.rect
        x="52" y="69" height="4" rx="2" fill={DOURADO}
        animate={fala ? { width: [8, 16, 6, 14, 8], x: [56, 52, 57, 53, 56] } : { width: 8, x: 56 }}
        transition={{ duration: 0.7, repeat: fala ? Infinity : 0 }}
      />
    </svg>
  )
}

/* duas pessoas sentadas à mesma mesa */
export function Mesa({ esquerda, direita, quemFala }) {
  return (
    <svg viewBox="0 0 520 250" className="mesa-svg" role="img" aria-label={`${esquerda.nome} e ${direita.nome} à mesa`}>
      <Pessoa x={70} y={36} largura={124} cor={esquerda.cor} cabelo={esquerda.cabelo} fala={quemFala === 'esquerda'} />
      <Pessoa x={326} y={36} largura={124} cor={direita.cor} cabelo={direita.cabelo} fala={quemFala === 'direita'} />
      <rect x="18" y="182" width="484" height="24" rx="10" fill={TINTA} />
      <rect x="60" y="204" width="14" height="46" fill={TINTA} />
      <rect x="446" y="204" width="14" height="46" fill={TINTA} />
      <g transform="translate(222 150) rotate(-6)">
        <rect width="76" height="36" rx="4" fill={CREME} stroke={TINTA} strokeWidth="3" />
        <path d="M10 12 H58 M10 20 H50 M10 28 H40" stroke={TINTA} strokeWidth="2.5" strokeLinecap="round" />
      </g>
      <g fill={CREME} stroke={TINTA} strokeWidth="3">
        <path d="M176 160 h22 v18 a8 8 0 0 1 -8 8 h-6 a8 8 0 0 1 -8 -8 Z" />
        <path d="M330 160 h22 v18 a8 8 0 0 1 -8 8 h-6 a8 8 0 0 1 -8 -8 Z" />
      </g>
    </svg>
  )
}
