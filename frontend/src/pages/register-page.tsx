import { motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../contexts/auth-context'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { ThemeToggle } from '../components/ui/theme-toggle'

const onboardingNotes = [
  'Student, teacher, and admin-ready account structure',
  'JWT-based session handling with protected dashboard routes',
  'Expandable premium UI system built for heavy animations and analytics',
]

export function RegisterPage() {
  const { register, isLoading } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!name.trim() || !email.trim() || !username.trim() || !password) {
      setError('Fill in every field before continuing.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        username: username.trim(),
        password,
      })
      navigate('/dashboard', { replace: true })
    } catch (err: unknown) {
      const axiosError =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { detail?: string } } })
          : null

      const detail = axiosError?.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-hero-gradient">
      <div className="premium-grid absolute inset-0 opacity-20" />
      <motion.div
        className="pointer-events-none absolute -right-10 top-20 h-80 w-80 rounded-full bg-violet-500/15 blur-3xl"
        animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-10 left-12 h-72 w-72 rounded-full bg-cyan-400/12 blur-3xl"
        animate={{ y: [0, 18, 0], x: [0, 10, 0] }}
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
            <Link to="/login">
              <Button variant="secondary" size="sm">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="section-wrap relative z-10 flex min-h-[calc(100vh-5rem)] items-center py-10">
        <div className="grid w-full items-stretch gap-8 lg:grid-cols-[0.98fr_1.02fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="order-2 lg:order-1"
          >
            <Card className="mx-auto max-w-xl p-6 sm:p-8">
              <CardHeader className="space-y-1 pb-6">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500/30 to-accent-cyan/30">
                  <BookOpen className="h-7 w-7 text-cyan-300" />
                </div>
                <CardTitle className="text-2xl text-white">Create your account</CardTitle>
                <CardDescription>
                  Get into NeuroPrep with email, username, and secure local auth already wired.
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
                  <label className="text-sm font-medium text-[var(--text-main)]">Full name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <Input
                      type="text"
                      placeholder="Your full name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="pl-10"
                      autoComplete="name"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--text-main)]">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="pl-10"
                        autoComplete="email"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--text-main)]">Username</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                      <Input
                        type="text"
                        placeholder="username"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        className="pl-10"
                        autoComplete="username"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--text-main)]">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <Input
                      type="password"
                      placeholder="Minimum 8 characters"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="pl-10"
                      autoComplete="new-password"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-cyan-300 hover:text-cyan-200">
                  Sign in
                </Link>
              </p>
            </Card>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            className="order-1 flex rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_24%),radial-gradient(circle_at_82%_15%,rgba(124,58,237,0.2),transparent_28%),linear-gradient(160deg,rgba(8,12,28,0.95),rgba(10,18,42,0.86))] p-8 shadow-[0_30px_80px_rgba(3,7,22,0.45)] lg:order-2"
          >
            <div className="my-auto">
              <Badge className="gap-2">
                <ShieldCheck className="h-3.5 w-3.5" />
                Secure onboarding
              </Badge>
              <h1 className="mt-6 max-w-lg text-4xl font-black tracking-tight text-white xl:text-5xl">
                Build a high-end <span className="text-gradient">study identity</span> from the first screen.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
                The account experience is part of the product system. Signup should feel premium, fast,
                and already connected to the dashboard you land in next.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Roles</p>
                  <p className="mt-3 text-3xl font-bold text-white">3</p>
                  <p className="mt-2 text-sm text-slate-400">Student, teacher, admin</p>
                </div>
                <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Security</p>
                  <p className="mt-3 text-3xl font-bold text-white">JWT</p>
                  <p className="mt-2 text-sm text-slate-400">Protected session flow</p>
                </div>
                <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Setup</p>
                  <p className="mt-3 text-3xl font-bold text-white">Instant</p>
                  <p className="mt-2 text-sm text-slate-400">No manual user config</p>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                {onboardingNotes.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <span className="mt-1 rounded-xl bg-cyan-300/10 p-2 text-cyan-200">
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                    <p className="text-sm leading-6 text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  )
}
