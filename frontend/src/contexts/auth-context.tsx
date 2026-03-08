/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { User } from '../lib/api'
import * as api from '../lib/api'

type AuthContextValue = {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (identifier: string, password: string) => Promise<void>
  register: (payload: { name: string; email: string; username: string; password: string }) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

const TOKEN_KEY = 'neuroprep_token'
const USER_KEY = 'neuroprep_user'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(USER_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [isLoading, setIsLoading] = useState(false)

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  useEffect(() => {
    const onLogout = () => logout()
    window.addEventListener('neuroprep_logout', onLogout)
    return () => window.removeEventListener('neuroprep_logout', onLogout)
  }, [logout])

  const login = useCallback(async (identifier: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await api.login(identifier, password)
      localStorage.setItem(TOKEN_KEY, res.token.access_token)
      localStorage.setItem(USER_KEY, JSON.stringify(res.user))
      setToken(res.token.access_token)
      setUser(res.user)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(
    async (payload: { name: string; email: string; username: string; password: string }) => {
      setIsLoading(true)
      try {
        const res = await api.register(payload)
        localStorage.setItem(TOKEN_KEY, res.token.access_token)
        localStorage.setItem(USER_KEY, JSON.stringify(res.user))
        setToken(res.token.access_token)
        setUser(res.user)
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      login,
      register,
      logout,
      isAuthenticated: !!token && !!user,
    }),
    [user, token, isLoading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
