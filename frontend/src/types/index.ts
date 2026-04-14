export interface Question {
  id: number
  dimension: string
  order_num: number
  text: string
  option_a: string
  option_b: string
}

export interface QuestionsResponse {
  pet_type: string
  questions: Question[]
}

export interface PersonalityType {
  name: string
  tagline: string
  description: string
  strengths: string[]
  weaknesses: string[]
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
  mbti_code: string
  personality: PersonalityType
  scores: ResultScores
}

export type PetType = 'cat' | 'dog'
export type Answer = 'a' | 'b'
