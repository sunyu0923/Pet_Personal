export interface QuestionOption {
  key: string
  text: string
}

export interface Question {
  id: number
  order_num: number
  text: string
  options: QuestionOption[]
}

export interface QuestionsResponse {
  pet_type: string
  questions: Question[]
}

export interface PersonalityType {
  name: string
  english_name?: string | null
  common_breed?: string | null
  tagline: string
  description?: string | null
  strengths?: string[] | null
  weaknesses?: string[] | null
  life_tips?: string | null
  training_tips?: string | null
  emoji: string
}

export interface DimensionScore {
  value: number
  pct: number
  dominant: string
}

export interface ResultScores {
  ei: DimensionScore
  sn: DimensionScore
  tf: DimensionScore
  jp: DimensionScore
}

export interface TestResult {
  share_id: string
  pet_type: string
  type_code: string
  personality: PersonalityType
  scores?: ResultScores | null
  type_scores?: Record<string, number> | null
}

export type PetType = 'cat' | 'dog'
export type Answer = 'a' | 'b' | 'c' | 'd'
