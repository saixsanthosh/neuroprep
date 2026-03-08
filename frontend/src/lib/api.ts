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

export type GoalType =
  | 'school_learning'
  | 'college_courses'
  | 'competitive_exams'
  | 'language_learning'
  | 'skill_learning'
  | 'general_knowledge'

export type LearningProfile = {
  user_id: string
  goal_type: GoalType
  exam_name?: string | null
  school_grade?: number | null
  degree_type?: string | null
  major_subject?: string | null
  subjects: string[]
  language?: string | null
  skill_track?: string | null
  skill_level?: 'beginner' | 'intermediate' | 'advanced' | null
  study_hours: number
  onboarding_completed: boolean
  focus_modules: string[]
  preferences: Record<string, unknown>
  created_at?: string
  updated_at?: string
}

export type OnboardingOption = {
  value: string
  label: string
  description: string
}

export type OnboardingOptionsResponse = {
  goals: OnboardingOption[]
  competitive_exams: string[]
  school_subjects: string[]
  college_majors: string[]
  skill_tracks: string[]
  languages: string[]
  skill_levels: string[]
}

export type DashboardModule = {
  id: string
  title: string
  description: string
  route: string
  accent: string
  category: string
}

export type LearningDashboardResponse = {
  profile: LearningProfile
  hero_title: string
  hero_subtitle: string
  focus_tracks: string[]
  modules: DashboardModule[]
}

export type LearningResource = {
  source: string
  title: string
  description: string
  url: string
  category: string
}

export type LearningResourcesResult = {
  query: string
  source_strategy: string
  resources: LearningResource[]
  generated_notes?: string | null
}

export type CompanionSkillNode = {
  label: string
  mastery: number
  momentum: string
}

export type CompanionBriefResponse = {
  greeting: string
  mentor_message: string
  strategy_tip: string
  mistake_pattern: string
  readiness_score: number
  motivation_message: string
  next_focus: string
  daily_brief: string[]
  smart_suggestions: string[]
  revision_alerts: string[]
  roadmap: string[]
  skill_progress_map: CompanionSkillNode[]
  voice_tools: Record<string, boolean>
}

export type LanguageLesson = {
  id: string
  lesson_type: string
  title: string
  description: string
  duration_minutes: number
  difficulty: string
}

export type LanguagePathResponse = {
  language: string
  skill_level: string
  speech_stack: Record<string, boolean>
  lessons: LanguageLesson[]
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

export async function getOnboardingOptions(): Promise<OnboardingOptionsResponse> {
  const { data } = await api.get<OnboardingOptionsResponse>('/learning/options')
  return data
}

export async function getLearningProfile(): Promise<LearningProfile> {
  const { data } = await api.get<LearningProfile>('/learning/profile')
  return data
}

export async function saveLearningProfile(payload: {
  goal_type: GoalType
  exam_name?: string | null
  school_grade?: number | null
  degree_type?: string | null
  major_subject?: string | null
  subjects: string[]
  language?: string | null
  skill_track?: string | null
  skill_level?: 'beginner' | 'intermediate' | 'advanced' | null
  study_hours: number
  preferences?: Record<string, unknown>
}): Promise<LearningProfile> {
  const { data } = await api.put<LearningProfile>('/learning/profile', payload)
  return data
}

export async function getLearningDashboard(): Promise<LearningDashboardResponse> {
  const { data } = await api.get<LearningDashboardResponse>('/learning/dashboard')
  return data
}

export async function getLearningResources(topic?: string): Promise<LearningResourcesResult> {
  const { data } = await api.get<LearningResourcesResult>('/learning/resources', {
    params: topic ? { topic } : undefined,
  })
  return data
}

export async function getLanguagePath(): Promise<LanguagePathResponse> {
  const { data } = await api.get<LanguagePathResponse>('/learning/language-path')
  return data
}

export async function getCompanionDailyBrief(): Promise<CompanionBriefResponse> {
  const { data } = await api.get<CompanionBriefResponse>('/companion/daily-brief')
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
