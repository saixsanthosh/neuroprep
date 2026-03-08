/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { User } from '../lib/api'
import * as api from '../lib/api'

type AuthContextValue = {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (identifier: string, password: string) => Promise<void>
  register: (payload: {
    name: string
    email: string
    username: string
    password: string
  }) => Promise<void>
  googleAuth: () => Promise<'authenticated' | 'redirected'>
  completeGoogleAuth: (payload: {
    code?: string
    access_token?: string
    redirect_to: string
  }) => Promise<void>
  updateProfile: (payload: { name?: string; username?: string }) => Promise<void>
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
    async (payload: {
      name: string
      email: string
      username: string
      password: string
    }) => {
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

  const googleAuth = useCallback(async () => {
    setIsLoading(true)
    try {
      const redirect_to = `${window.location.origin}/auth/callback`
      const res = await api.startGoogleAuth(redirect_to)
      if ('oauth_url' in res) {
        window.location.href = res.oauth_url
        return 'redirected' as const
      }
      localStorage.setItem(TOKEN_KEY, res.token.access_token)
      localStorage.setItem(USER_KEY, JSON.stringify(res.user))
      setToken(res.token.access_token)
      setUser(res.user)
      return 'authenticated' as const
    } finally {
      setIsLoading(false)
    }
  }, [])

  const completeGoogleAuth = useCallback(
    async (payload: {
      code?: string
      access_token?: string
      redirect_to: string
    }) => {
      setIsLoading(true)
      try {
        const res = await api.exchangeGoogleAuth(payload)
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

  const updateProfile = useCallback(async (payload: { name?: string; username?: string }) => {
    setIsLoading(true)
    try {
      const nextUser = await api.updateProfile(payload)
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
      setUser(nextUser)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      login,
      register,
      googleAuth,
      completeGoogleAuth,
      updateProfile,
      logout,
      isAuthenticated: !!token && !!user,
    }),
    [user, token, isLoading, login, register, googleAuth, completeGoogleAuth, updateProfile, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
