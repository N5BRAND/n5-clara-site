import { motion, useTransform } from 'motion/react'

/* a faixa do dia: o céu muda de cor, o sol faz o arco e as horas passam; um marcador por momento do dia */
const PREDIOS = [
  [0, 46, 40], [5, 30, 62], [10, 52, 34], [16, 38, 70], [23, 60, 44], [29, 34, 58], [35, 48, 38],
  [41, 64, 50], [48, 40, 76], [54, 56, 42], [60, 36, 66], [66, 50, 46], [72, 42, 72], [78, 58, 40],
  [84, 38, 60], [90, 52, 48], [96, 44, 56],
]

export default function Ceu({ progresso, cenas, indice }) {
  const fundo = useTransform(progresso, [0, 0.3, 0.6, 0.85, 1], ['#F3E2C2', '#F5F4F0', '#F5F4F0', '#EBB86E', '#1F232B'])
  const solX = useTransform(progresso, [0, 1], ['4%', '96%'])
  const solY = useTransform(progresso, v => `${18 + Math.pow((v - 0.5) * 2, 2) * 46}%`)
  const solCor = useTransform(progresso, [0, 0.8, 0.92], ['#E8A13C', '#E8A13C', '#F5F4F0'])
  const janelas = useTransform(progresso, [0.75, 0.95], [0, 1])

  return (
    <motion.div className="ceu" style={{ background: fundo }} aria-hidden="true">
      <motion.span className="ceu-sol" style={{ left: solX, top: solY, background: solCor }} />
      <svg className="ceu-cidade" viewBox="0 0 100 80" preserveAspectRatio="none">
        {PREDIOS.map(([x, w, h], i) => (
          <rect key={i} x={x} y={80 - h} width={w / 8} height={h} fill="#15181D" />
        ))}
      </svg>
      <motion.svg className="ceu-cidade ceu-janelas" viewBox="0 0 100 80" preserveAspectRatio="none" style={{ opacity: janelas }}>
        {PREDIOS.map(([x, w, h], i) => (
          <rect key={i} x={x + w / 32} y={80 - h + 8} width={w / 24} height={4} fill="#E8A13C" />
        ))}
      </motion.svg>
      <div className="ceu-chao">
        {cenas.map((c, i) => (
          <span
            key={c.id}
            className={`ceu-marca ${i === indice ? 'ceu-marca--ativa' : ''} ${i < indice ? 'ceu-marca--feita' : ''}`}
            style={{ left: `${((i + 0.5) / cenas.length) * 100}%` }}
          >
            <b>{c.hora}</b>
            <span>{c.curto}</span>
          </span>
        ))}
      </div>
    </motion.div>
  )
}
