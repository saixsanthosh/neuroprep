import { AnimatePresence, motion } from 'framer-motion'
import { Pause, Play, RotateCcw } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '../components/ui/button'
import { Card, CardDescription, CardTitle } from '../components/ui/card'

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

  const totalSeconds = mode === 'study' ? STUDY_SECONDS : BREAK_SECONDS
  const progress = useMemo(() => 1 - secondsLeft / totalSeconds, [secondsLeft, totalSeconds])

  const radius = 110
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - progress)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Study Timer</h1>
        <p className="mt-1 text-muted">Pomodoro focus cycle with smooth progress and break indicators.</p>
      </div>

      <Card className="flex flex-col items-center">
        <div className="mb-4 text-center">
          <CardTitle>{mode === 'study' ? 'Focus Session' : 'Break Session'}</CardTitle>
          <CardDescription>25 min study / 5 min break with completion animation.</CardDescription>
        </div>

        <div className="relative mb-8 flex h-72 w-72 items-center justify-center">
          <svg viewBox="0 0 260 260" className="h-full w-full -rotate-90">
            <circle cx="130" cy="130" r={radius} stroke="rgba(255,255,255,0.12)" strokeWidth="14" fill="none" />
            <motion.circle
              cx="130"
              cy="130"
              r={radius}
              stroke="url(#timerGradient)"
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            />
            <defs>
              <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute flex flex-col items-center">
            <p className="text-xs uppercase tracking-widest text-muted">{mode}</p>
            <p className="font-heading text-5xl font-bold">{formatSeconds(secondsLeft)}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <motion.div whileTap={{ scale: 0.94 }}>
            <Button onClick={() => setRunning((prev) => !prev)}>
              {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
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
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </motion.div>
        </div>

        <AnimatePresence>
          {completedSessions > 0 && (
            <motion.div
              key={completedSessions}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 rounded-2xl border border-emerald-400/35 bg-emerald-500/20 px-4 py-3 text-sm text-emerald-200"
            >
              Session completed. Total cycles finished: {completedSessions}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  )
}
