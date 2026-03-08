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
  role: string
  created_at?: string
  last_login?: string
}

export type AuthResponse = {
  user: User
  token: { access_token: string; token_type: string; expires_in: number }
  message: string
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
  role?: 'student' | 'teacher' | 'admin'
}): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', { ...payload, role: payload.role || 'student' })
  return data
}
