import { AnimatePresence, motion } from 'framer-motion'
import { Pause, Play, RotateCcw, Clock, Zap, Coffee } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '../components/ui/button'
import { CardDescription, CardTitle } from '../components/ui/card'
import { ParticlesBackground } from '../components/ui/particles-background'
import { FloatingShapes } from '../components/ui/floating-shapes'
import { AnimatedGradientOrb } from '../components/ui/animated-gradient-orb'
import { GlowingCard } from '../components/ui/glowing-card'

const STUDY_SECONDS = 25 * 60
const BREAK_SECONDS = 5 * 60

function formatSeconds(total: number) {
  const mins = Math.floor(total / 60)
  const secs = total % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export function TimerPage() {
  const [mode, setMode] = useState<'study' | 'break'>('study')
  const [secondsLeft, setSecondsLeft] = useState(STUDY_SECONDS)
  const [running, setRunning] = useState(false)
  const [completedSessions, setCompletedSessions] = useState(0)

  useEffect(() => {
    if (!running) {
      return
    }

    const timer = setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          const nextMode = mode === 'study' ? 'break' : 'study'
          setMode(nextMode)
          setCompletedSessions((prev) => prev + 1)
          return nextMode === 'study' ? STUDY_SECONDS : BREAK_SECONDS
        }
        return current - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [running, mode])

  useEffect(() => {
    window.localStorage.setItem(
      'neuroprep_timer_state',
      JSON.stringify({
        mode,
        running,
        secondsLeft,
        completedSessions,
      }),
    )
  }, [mode, running, secondsLeft, completedSessions])

  const totalSeconds = mode === 'study' ? STUDY_SECONDS : BREAK_SECONDS
  const progress = useMemo(() => 1 - secondsLeft / totalSeconds, [secondsLeft, totalSeconds])

  const radius = 110
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - progress)

  return (
    <div className="relative min-h-screen">
      {/* Background Effects */}
      <ParticlesBackground />
      <FloatingShapes />
      <AnimatedGradientOrb color="purple" size="lg" top="10%" left="5%" />
      <AnimatedGradientOrb color="cyan" size="md" top="60%" right="10%" />
      <AnimatedGradientOrb color="pink" size="sm" bottom="15%" left="20%" />

      <div className="relative z-10 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-gradient text-3xl font-black sm:text-4xl">Study Timer</h1>
          <p className="mt-2 text-slate-300">Pomodoro focus cycle with smooth progress and break indicators.</p>
        </motion.div>

        <GlowingCard glowColor={mode === 'study' ? 'purple' : 'cyan'}>
          <div className="mb-6 text-center">
            <div className="mb-3 flex items-center justify-center gap-3">
              {mode === 'study' ? (
                <div className="rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 p-2">
                  <Zap className="h-5 w-5 text-white" />
                </div>
              ) : (
                <div className="rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 p-2">
                  <Coffee className="h-5 w-5 text-white" />
                </div>
              )}
              <CardTitle className="text-2xl text-white">
                {mode === 'study' ? 'Focus Session' : 'Break Session'}
              </CardTitle>
            </div>
            <CardDescription>25 min study / 5 min break with completion animation.</CardDescription>
          </div>

          <div className="relative mb-8 flex h-80 w-full items-center justify-center">
            <svg viewBox="0 0 260 260" className="pointer-events-none h-full w-full -rotate-90">
              <circle cx="130" cy="130" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="16" fill="none" />
              <motion.circle
                cx="130"
                cy="130"
                r={radius}
                stroke={mode === 'study' ? 'url(#timerGradientStudy)' : 'url(#timerGradientBreak)'}
                strokeWidth="16"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={circumference}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              />
              <defs>
                <linearGradient id="timerGradientStudy" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
                <linearGradient id="timerGradientBreak" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute flex flex-col items-center">
              <div className="mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400" />
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{mode}</p>
              </div>
              <p className={`font-heading text-6xl font-black ${mode === 'study' ? 'text-gradient-purple' : 'text-gradient-cyan'}`}>
                {formatSeconds(secondsLeft)}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                {Math.round(progress * 100)}% complete
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <motion.div whileTap={{ scale: 0.94 }}>
              <Button
                onClick={() => setRunning((prev) => !prev)}
                className="gap-2 bg-gradient-to-r from-purple-500 to-violet-600 px-6 py-6 text-base font-semibold hover:from-purple-600 hover:to-violet-700"
              >
                {running ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                {running ? 'Pause' : 'Start'}
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.94 }}>
              <Button
                variant="secondary"
                onClick={() => {
                  setRunning(false)
                  setMode('study')
                  setSecondsLeft(STUDY_SECONDS)
                }}
                className="gap-2 px-6 py-6 text-base font-semibold"
              >
                <RotateCcw className="h-5 w-5" />
                Reset
              </Button>
            </motion.div>
          </div>

          <AnimatePresence>
            {completedSessions > 0 && (
              <motion.div
                key={completedSessions}
                initial={{ opacity: 0, scale: 0.92, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                className="mt-6 rounded-2xl border border-emerald-400/35 bg-emerald-500/20 px-5 py-4 text-center text-sm font-medium text-emerald-200"
              >
                Session completed! Total cycles finished: {completedSessions}
              </motion.div>
            )}
          </AnimatePresence>
        </GlowingCard>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-5 backdrop-blur-xl"
          >
            <p className="text-xs uppercase tracking-wider text-slate-500">Sessions Today</p>
            <p className="mt-2 text-3xl font-black text-white">{completedSessions}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-5 backdrop-blur-xl"
          >
            <p className="text-xs uppercase tracking-wider text-slate-500">Current Mode</p>
            <p className="mt-2 text-3xl font-black text-white capitalize">{mode}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-5 backdrop-blur-xl"
          >
            <p className="text-xs uppercase tracking-wider text-slate-500">Focus Time</p>
            <p className="mt-2 text-3xl font-black text-white">{completedSessions * 25}m</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
