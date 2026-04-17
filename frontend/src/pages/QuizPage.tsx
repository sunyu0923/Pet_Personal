import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchQuestions, submitAnswers } from '../api/client'
import { useQuizStore } from '../store/quizStore'
import type { PetType, Answer } from '../types'
import styles from './QuizPage.module.css'

export default function QuizPage() {
  const { petType } = useParams<{ petType: string }>()
  const navigate = useNavigate()
  const { questions, currentIndex, answers, setQuestions, setPetType, recordAnswer, advance, goBack } = useQuizStore()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!petType || (petType !== 'cat' && petType !== 'dog')) {
      navigate('/')
      return
    }
    setPetType(petType as PetType)
    fetchQuestions(petType as PetType)
      .then((data) => {
        setQuestions(data.questions)
        setLoading(false)
      })
      .catch(() => {
        setError('题目加载失败，请刷新重试。')
        setLoading(false)
      })
  }, [petType])

  const handleGoBack = () => {
    if (currentIndex > 0 && !submitting && !selectedAnswer) {
      goBack()
      setSelectedAnswer(null)
    }
  }

  const handleAnswer = async (answer: Answer) => {
    if (submitting || selectedAnswer) return
    const question = questions[currentIndex]
    setSelectedAnswer(answer)
    recordAnswer(question.id, answer)

    if (currentIndex === questions.length - 1) {
      setSubmitting(true)
      try {
        const allAnswers = { ...answers, [String(question.id)]: answer }
        const result = await submitAnswers(petType as PetType, allAnswers)
        navigate(`/result/${result.share_id}`)
      } catch {
        setError('出错了，请重试。')
        setSubmitting(false)
        setSelectedAnswer(null)
      }
    } else {
      setTimeout(() => {
        advance()
        setSelectedAnswer(null)
      }, 280)
    }
  }

  if (loading) return (
    <div className={styles.center}>
      <div className="spinner" />
      <p className={styles.loadingText}>加载题目中…</p>
    </div>
  )

  if (error) return (
    <div className={styles.center}>
      <p className={styles.errorText}>{error}</p>
      <button className={styles.retryBtn} onClick={() => navigate('/')}>← 返回</button>
    </div>
  )

  if (submitting) return (
    <div className={styles.center}>
      <div className={styles.analyzingWrap}>
        <div className={styles.analyzingDots}>
          <span /><span /><span />
        </div>
        <p className={styles.analyzingText}>正在分析性格类型…</p>
        <p className={styles.analyzingSubtext}>综合你的所有回答中</p>
      </div>
    </div>
  )

  const question = questions[currentIndex]
  const progress = Math.round(((currentIndex) / questions.length) * 100)
  const isPet = petType === 'cat' ? 'cat' : 'dog'

  return (
    <div className={`${styles.page} ${styles[`theme_${isPet}`]}`}>
      {/* background blobs */}
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      <div className={styles.header}>
        <div className={styles.progressWrap}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <span className={styles.progressPct}>{progress}%</span>
        </div>
        <div className={styles.meta}>
          <span className={styles.counter}>{petType === 'dog' ? '🐶 狗狗MBTI' : '🐱 猫咪性格'}</span>
          <span className={styles.counter}>{currentIndex + 1} / {questions.length}</span>
        </div>
      </div>

      <div key={currentIndex} className={`${styles.questionCard} animate-scale-in`}>
        <div className={styles.questionBadge}>第 {currentIndex + 1} 题</div>
        <p className={styles.questionText}>{question.text}</p>
      </div>

      <div className={styles.answers}>
        {question.options.map((option, idx) => {
          const ans = option.key as Answer
          const label = String.fromCharCode(65 + idx)
          return (
            <button
              key={ans}
              className={`${styles.answerBtn} ${selectedAnswer === ans ? styles.selected : ''}`}
              onClick={() => handleAnswer(ans)}
              disabled={!!selectedAnswer}
            >
              <span className={styles.answerLabel}>{label}</span>
              <span className={styles.answerText}>{option.text}</span>
              {selectedAnswer === ans && <span className={styles.checkmark}>✓</span>}
            </button>
          )
        })}
      </div>

      {currentIndex > 0 && (
        <button className={styles.prevBtn} onClick={handleGoBack} disabled={!!selectedAnswer}>
          ← 上一题
        </button>
      )}
    </div>
  )
}
