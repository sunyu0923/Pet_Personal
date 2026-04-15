import { useNavigate } from 'react-router-dom'
import { useQuizStore } from '../store/quizStore'
import type { PetType } from '../types'
import styles from './LandingPage.module.css'

const pets: { type: PetType; emoji: string; label: string; tagline: string; theme: string }[] = [
  { type: 'cat', emoji: '🐱', label: '猫咪', tagline: '12道题 · 解读猫咪的神秘灵魂', theme: 'cat' },
  { type: 'dog', emoji: '🐶', label: '狗狗', tagline: '16道题 · 真实情景版搞笑MBTI', theme: 'dog' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const { setPetType, reset } = useQuizStore()

  const handleSelect = (type: PetType) => {
    reset()
    setPetType(type)
    navigate(`/quiz/${type}`)
  }

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.title}>PETI</h1>
        <p className={styles.subtitle}>探索你的猫咪或狗狗属于哪种性格类型——也许那其实是你自己。</p>
      </div>

      <div className={styles.cards}>
        {pets.map((pet) => (
          <button
            key={pet.type}
            className={`${styles.card} ${styles[`card_${pet.theme}`]}`}
            onClick={() => handleSelect(pet.type)}
          >
            <span className={styles.petEmoji}>{pet.emoji}</span>
            <span className={styles.petLabel}>{pet.label}</span>
            <span className={styles.petTagline}>{pet.tagline}</span>
            <span className={styles.startBtn}>开始测试 →</span>
          </button>
        ))}
      </div>

      <p className={styles.footer}>16种性格类型 · 可分享结果 · 约3分钟</p>
    </div>
  )
}
