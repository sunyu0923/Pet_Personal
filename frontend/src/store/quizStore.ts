import { create } from 'zustand'
import type { Question, PetType, Answer } from '../types'

interface QuizStore {
  petType: PetType | null
  questions: Question[]
  answers: Record<string, Answer>
  currentIndex: number

  setPetType: (petType: PetType) => void
  setQuestions: (questions: Question[]) => void
  recordAnswer: (questionId: number, answer: Answer) => void
  advance: () => void
  goBack: () => void
  reset: () => void
}

export const useQuizStore = create<QuizStore>((set) => ({
  petType: null,
  questions: [],
  answers: {},
  currentIndex: 0,

  setPetType: (petType) => set({ petType }),
  setQuestions: (questions) => set({ questions, currentIndex: 0, answers: {} }),
  recordAnswer: (questionId, answer) =>
    set((s) => ({ answers: { ...s.answers, [String(questionId)]: answer } })),
  advance: () => set((s) => ({ currentIndex: s.currentIndex + 1 })),
  goBack: () => set((s) => {
    if (s.currentIndex <= 0) return s
    const prevQuestion = s.questions[s.currentIndex - 1]
    const newAnswers = { ...s.answers }
    delete newAnswers[String(prevQuestion.id)]
    return { currentIndex: s.currentIndex - 1, answers: newAnswers }
  }),
  reset: () => set({ petType: null, questions: [], answers: {}, currentIndex: 0 }),
}))
