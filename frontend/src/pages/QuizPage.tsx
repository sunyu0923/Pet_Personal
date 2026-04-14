import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchQuestions, submitAnswers } from '../api/client'
import { useQuizStore } from '../store/quizStore'
import type { PetType, Answer } from '../types'
import styles from './QuizPage.module.css'

const DIMENSION_LABELS: Record<string, string> = {
  'E/I': '社交能量',
  'S/N': '感知方式',
  'T/F': '决策风格',
  'J/P': '生活节奏',
}

export default function QuizPage() {
  const { petType } = useParams<{ petType: string }>()
  const navigate = useNavigate()
  const { questions, currentIndex, answers, setQuestions, setPetType, recordAnswer, advance } = useQuizStore()
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
      <div className="spinner" />
      <p style={{ marginTop: 16, color: 'var(--text-muted)' }}>正在分析你的性格类型……</p>
    </div>
  )

  const question = questions[currentIndex]
  const progress = Math.round(((currentIndex) / questions.length) * 100)
  const isPet = petType === 'cat' ? 'cat' : 'dog'

  return (
    <div className={`${styles.page} ${styles[`theme_${isPet}`]}`}>
      <div className={styles.header}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.meta}>
          <span className={styles.dimensionPill}>{DIMENSION_LABELS[question.dimension]}</span>
          <span className={styles.counter}>{currentIndex + 1} / {questions.length}</span>
        </div>
      </div>

      <div key={currentIndex} className={`${styles.questionCard} animate-scale-in`}>
        <p className={styles.questionText}>{question.text}</p>
      </div>

      <div className={styles.answers}>
        {(['a', 'b'] as Answer[]).map((ans) => {
          const text = ans === 'a' ? question.option_a : question.option_b
          return (
            <button
              key={ans}
              className={`${styles.answerBtn} ${selectedAnswer === ans ? styles.selected : ''}`}
              onClick={() => handleAnswer(ans)}
              disabled={!!selectedAnswer}
            >
              {text}
            </button>
          )
        })}
      </div>
    </div>
  )
}
