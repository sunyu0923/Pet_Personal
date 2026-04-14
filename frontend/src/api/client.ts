import axios from 'axios'
import type { QuestionsResponse, TestResult, PetType } from '../types'

const api = axios.create({ baseURL: '/api' })

export const fetchQuestions = async (petType: PetType): Promise<QuestionsResponse> => {
  const { data } = await api.get<QuestionsResponse>(`/questions/${petType}`)
  return data
}

export const submitAnswers = async (
  petType: PetType,
  answers: Record<string, string>
): Promise<TestResult> => {
  const { data } = await api.post<TestResult>('/results', { pet_type: petType, answers })
  return data
}

export const fetchResult = async (shareId: string): Promise<TestResult> => {
  const { data } = await api.get<TestResult>(`/results/${shareId}`)
  return data
}
