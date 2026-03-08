import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../contexts/auth-context'

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const { completeGoogleAuth } = useAuth()
  const [message, setMessage] = useState('Completing Google sign-in...')

  useEffect(() => {
    const finishAuth = async () => {
      const currentUrl = new URL(window.location.href)
      const hashParams = new URLSearchParams(currentUrl.hash.startsWith('#') ? currentUrl.hash.slice(1) : '')

      const code = currentUrl.searchParams.get('code') ?? undefined
      const access_token =
        hashParams.get('access_token') ?? currentUrl.searchParams.get('access_token') ?? undefined
      const error =
        currentUrl.searchParams.get('error_description') ??
        hashParams.get('error_description') ??
        currentUrl.searchParams.get('error') ??
        hashParams.get('error')

      if (error) {
        setMessage(error)
        return
      }

      if (!code && !access_token) {
        setMessage('No Google auth payload was returned.')
        return
      }

      try {
        await completeGoogleAuth({
          code,
          access_token,
          redirect_to: `${window.location.origin}/auth/callback`,
        })
        navigate('/dashboard', { replace: true })
      } catch (err: unknown) {
        const apiError =
          err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { data?: { detail?: string } } })
            : null
        setMessage(apiError?.response?.data?.detail || 'Unable to complete Google sign-in.')
      }
    }

    void finishAuth()
  }, [completeGoogleAuth, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero-gradient px-6">
      <div className="glass-panel max-w-md rounded-[2rem] p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
          <Loader2 className="h-6 w-6 animate-spin text-cyan-300" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-white">Google authentication</h1>
        <p className="mt-3 text-sm leading-7 text-slate-300">{message}</p>
      </div>
    </div>
  )
}
