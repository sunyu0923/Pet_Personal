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

export default function RadarChart({ scores, petType }: Props) {
  const data = [
    { axis: '外向 — 内向', value: scores.ei.pct },
    { axis: '实感 — 直觉', value: scores.sn.pct },
    { axis: '思维 — 情感', value: scores.tf.pct },
    { axis: '判断 — 感知', value: scores.jp.pct },
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
          formatter={(value: number) => [`${value}%`, '得分']}
        />
      </ReRadarChart>
    </ResponsiveContainer>
  )
}
