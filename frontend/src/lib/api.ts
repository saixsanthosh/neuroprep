import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('neuroprep_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res: AxiosResponse) => res,
  (err: AxiosError) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('neuroprep_token')
      localStorage.removeItem('neuroprep_user')
      window.dispatchEvent(new Event('neuroprep_logout'))
    }
    return Promise.reject(err)
  },
)

export type User = {
  id: string
  name: string
  email: string
  username: string
  created_at?: string
  last_login?: string
}

export type AuthResponse = {
  user: User
  token: { access_token: string; token_type: string; expires_in: number }
  message: string
}

export type OAuthResponse = {
  oauth_url: string
  message: string
}

export type MessageResponse = {
  message: string
}

export type WeeklyReportResponse = {
  summary: string
  generated_at: string
  focus_subjects: string[]
}

export type MockSessionResponse = {
  session_id: string
  exam_type: string
  total_questions: number
  duration_minutes: number
  message: string
}

export type MockSubmitPayload = {
  exam_type: string
  score: number
  rank: number
  time_taken: number
  total_questions: number
  correct_answers: number
}

export type MockResult = {
  id: string
  user_id: string
  exam_type: string
  score: number
  rank: number
  time_taken: number
  accuracy: number
  created_at: string
}

export async function login(identifier: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', { identifier, password })
  return data
}

export async function register(payload: {
  name: string
  email: string
  username: string
  password: string
}): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', payload)
  return data
}

export async function startGoogleAuth(redirect_to: string): Promise<AuthResponse | OAuthResponse> {
  const { data } = await api.post<AuthResponse | OAuthResponse>('/auth/google', { redirect_to })
  return data
}

export async function exchangeGoogleAuth(payload: {
  code?: string
  access_token?: string
  redirect_to: string
}): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/google/exchange', payload)
  return data
}

export async function updateProfile(payload: { name?: string; username?: string }): Promise<User> {
  const { data } = await api.put<User>('/auth/profile', payload)
  return data
}

export async function requestPasswordReset(email: string, redirect_to: string): Promise<MessageResponse> {
  const { data } = await api.post<MessageResponse>('/auth/password-reset', { email, redirect_to })
  return data
}

export async function getWeeklyReport(): Promise<WeeklyReportResponse> {
  const { data } = await api.get<WeeklyReportResponse>('/analytics/weekly-report')
  return data
}

export async function startMockSession(payload: {
  exam_type: string
  total_questions: number
  duration_minutes: number
}): Promise<MockSessionResponse> {
  const { data } = await api.post<MockSessionResponse>('/mock/start', payload)
  return data
}

export async function submitMockSession(payload: MockSubmitPayload): Promise<MockResult> {
  const { data } = await api.post<MockResult>('/mock/submit', payload)
  return data
}

export async function getMockResults(limit = 5): Promise<MockResult[]> {
  const { data } = await api.get<MockResult[]>(`/mock/results?limit=${limit}`)
  return data
}
