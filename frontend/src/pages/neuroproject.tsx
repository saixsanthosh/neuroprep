import { motion } from 'framer-motion'
import { ArrowRight, Brain, Sparkles, Zap, BarChart3, CalendarDays, Gamepad2, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'

const featurePillars = [
  {
    title: 'AI Tutor',
    description: 'Ask anything and get exam-focused, step-by-step explanations powered by Gemini.',
    icon: Brain,
    to: '/dashboard/ai-tutor',
  },
  {
    title: 'Planner + Timer',
    description: 'Daily plans, Pomodoro sessions, and streak tracking in one flow.',
    icon: CalendarDays,
    to: '/dashboard/planner',
  },
  {
    title: 'Analytics',
    description: 'Weekly study hours, subject accuracy, and weak-topic detection.',
    icon: BarChart3,
    to: '/dashboard/analytics',
  },
  {
    title: 'Games & Community',
    description: 'Break mini-games and peer help to keep prep fun.',
    icon: Gamepad2,
    to: '/dashboard/games',
  },
]

const floatingOrbs = [
  { delay: 0, top: '10%', left: '5%', size: 120, opacity: 0.35 },
  { delay: 1.2, top: '70%', left: '15%', size: 160, opacity: 0.25 },
  { delay: 0.7, top: '20%', right: '10%', size: 190, opacity: 0.3 },
  { delay: 1.8, bottom: '5%', right: '20%', size: 140, opacity: 0.28 },
]

export function NeuroProject() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-hero-gradient text-[var(--text-main)]">
      {/* Animated background orbs */}
      {floatingOrbs.map((orb, index) => (
        <motion.div
          key={index}
          className="pointer-events-none absolute rounded-full bg-primary-500/30 blur-3xl"
          style={{
            top: orb.top,
            left: orb.left,
            right: orb.right,
            bottom: orb.bottom,
            width: orb.size,
            height: orb.size,
            opacity: orb.opacity,
          }}
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 10 + index * 2, repeat: Infinity, ease: 'easeInOut', delay: orb.delay }}
        />
      ))}

      {/* Glass frame */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-cyan text-lg font-bold text-white shadow-soft-glow">
              N
            </div>
            <div>
              <p className="font-heading text-lg font-semibold">NeuroPrep</p>
              <p className="text-xs text-muted">AI Study OS</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Badge className="hidden items-center gap-1.5 sm:inline-flex">
              <Sparkles className="h-3.5 w-3.5" />
              Live Preview
            </Badge>
            <Link to="/login">
              <Button variant="secondary" size="sm">
                Sign in
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="sm" className="hidden sm:inline-flex">
                Open dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </header>

        <main className="grid flex-1 gap-6 lg:grid-cols-[1.4fr_1.1fr]">
          {/* Left: overview + CTA */}
          <section className="flex flex-col justify-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge>
                <Zap className="mr-1.5 h-3.5 w-3.5" />
                NeuroProject • Premium Shell
              </Badge>
              <h1 className="mt-4 text-balance text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Your entire <span className="text-gradient">prep universe</span> in one animated screen.
              </h1>
              <p className="mt-4 max-w-xl text-sm text-muted sm:text-base">
                Jump straight into AI tutoring, study plans, analytics, games, and community from a single, cinematic
                hub. Built with motion-first design and production-ready patterns.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link to="/dashboard">
                <Button size="lg" className="group">
                  Launch Study HQ
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg">
                  Start with account
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="grid gap-3 text-xs text-muted sm:grid-cols-3"
            >
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">Live widgets</p>
                <p className="mt-1 text-2xl font-semibold text-[var(--text-main)]">7+</p>
                <p className="mt-1 text-[11px]">Study hours, streaks, tasks, and more.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/16 p-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">Motion</p>
                <p className="mt-1 text-2xl font-semibold text-[var(--text-main)]">Framer</p>
                <p className="mt-1 text-[11px]">Smooth page transitions, parallax, and hover lift.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">Analytics</p>
                <p className="mt-1 text-2xl font-semibold text-[var(--text-main)]">4 charts</p>
                <p className="mt-1 text-[11px]">Weekly hours, accuracy, and heatmaps.</p>
              </div>
            </motion.div>
          </section>

          {/* Right: animated glass board */}
          <section className="relative">
            <motion.div
              initial={{ opacity: 0, x: 32, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="glass-panel relative h-full rounded-[2.25rem] p-6"
            >
              <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.9)]" />
                  <p className="text-xs text-slate-300">Session Live</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Users className="h-3.5 w-3.5" />
                  3 roles: Student, Teacher, Admin
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-[1.4fr_1.2fr]">
                <Card className="interactive-card relative h-40 overflow-hidden bg-animated p-4 text-left">
                  <p className="text-xs text-slate-300">Today&apos;s Focus</p>
                  <p className="mt-1 text-2xl font-semibold text-white">3h 45m</p>
                  <p className="mt-2 text-xs text-slate-300">Physics • Organic Chemistry • Modern History</p>

                  <motion.div
                    className="absolute -bottom-3 right-3 h-16 w-16 rounded-full bg-accent-cyan/40 blur-2xl"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </Card>

                <div className="space-y-3 text-xs">
                  <Card className="flex items-center justify-between gap-2 border-white/15 bg-black/40 px-4 py-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-slate-400">Streak</p>
                      <p className="text-lg font-semibold text-[var(--text-main)]">12 days</p>
                    </div>
                    <div className="flex gap-1.5">
                      {Array.from({ length: 7 }).map((_, index) => (
                        <div
                          key={index}
                          className="h-7 w-2 rounded-full bg-gradient-to-b from-primary-500 to-accent-cyan opacity-80"
                          style={{ transform: `scaleY(${0.4 + index * 0.08})` }}
                        />
                      ))}
                    </div>
                  </Card>

                  <Card className="border-white/15 bg-black/35 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">AI Tutor Queue</p>
                    <p className="mt-1 text-xs text-muted">3 active chats, 1 document summary in progress.</p>
                  </Card>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {featurePillars.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + index * 0.06 }}
                  >
                    <Link to={feature.to}>
                      <Card className="group flex items-start gap-3 border-white/15 bg-black/35 p-4 text-left">
                        <div className="mt-0.5 rounded-2xl bg-gradient-to-br from-primary-500/80 to-accent-cyan/80 p-2 text-white shadow-soft-glow">
                          <feature.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[var(--text-main)]">{feature.title}</p>
                          <p className="mt-1 text-xs text-muted">{feature.description}</p>
                          <span className="mt-2 inline-flex items-center text-[11px] text-accent-cyan">
                            Open
                            <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                          </span>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>
        </main>
      </div>
    </div>
  )
}

