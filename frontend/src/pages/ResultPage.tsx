import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchResult } from '../api/client'
import type { TestResult } from '../types'
import RadarChart from '../components/RadarChart'
import ShareButton from '../components/ShareButton'
import { dogImages } from '../assets/dogImages'
import { catImages } from '../assets/catImages'
import styles from './ResultPage.module.css'

export default function ResultPage() {
  const { shareId } = useParams<{ shareId: string }>()
  const navigate = useNavigate()
  const [result, setResult] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const captureRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!shareId) { navigate('/'); return }
    fetchResult(shareId)
      .then((data) => { setResult(data); setLoading(false) })
      .catch(() => { setError('结果不存在。'); setLoading(false) })
  }, [shareId])

  if (loading) return (
    <div className={styles.center}>
      <div className="spinner" />
    </div>
  )

  if (error || !result) return (
    <div className={styles.center}>
      <p className={styles.errorText}>{error || '出错了。'}</p>
      <button className={styles.backBtn} onClick={() => navigate('/')}>← 去测试</button>
    </div>
  )

  const { type_code, pet_type, personality, scores } = result
  const isDog = pet_type === 'dog'
  const isPet = isDog ? 'dog' : 'cat'
  const petImg = isDog ? dogImages[type_code] : catImages[type_code]
  const dimensionSummary = scores ? [
    { label: '外向—内向', score: scores.ei },
    { label: '实感—直觉', score: scores.sn },
    { label: '思维—情感', score: scores.tf },
    { label: '判断—感知', score: scores.jp },
  ] : []

  return (
    <div className={`${styles.page} animate-fade-slide`}>
      <div ref={captureRef} className={styles.captureArea}>

      {petImg ? (
        /* ─── Card-style result with image (dog & cat) ─── */
        <>
          <div className={`${styles.resultCardWrapper} ${styles[`wrapper_${isPet}`]}`}>
            <div className={`${styles.resultCard} ${styles[`card_${isPet}`]}`}>
              <div className={styles.cardLabel}>
                {isDog ? '你的狗狗 · 狗格MBTI是：' : '你的猫咪 · 猫格类型是：'}
              </div>
              <div className={styles.cardTypeName}>{personality.name}</div>
              <div className={`${styles.cardTypeCode} ${styles[`typeCode_${isPet}`]}`}>{type_code}</div>
              <img src={petImg} alt={type_code} className={styles.cardImage} />
            </div>
            <div className={styles.cardTagline}>{personality.tagline}</div>
          </div>

          <div className={styles.resultInfoCard}>
            <div className={styles.infoLabel}>
              {isDog ? '你的主类型：' : '你的猫格：'}
            </div>
            <div className={styles.infoType}>
              {type_code}
              {personality.english_name && <span className={styles.infoEnglish}> · {personality.english_name}</span>}
              （{personality.name}）
            </div>
            {personality.common_breed && (
              <div className={styles.infoBreed}>常见犬种：{personality.common_breed}</div>
            )}
          </div>
        </>
      ) : (
        /* ─── Fallback header card ─── */
        <div className={`${styles.headerCard} ${styles[`theme_${isPet}`]}`}>
          <span className={styles.emoji}>{personality.emoji}</span>
          <div className={styles.typeCode}>{type_code}</div>
          <div className={styles.typeName}>{personality.name}</div>
          {personality.english_name && <div className={styles.tagline}>{personality.english_name}</div>}
          {personality.common_breed && <div className={styles.tagline}>常见犬种：{personality.common_breed}</div>}
          <div className={styles.tagline}>{personality.tagline}</div>
        </div>
      )}

      {personality.description && (
        <div className={styles.section}>
          {personality.description.split('\n\n').map((para, i) => (
            <p key={i} className={styles.descPara}>{para}</p>
          ))}
        </div>
      )}

      {(personality.strengths?.length || personality.weaknesses?.length) && (
        <div className={styles.swGrid}>
          <div className={styles.swCard}>
            <h3 className={styles.swTitle}>优势特质</h3>
            <ul className={styles.swList}>
              {(personality.strengths ?? []).map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>
          <div className={styles.swCard}>
            <h3 className={`${styles.swTitle} ${styles.weakTitle}`}>成长空间</h3>
            <ul className={styles.swList}>
              {(personality.weaknesses ?? []).map((w) => <li key={w}>{w}</li>)}
            </ul>
          </div>
        </div>
      )}

      {personality.life_tips && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>{isDog ? '生活注意事项' : '相处建议'}</h3>
          <p className={styles.descPara}>{personality.life_tips}</p>
        </div>
      )}

      {personality.training_tips && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>{isDog ? '驯服教育窍门' : '互动与训练'}</h3>
          <p className={styles.descPara}>{personality.training_tips}</p>
        </div>
      )}

      {scores && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>性格雷达图</h3>
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
      )}
      </div>{/* end captureArea */}

      <div className={styles.actions}>
        <ShareButton captureRef={captureRef} />
        <button className={styles.retakeBtn} onClick={() => navigate('/')}>
          再测一次
        </button>
      </div>
    </div>
  )
}
