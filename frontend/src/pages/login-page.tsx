import { motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  Loader2,
  Lock,
  Mail,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../contexts/auth-context'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { ThemeToggle } from '../components/ui/theme-toggle'

const highlights = [
  'Adaptive planner with AI-built revision lanes',
  'Mock exam cockpit with animated analytics',
  'Tutor workspace with follow-up chat threads',
]

export function LoginPage() {
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/dashboard'

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!identifier.trim() || !password) {
      setError('Enter your email or username and password.')
      return
    }

    try {
      await login(identifier.trim(), password)
      navigate(redirectTo, { replace: true })
    } catch (err: unknown) {
      const axiosError =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { detail?: string } } })
          : null

      const detail = axiosError?.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Login failed. Please try again.')
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-hero-gradient">
      <div className="premium-grid absolute inset-0 opacity-20" />
      <motion.div
        className="pointer-events-none absolute -left-12 top-16 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl"
        animate={{ y: [0, -12, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-8 right-12 h-72 w-72 rounded-full bg-violet-500/12 blur-3xl"
        animate={{ y: [0, 16, 0], x: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      <header className="relative z-20 border-b border-white/10 bg-[#050913]/70 backdrop-blur-xl">
        <div className="section-wrap flex h-18 items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(56,189,248,0.95),rgba(124,58,237,0.95))] text-xl font-bold text-white">
              N
            </div>
            <div>
              <p className="font-heading text-lg font-semibold text-white">NeuroPrep</p>
              <p className="text-xs text-slate-400">Premium AI study workspace</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/register">
              <Button variant="secondary" size="sm">
                Create account
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="section-wrap relative z-10 flex min-h-[calc(100vh-5rem)] items-center py-10">
        <div className="grid w-full items-stretch gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.section
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            className="hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_24%),radial-gradient(circle_at_82%_15%,rgba(124,58,237,0.2),transparent_28%),linear-gradient(160deg,rgba(8,12,28,0.95),rgba(10,18,42,0.86))] p-8 shadow-[0_30px_80px_rgba(3,7,22,0.45)] lg:flex lg:flex-col"
          >
            <Badge className="w-fit gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              Massive premium UI system
            </Badge>
            <h1 className="mt-6 max-w-lg text-4xl font-black tracking-tight text-white xl:text-5xl">
              Log into the <span className="text-gradient">study cockpit</span>, not a plain dashboard.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
              NeuroPrep is built like a modern SaaS platform with animated analytics, AI workflows, and
              strong visual hierarchy from login through revision mode.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Momentum</p>
                <p className="mt-3 text-3xl font-bold text-white">12d</p>
                <p className="mt-2 text-sm text-slate-400">Current active streak</p>
              </div>
              <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Readiness</p>
                <p className="mt-3 text-3xl font-bold text-white">92%</p>
                <p className="mt-2 text-sm text-slate-400">Predicted exam readiness</p>
              </div>
              <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Sessions</p>
                <p className="mt-3 text-3xl font-bold text-white">148</p>
                <p className="mt-2 text-sm text-slate-400">Tracked study blocks</p>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              {highlights.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <span className="mt-1 rounded-xl bg-cyan-300/10 p-2 text-cyan-200">
                    <TrendingUp className="h-4 w-4" />
                  </span>
                  <p className="text-sm leading-6 text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <Card className="mx-auto max-w-xl p-6 sm:p-8">
              <CardHeader className="space-y-1 pb-6">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500/30 to-accent-cyan/30">
                  <BookOpen className="h-7 w-7 text-cyan-300" />
                </div>
                <CardTitle className="text-2xl text-white">Welcome back</CardTitle>
                <CardDescription>
                  Sign in with your email or username to continue into the dashboard.
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                  >
                    {error}
                  </motion.p>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--text-main)]">Email or username</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <Input
                      type="text"
                      placeholder="you@example.com or your username"
                      value={identifier}
                      onChange={(event) => setIdentifier(event.target.value)}
                      className="pl-10"
                      autoComplete="username"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--text-main)]">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="pl-10"
                      autoComplete="current-password"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-slate-400">
                    <input type="checkbox" className="rounded border-white/20 bg-transparent" />
                    Keep me signed in
                  </label>
                  <button type="button" className="text-cyan-300 transition hover:text-cyan-200">
                    Reset password
                  </button>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Enter dashboard
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400">
                Email login, username login, protected dashboard routing, and local demo auth are all wired here.
              </div>

              <p className="mt-6 text-center text-sm text-slate-400">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="font-medium text-cyan-300 hover:text-cyan-200">
                  Sign up
                </Link>
              </p>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

