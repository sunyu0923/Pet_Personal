import {
  RadarChart as ReRadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { ResultScores } from '../../types'

interface Props {
  scores: ResultScores
  petType: string
}

const LABELS = {
  ei: { pos: 'E', neg: 'I', full: 'Extrovert — Introvert' },
  sn: { pos: 'S', neg: 'N', full: 'Sensing — iNtuition' },
  tf: { pos: 'T', neg: 'F', full: 'Thinking — Feeling' },
  jp: { pos: 'J', neg: 'P', full: 'Judging — Perceiving' },
}

export default function RadarChart({ scores, petType }: Props) {
  const data = [
    { axis: `${LABELS.ei.pos} — ${LABELS.ei.neg}`, value: scores.ei.pct },
    { axis: `${LABELS.sn.pos} — ${LABELS.sn.neg}`, value: scores.sn.pct },
    { axis: `${LABELS.tf.pos} — ${LABELS.tf.neg}`, value: scores.tf.pct },
    { axis: `${LABELS.jp.pos} — ${LABELS.jp.neg}`, value: scores.jp.pct },
  ]

  const fillColor = petType === 'cat' ? '#a855f7' : '#f97316'
  const strokeColor = petType === 'cat' ? '#e879f9' : '#fbbf24'

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ReRadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
        <PolarGrid stroke="rgba(255,255,255,0.1)" />
        <PolarAngleAxis
          dataKey="axis"
          tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600 }}
        />
        <Radar
          dataKey="value"
          stroke={strokeColor}
          fill={fillColor}
          fillOpacity={0.35}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{
            background: '#1e1e2e',
            border: `1px solid ${strokeColor}`,
            borderRadius: 8,
            color: 'white',
            fontSize: 13,
          }}
          formatter={(value: number) => [`${value}%`, 'Score']}
        />
      </ReRadarChart>
    </ResponsiveContainer>
  )
}
