import { motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User,
  Sparkles,
  Zap,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../contexts/auth-context'
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
import { GradientText } from '../components/ui/gradient-text'
import { GoogleMark } from '../components/ui/google-mark'

const onboardingNotes = [
  {
    icon: ShieldCheck,
    text: 'Student-first account structure with fast onboarding and protected sessions',
    color: 'from-cyan-400 to-blue-500',
  },
  {
    icon: Zap,
    text: 'JWT-based session handling with protected dashboard routes',
    color: 'from-violet-400 to-purple-500',
  },
  {
    icon: Sparkles,
    text: 'Expandable premium UI system built for heavy animations and analytics',
    color: 'from-pink-400 to-rose-500',
  },
]

export function RegisterPage() {
  const { register, googleAuth, isLoading } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

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
      navigate(await resolvePostAuthRoute('/dashboard'), { replace: true })
    } catch (err: unknown) {
      const axiosError =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { detail?: string } } })
          : null

      const detail = axiosError?.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Registration failed. Please try again.')
    }
  }

  const handleGoogleSignup = async () => {
    setError('')

    try {
      const result = await googleAuth()
      if (result === 'authenticated') {
        navigate(await resolvePostAuthRoute('/dashboard'), { replace: true })
      }
    } catch (err: unknown) {
      const axiosError =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { detail?: string } } })
          : null

      const detail = axiosError?.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Google signup failed. Please try again.')
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-hero-gradient">
      <ParticlesBackground />
      <FloatingShapes />
      <div className="premium-grid absolute inset-0 opacity-20" />
      
      <AnimatedGradientOrb
        className="-right-10 top-20"
        colors={['rgba(124, 58, 237, 0.25)', 'rgba(167, 139, 250, 0.2)']}
        size="lg"
        delay={0}
      />
      <AnimatedGradientOrb
        className="bottom-10 left-12"
        colors={['rgba(34, 211, 238, 0.2)', 'rgba(56, 189, 248, 0.15)']}
        size="lg"
        delay={1}
      />
      <AnimatedGradientOrb
        className="top-1/2 right-1/4"
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
            <GlowingCard className="mx-auto max-w-xl p-6 sm:p-8">
              <CardHeader className="space-y-1 pb-6">
                <motion.div
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/30 to-cyan-600/30"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  animate={{
                    boxShadow: [
                      '0 0 0 rgba(124,58,237,0)',
                      '0 0 30px rgba(124,58,237,0.3)',
                      '0 0 0 rgba(124,58,237,0)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <BookOpen className="h-7 w-7 text-violet-300" />
                </motion.div>
                <CardTitle className="text-2xl text-white">Create your account</CardTitle>
                <CardDescription>
                  Create your student workspace with email, username, and secure sign-in already wired.
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
                  <label htmlFor="register-name" className="text-sm font-medium text-[var(--text-main)]">
                    Full name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <Input
                      id="register-name"
                      name="register-name"
                      type="text"
                      placeholder="Your full name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="pl-10 transition-all duration-300 focus:shadow-[0_0_20px_rgba(124,58,237,0.2)]"
                      autoComplete="name"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="register-email" className="text-sm font-medium text-[var(--text-main)]">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                      <Input
                        id="register-email"
                        name="register-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="pl-10 transition-all duration-300 focus:shadow-[0_0_20px_rgba(124,58,237,0.2)]"
                        autoComplete="email"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="register-username" className="text-sm font-medium text-[var(--text-main)]">
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                      <Input
                        id="register-username"
                        name="register-username"
                        type="text"
                        placeholder="username"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        className="pl-10 transition-all duration-300 focus:shadow-[0_0_20px_rgba(124,58,237,0.2)]"
                        autoComplete="username"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="register-password" className="text-sm font-medium text-[var(--text-main)]">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <Input
                      id="register-password"
                      name="register-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Minimum 8 characters"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="pl-10 pr-11 transition-all duration-300 focus:shadow-[0_0_20px_rgba(124,58,237,0.2)]"
                      autoComplete="new-password"
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

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button type="submit" className="w-full group" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create account
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
                    onClick={() => void handleGoogleSignup()}
                    disabled={isLoading}
                  >
                    <GoogleMark />
                    Continue with Google
                  </Button>
                </motion.div>
              </form>

              <motion.p
                className="mt-6 text-center text-sm text-slate-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-cyan-300 hover:text-cyan-200 transition-colors">
                  Sign in
                </Link>
              </motion.p>
            </GlowingCard>

            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link to="/">
                <Button variant="secondary" size="sm">
                  Back to home
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            className="order-1 flex rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_24%),radial-gradient(circle_at_82%_15%,rgba(124,58,237,0.2),transparent_28%),linear-gradient(160deg,rgba(8,12,28,0.95),rgba(10,18,42,0.86))] p-8 shadow-[0_30px_80px_rgba(3,7,22,0.45)] backdrop-blur-2xl lg:order-2"
          >
            <div className="my-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Badge className="gap-2 animate-glow-expand">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secure onboarding
                </Badge>
              </motion.div>
              
              <motion.h1
                className="mt-6 max-w-lg text-4xl font-black tracking-tight text-white xl:text-5xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Build a high-end <GradientText>study identity</GradientText> from the first screen.
              </motion.h1>
              
              <motion.p
                className="mt-4 max-w-xl text-base leading-7 text-slate-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                The account experience is part of the product system. Signup should feel premium, fast,
                and already connected to the dashboard you land in next.
              </motion.p>

              <motion.div
                className="mt-8 grid gap-4 sm:grid-cols-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <GlowingCard className="p-4" glowColor="rgba(34, 211, 238, 0.3)">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Workspace</p>
                  <p className="mt-3 text-3xl font-bold text-white">Student</p>
                  <p className="mt-2 text-sm text-slate-400">Focused on a single learner journey</p>
                </GlowingCard>
                <GlowingCard className="p-4" glowColor="rgba(124, 58, 237, 0.3)">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Security</p>
                  <p className="mt-3 text-3xl font-bold text-white">JWT</p>
                  <p className="mt-2 text-sm text-slate-400">Protected session flow</p>
                </GlowingCard>
                <GlowingCard className="p-4" glowColor="rgba(236, 72, 153, 0.3)">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Setup</p>
                  <p className="mt-3 text-3xl font-bold text-white">Instant</p>
                  <p className="mt-2 text-sm text-slate-400">No manual user config</p>
                </GlowingCard>
              </motion.div>

              <motion.div
                className="mt-8 space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {onboardingNotes.map((item, index) => (
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
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  )
}

