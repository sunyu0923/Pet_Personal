import { useNavigate } from 'react-router-dom'
import { useQuizStore } from '../store/quizStore'
import type { PetType } from '../types'
import styles from './LandingPage.module.css'

const pets: { type: PetType; emoji: string; label: string; tagline: string; theme: string }[] = [
  { type: 'cat', emoji: '🐱', label: 'Cat', tagline: '12 questions. Ancient feline wisdom.', theme: 'cat' },
  { type: 'dog', emoji: '🐶', label: 'Dog', tagline: '12 questions. Eternal canine joy.', theme: 'dog' },
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
        <p className={styles.subtitle}>Discover which personality type your pet truly is — or which type <em>you</em> are.</p>
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
            <span className={styles.startBtn}>Start Test →</span>
          </button>
        ))}
      </div>

      <p className={styles.footer}>16 personality types · Shareable results · 3 minutes</p>
    </div>
  )
}
