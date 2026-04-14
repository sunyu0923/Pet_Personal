import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchResult } from '../api/client'
import type { TestResult } from '../types'
import RadarChart from '../components/RadarChart'
import ShareButton from '../components/ShareButton'
import styles from './ResultPage.module.css'

export default function ResultPage() {
  const { shareId } = useParams<{ shareId: string }>()
  const navigate = useNavigate()
  const [result, setResult] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!shareId) { navigate('/'); return }
    fetchResult(shareId)
      .then((data) => { setResult(data); setLoading(false) })
      .catch(() => { setError('Result not found.'); setLoading(false) })
  }, [shareId])

  if (loading) return (
    <div className={styles.center}>
      <div className="spinner" />
    </div>
  )

  if (error || !result) return (
    <div className={styles.center}>
      <p className={styles.errorText}>{error || 'Something went wrong.'}</p>
      <button className={styles.backBtn} onClick={() => navigate('/')}>← Try the test</button>
    </div>
  )

  const { mbti_code, pet_type, personality, scores } = result
  const isPet = pet_type === 'cat' ? 'cat' : 'dog'

  const dimensionSummary = [
    { label: 'E — I', score: scores.ei },
    { label: 'S — N', score: scores.sn },
    { label: 'T — F', score: scores.tf },
    { label: 'J — P', score: scores.jp },
  ]

  return (
    <div className={`${styles.page} animate-fade-slide`}>
      {/* Header card */}
      <div className={`${styles.headerCard} ${styles[`theme_${isPet}`]}`}>
        <span className={styles.emoji}>{personality.emoji}</span>
        <div className={styles.typeCode}>{mbti_code}</div>
        <div className={styles.typeName}>{personality.name}</div>
        <div className={styles.tagline}>{personality.tagline}</div>
      </div>

      {/* Description */}
      <div className={styles.section}>
        {personality.description.split('\n\n').map((para, i) => (
          <p key={i} className={styles.descPara}>{para}</p>
        ))}
      </div>

      {/* Strengths & Weaknesses */}
      <div className={styles.swGrid}>
        <div className={styles.swCard}>
          <h3 className={styles.swTitle}>Strengths</h3>
          <ul className={styles.swList}>
            {personality.strengths.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>
        <div className={styles.swCard}>
          <h3 className={`${styles.swTitle} ${styles.weakTitle}`}>Weaknesses</h3>
          <ul className={styles.swList}>
            {personality.weaknesses.map((w) => <li key={w}>{w}</li>)}
          </ul>
        </div>
      </div>

      {/* Radar Chart */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Your Personality Map</h3>
        <RadarChart scores={scores} petType={pet_type} />
        <div className={styles.dimensionBars}>
          {dimensionSummary.map(({ label, score }) => (
            <div key={label} className={styles.dimRow}>
              <span className={styles.dimLabel}>{label}</span>
              <div className={styles.dimBarTrack}>
                <div
                  className={`${styles.dimBar} ${styles[`dimBar_${isPet}`]}`}
                  style={{ width: `${score.pct}%` }}
                />
                <div className={styles.midLine} />
              </div>
              <span className={styles.dimDominant}>{score.dominant}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <ShareButton />
        <button className={styles.retakeBtn} onClick={() => navigate('/')}>
          Take another test
        </button>
      </div>
    </div>
  )
}
