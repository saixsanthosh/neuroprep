import { motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Sparkles,
  Zap,
  Target,
  Brain,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../contexts/auth-context'
import { requestPasswordReset } from '../lib/api'
import { resolvePostAuthRoute } from '../lib/post-auth'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { ThemeToggle } from '../components/ui/theme-toggle'
import { AnimatedGradientOrb } from '../components/ui/animated-gradient-orb'
import { FloatingShapes } from '../components/ui/floating-shapes'
import { ParticlesBackground } from '../components/ui/particles-background'
import { GlowingCard } from '../components/ui/glowing-card'
import { AnimatedCounter } from '../components/ui/animated-counter'
import { GradientText } from '../components/ui/gradient-text'
import { GoogleMark } from '../components/ui/google-mark'
import { PulseDot } from '../components/ui/pulse-dot'

const highlights = [
  {
    icon: Brain,
    text: 'Adaptive planner with AI-built revision lanes',
    color: 'from-cyan-400 to-blue-500',
  },
  {
    icon: Target,
    text: 'Mock exam cockpit with animated analytics',
    color: 'from-violet-400 to-purple-500',
  },
  {
    icon: Zap,
    text: 'Tutor workspace with follow-up chat threads',
    color: 'from-pink-400 to-rose-500',
  },
]

export function LoginPage() {
  const { login, googleAuth, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/dashboard'

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setNotice('')

    if (!identifier.trim() || !password) {
      setError('Enter your email or username and password.')
      return
    }

    try {
      await login(identifier.trim(), password)
      navigate(await resolvePostAuthRoute(redirectTo), { replace: true })
    } catch (err: unknown) {
      const axiosError =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { detail?: string } } })
          : null

      const detail = axiosError?.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Login failed. Please try again.')
    }
  }

  const handlePasswordReset = async () => {
    setError('')
    setNotice('')

    const email = identifier.trim()
    if (!email || !email.includes('@')) {
      setError('Enter your email in the first field to receive reset instructions.')
      return
    }

    try {
      const response = await requestPasswordReset(email, `${window.location.origin}/login`)
      setNotice(response.message)
    } catch (err: unknown) {
      const axiosError =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { detail?: string } } })
          : null

      const detail = axiosError?.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Unable to send reset instructions.')
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setNotice('')

    try {
      const result = await googleAuth()
      if (result === 'authenticated') {
        navigate(await resolvePostAuthRoute(redirectTo), { replace: true })
      }
    } catch (err: unknown) {
      const axiosError =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { detail?: string } } })
          : null

      const detail = axiosError?.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Google sign-in failed.')
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-hero-gradient">
      <ParticlesBackground />
      <FloatingShapes />
      <div className="premium-grid absolute inset-0 opacity-20" />
      
      <AnimatedGradientOrb
        className="-left-12 top-16"
        colors={['rgba(34, 211, 238, 0.25)', 'rgba(56, 189, 248, 0.2)']}
        size="lg"
        delay={0}
      />
      <AnimatedGradientOrb
        className="bottom-8 right-12"
        colors={['rgba(124, 58, 237, 0.2)', 'rgba(167, 139, 250, 0.15)']}
        size="lg"
        delay={1}
      />
      <AnimatedGradientOrb
        className="top-1/2 left-1/3"
        colors={['rgba(236, 72, 153, 0.15)', 'rgba(219, 39, 119, 0.1)']}
        size="md"
        delay={2}
      />

      <header className="relative z-20 border-b border-white/10 bg-[#050913]/70 backdrop-blur-xl">
        <div className="section-wrap flex h-18 items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(56,189,248,0.95),rgba(124,58,237,0.95))] text-xl font-bold text-white shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              N
            </motion.div>
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
            className="hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_24%),radial-gradient(circle_at_82%_15%,rgba(124,58,237,0.2),transparent_28%),linear-gradient(160deg,rgba(8,12,28,0.95),rgba(10,18,42,0.86))] p-8 shadow-[0_30px_80px_rgba(3,7,22,0.45)] backdrop-blur-2xl lg:flex lg:flex-col"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="w-fit gap-2 animate-glow-expand">
                <Sparkles className="h-3.5 w-3.5" />
                Massive premium UI system
              </Badge>
            </motion.div>
            
            <motion.h1
              className="mt-6 max-w-lg text-4xl font-black tracking-tight text-white xl:text-5xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Log into the <GradientText>study cockpit</GradientText>, not a plain dashboard.
            </motion.h1>
            
            <motion.p
              className="mt-4 max-w-xl text-base leading-7 text-slate-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              NeuroPrep is built like a modern SaaS platform with animated analytics, AI workflows, and
              strong visual hierarchy from login through revision mode.
            </motion.p>

            <motion.div
              className="mt-8 grid gap-4 sm:grid-cols-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <GlowingCard className="p-4" glowColor="rgba(34, 211, 238, 0.3)">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Workflows</p>
                <p className="mt-3 text-3xl font-bold text-white">
                  <AnimatedCounter value={12} />
                </p>
                <p className="mt-2 text-sm text-slate-400">Core learning modules wired</p>
              </GlowingCard>
              <GlowingCard className="p-4" glowColor="rgba(124, 58, 237, 0.3)">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Surfaces</p>
                <p className="mt-3 text-3xl font-bold text-white">
                  <AnimatedCounter value={6} />
                </p>
                <p className="mt-2 text-sm text-slate-400">Primary pages redesigned</p>
              </GlowingCard>
              <GlowingCard className="p-4" glowColor="rgba(236, 72, 153, 0.3)">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Signals</p>
                <p className="mt-3 text-3xl font-bold text-white">
                  <AnimatedCounter value={5} />
                </p>
                <p className="mt-2 text-sm text-slate-400">Auth and analytics paths live</p>
              </GlowingCard>
            </motion.div>

            <motion.div
              className="mt-8 space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {highlights.map((item, index) => (
                <motion.div
                  key={item.text}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <motion.span
                    className={`mt-1 rounded-xl bg-gradient-to-br ${item.color} p-2 text-white`}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                  >
                    <item.icon className="h-4 w-4" />
                  </motion.span>
                  <p className="text-sm leading-6 text-slate-300">{item.text}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="mt-8 rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <PulseDot color="bg-cyan-400" size="sm" />
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">System Ready</p>
              </div>
              <p className="text-sm text-cyan-100">
                Email and username login are ready. Google sign-in follows the configured provider flow.
              </p>
            </motion.div>
          </motion.section>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <GlowingCard className="mx-auto max-w-xl p-6 sm:p-8">
              <CardHeader className="space-y-1 pb-6">
                <motion.div
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/30 to-violet-600/30"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  animate={{
                    boxShadow: [
                      '0 0 0 rgba(34,211,238,0)',
                      '0 0 30px rgba(34,211,238,0.3)',
                      '0 0 0 rgba(34,211,238,0)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <BookOpen className="h-7 w-7 text-cyan-300" />
                </motion.div>
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

                {notice && (
                  <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
                  >
                    {notice}
                  </motion.p>
                )}

                <div className="space-y-2">
                  <label htmlFor="login-identifier" className="text-sm font-medium text-[var(--text-main)]">
                    Email or username
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <Input
                      id="login-identifier"
                      name="login-identifier"
                      type="text"
                      placeholder="you@example.com or your username"
                      value={identifier}
                      onChange={(event) => setIdentifier(event.target.value)}
                      className="pl-10 transition-all duration-300 focus:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                      autoComplete="username"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="login-password" className="text-sm font-medium text-[var(--text-main)]">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <Input
                      id="login-password"
                      name="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="pl-10 pr-11 transition-all duration-300 focus:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                      autoComplete="current-password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-slate-300 transition-colors">
                    <input type="checkbox" className="rounded border-white/20 bg-transparent" />
                    Keep me signed in
                  </label>
                  <button
                    type="button"
                    className="text-cyan-300 transition hover:text-cyan-200"
                    onClick={() => void handlePasswordReset()}
                    disabled={isLoading}
                  >
                    Reset password
                  </button>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button type="submit" className="w-full group" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Enter dashboard
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </motion.div>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-[#0a1124] px-3 text-xs uppercase tracking-[0.2em] text-slate-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-center border-white/15 bg-white/5"
                    onClick={() => void handleGoogleSignIn()}
                    disabled={isLoading}
                  >
                    <GoogleMark />
                    Continue with Google
                  </Button>
                </motion.div>
              </form>

              <motion.div
                className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-300 mt-0.5 flex-shrink-0" />
                  <p>
                    Email login, username login, Google sign-in, protected dashboard routing, and local demo auth are all wired here.
                  </p>
                </div>
              </motion.div>

              <motion.p
                className="mt-6 text-center text-sm text-slate-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Don&apos;t have an account?{' '}
                <Link to="/register" className="font-medium text-cyan-300 hover:text-cyan-200 transition-colors">
                  Sign up
                </Link>
              </motion.p>
            </GlowingCard>

            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link to="/">
                <Button variant="secondary" size="sm">
                  Back to home
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

