import { AnimatePresence, motion } from 'framer-motion'
import { Brain, Gamepad2, Swords, Target, Trophy, X, Zap } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { useAuth } from '../contexts/auth-context'
import { useAnimatedNumber } from '../hooks/use-animated-number'
import { getGamesLeaderboard, submitGameScore, type GamesLeaderboardEntry } from '../lib/api'
import { Button } from '../components/ui/button'
import { CardDescription, CardTitle } from '../components/ui/card'
import { ParticlesBackground } from '../components/ui/particles-background'
import { FloatingShapes } from '../components/ui/floating-shapes'
import { AnimatedGradientOrb } from '../components/ui/animated-gradient-orb'
import { GlowingCard } from '../components/ui/glowing-card'

type GamePrompt = {
  prompt: string
  options: string[]
  correctIndex: number
}

type GameDefinition = {
  name: string
  description: string
  icon: React.ElementType
  color: string
  prompts: GamePrompt[]
}

type TimerState = {
  mode?: 'study' | 'break'
  running?: boolean
  secondsLeft?: number
  completedSessions?: number
}

const games: GameDefinition[] = [
  {
    name: 'Concept Blitz',
    description: 'Fast MCQ reaction challenge',
    icon: Zap,
    color: 'from-yellow-400 to-orange-500',
    prompts: [
      { prompt: 'Which law explains F = ma?', options: ['Ohm law', 'Newton second law', 'Snell law'], correctIndex: 1 },
      { prompt: 'The SI unit of work is:', options: ['Joule', 'Pascal', 'Volt'], correctIndex: 0 },
      { prompt: 'Acceleration due to gravity is closest to:', options: ['9.8 m/s^2', '1.6 m/s^2', '3.0 m/s^2'], correctIndex: 0 },
    ],
  },
  {
    name: 'Formula Hunter',
    description: 'Fill missing formulas before timeout',
    icon: Target,
    color: 'from-cyan-400 to-blue-500',
    prompts: [
      { prompt: 'Power is equal to:', options: ['Work / time', 'Mass x acceleration', 'Voltage x charge'], correctIndex: 0 },
      { prompt: 'Speed formula is:', options: ['Distance / time', 'Force / area', 'Current x resistance'], correctIndex: 0 },
      { prompt: 'Density equals:', options: ['Mass / volume', 'Volume / mass', 'Mass x volume'], correctIndex: 0 },
    ],
  },
  {
    name: 'Memory Match',
    description: 'Pair concepts and definitions quickly',
    icon: Brain,
    color: 'from-purple-400 to-pink-500',
    prompts: [
      { prompt: 'Photosynthesis happens in:', options: ['Mitochondria', 'Chloroplast', 'Nucleus'], correctIndex: 1 },
      { prompt: 'A prime number has:', options: ['Two factors', 'Three factors', 'Infinite factors'], correctIndex: 0 },
      { prompt: 'The heart pumps:', options: ['Air', 'Blood', 'Hormones only'], correctIndex: 1 },
    ],
  },
  {
    name: 'Diagram Rush',
    description: 'Label diagrams under pressure',
    icon: Gamepad2,
    color: 'from-green-400 to-emerald-500',
    prompts: [
      { prompt: 'The center of an atom is the:', options: ['Proton', 'Nucleus', 'Electron shell'], correctIndex: 1 },
      { prompt: 'The longest bone in the body is:', options: ['Femur', 'Ulna', 'Tibia'], correctIndex: 0 },
      { prompt: 'The line x-axis meets y-axis at the:', options: ['Origin', 'Tangent', 'Vertex'], correctIndex: 0 },
    ],
  },
  {
    name: 'Quiz Battle',
    description: '60-second exam quiz duel',
    icon: Swords,
    color: 'from-red-400 to-rose-500',
    prompts: [
      { prompt: '2x + 6 = 10. x =', options: ['1', '2', '3'], correctIndex: 1 },
      { prompt: 'Water boils at:', options: ['90 C', '100 C', '120 C'], correctIndex: 1 },
      { prompt: 'The capital of Japan is:', options: ['Seoul', 'Tokyo', 'Kyoto'], correctIndex: 1 },
    ],
  },
]

function readTimerState(): TimerState {
  try {
    const raw = window.localStorage.getItem('neuroprep_timer_state')
    return raw ? (JSON.parse(raw) as TimerState) : {}
  } catch {
    return {}
  }
}

function writeTimerState(nextState: TimerState) {
  window.localStorage.setItem('neuroprep_timer_state', JSON.stringify(nextState))
}

function readBestScores(): Record<string, number> {
  try {
    const raw = window.localStorage.getItem('neuroprep_game_best_scores')
    return raw ? (JSON.parse(raw) as Record<string, number>) : {}
  } catch {
    return {}
  }
}

function readTotalScore() {
  return Number(window.localStorage.getItem('neuroprep_game_total_score') || '0')
}

function GameCard({
  game,
  delay,
  bestScore,
  canPlay,
  onPlay,
}: {
  game: GameDefinition
  delay: number
  bestScore: number
  canPlay: boolean
  onPlay: () => void
}) {
  const score = useAnimatedNumber(bestScore, 900)
  const Icon = game.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-xl"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 transition-opacity duration-500 group-hover:opacity-10`} />

      <div className={`relative mb-4 inline-flex rounded-2xl bg-gradient-to-br ${game.color} p-3`}>
        <Icon className="h-6 w-6 text-white" />
      </div>

      <p className="relative text-lg font-bold text-white">{game.name}</p>
      <p className="relative mt-2 text-sm text-slate-400">{game.description}</p>

      <div className="relative mt-5 rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
        <p className="text-xs uppercase tracking-wider text-slate-500">Best Score</p>
        <p className={`mt-2 bg-gradient-to-r ${game.color} bg-clip-text text-3xl font-black text-transparent`}>
          {score}
        </p>
      </div>

      <motion.button
        whileHover={{ scale: canPlay ? 1.05 : 1 }}
        whileTap={{ scale: canPlay ? 0.95 : 1 }}
        onClick={onPlay}
        className={`relative mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg transition-shadow ${canPlay ? `bg-gradient-to-r ${game.color} hover:shadow-xl` : 'cursor-pointer border border-white/15 bg-white/5 text-slate-300'}`}
      >
        {canPlay ? 'Play Now' : 'Start break mode'}
      </motion.button>
    </motion.div>
  )
}

export function GamesPage() {
  const { user } = useAuth()
  const [leaderboard, setLeaderboard] = useState<GamesLeaderboardEntry[]>([])
  const [leaderboardLoading, setLeaderboardLoading] = useState(true)
  const [bestScores, setBestScores] = useState<Record<string, number>>(() => readBestScores())
  const [totalScore, setTotalScore] = useState(() => readTotalScore())
  const [timerState, setTimerState] = useState<TimerState>(() => readTimerState())
  const [activeGame, setActiveGame] = useState<GameDefinition | null>(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [currentScore, setCurrentScore] = useState(0)
  const [statusMessage, setStatusMessage] = useState('')
  const animatedTotalScore = useAnimatedNumber(totalScore)

  useEffect(() => {
    let active = true

    const loadLeaderboard = async () => {
      setLeaderboardLoading(true)
      try {
        const data = await getGamesLeaderboard(10)
        if (active) {
          setLeaderboard(data)
        }
      } catch {
        if (active) {
          setLeaderboard([])
        }
      } finally {
        if (active) {
          setLeaderboardLoading(false)
        }
      }
    }

    void loadLeaderboard()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const syncTimerState = () => setTimerState(readTimerState())
    window.addEventListener('storage', syncTimerState)
    return () => window.removeEventListener('storage', syncTimerState)
  }, [])

  const canPlay = timerState.mode === 'break'
  const currentPrompt = activeGame?.prompts[questionIndex]

  const activateBreakMode = () => {
    const nextState: TimerState = {
      mode: 'break',
      running: false,
      secondsLeft: timerState.secondsLeft && timerState.mode === 'break' ? timerState.secondsLeft : 5 * 60,
      completedSessions: timerState.completedSessions ?? 0,
    }
    writeTimerState(nextState)
    setTimerState(nextState)
    setStatusMessage('Break mode activated. Games are now unlocked for this session.')
  }

  const openGame = (game: GameDefinition) => {
    if (!canPlay) {
      activateBreakMode()
    }

    setStatusMessage('')
    setActiveGame(game)
    setQuestionIndex(0)
    setCurrentScore(0)
  }

  const closeGame = () => {
    setActiveGame(null)
    setQuestionIndex(0)
    setCurrentScore(0)
  }

  const completeGame = async (game: GameDefinition, finalScore: number) => {
    const nextBestScores = {
      ...bestScores,
      [game.name]: Math.max(bestScores[game.name] ?? 0, finalScore),
    }
    const nextTotal = totalScore + finalScore

    setBestScores(nextBestScores)
    setTotalScore(nextTotal)
    window.localStorage.setItem('neuroprep_game_best_scores', JSON.stringify(nextBestScores))
    window.localStorage.setItem('neuroprep_game_total_score', String(nextTotal))

    try {
      await submitGameScore({ game_name: game.name, score: finalScore })
      setLeaderboard(await getGamesLeaderboard(10))
      setStatusMessage(`${game.name} completed. Score submitted successfully.`)
    } catch {
      setStatusMessage(`${game.name} completed locally. Score sync failed.`)
    }

    closeGame()
  }

  const answerQuestion = async (selectedIndex: number) => {
    if (!activeGame || !currentPrompt) {
      return
    }

    const bonus = selectedIndex === currentPrompt.correctIndex ? 250 : 100
    const nextScore = currentScore + bonus

    if (questionIndex === activeGame.prompts.length - 1) {
      await completeGame(activeGame, nextScore)
      return
    }

    setCurrentScore(nextScore)
    setQuestionIndex((prev) => prev + 1)
  }

  const topPlayerLabel = useMemo(() => {
    if (totalScore === 0) {
      return 'Play a round to create your first game score.'
    }
    if (!leaderboard.length) {
      return 'No synced leaderboard entries yet.'
    }
    return `Global leaderboard live. Top score right now: ${leaderboard[0].score}`
  }, [leaderboard, totalScore])

  return (
    <div className="relative min-h-screen">
      <ParticlesBackground />
      <FloatingShapes />
      <AnimatedGradientOrb color="yellow" size="lg" top="5%" right="10%" />
      <AnimatedGradientOrb color="cyan" size="md" top="50%" left="5%" />
      <AnimatedGradientOrb color="purple" size="sm" bottom="10%" right="15%" />

      <div className="relative z-10 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-gradient text-3xl font-black sm:text-4xl">Break Mini Games</h1>
          <p className="mt-2 text-slate-300">
            Quick educational games unlock inside break mode. If break mode is not active yet, starting any game launches a 5-minute break automatically.
          </p>
        </motion.div>

        <GlowingCard glowColor="amber">
          <CardTitle className="text-white">Total Score</CardTitle>
          <CardDescription>{topPlayerLabel}</CardDescription>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-3">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Your total</p>
              <p className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text font-heading text-4xl font-black text-transparent">
                {animatedTotalScore}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
              Break mode: <span className={canPlay ? 'text-emerald-300' : 'text-amber-200'}>{canPlay ? 'active' : 'not active'}</span>
            </div>
            {!canPlay ? (
              <Button variant="secondary" onClick={activateBreakMode}>
                Start 5-minute break
              </Button>
            ) : null}
          </div>
          {statusMessage ? (
            <p className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100">
              {statusMessage}
            </p>
          ) : null}
        </GlowingCard>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {games.map((game, index) => (
            <GameCard
              key={game.name}
              game={game}
              delay={index * 0.08}
              bestScore={bestScores[game.name] ?? 0}
              canPlay={canPlay}
              onPlay={() => openGame(game)}
            />
          ))}
        </div>

        <GlowingCard glowColor="cyan">
          <CardTitle className="text-white">Leaderboard</CardTitle>
          <CardDescription className="mb-5">Top performers from the live backend.</CardDescription>
          {leaderboardLoading ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
              Loading leaderboard...
            </div>
          ) : leaderboard.length ? (
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={`${entry.user_id}-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ x: 4, scale: 1.01 }}
                  className={`flex items-center justify-between rounded-2xl border p-4 transition-all ${
                    index === 0
                      ? 'border-amber-400/30 bg-gradient-to-r from-amber-500/20 to-orange-500/10'
                      : index === 1
                        ? 'border-slate-400/30 bg-gradient-to-r from-slate-400/20 to-slate-500/10'
                        : index === 2
                          ? 'border-orange-400/30 bg-gradient-to-r from-orange-600/20 to-orange-700/10'
                          : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold ${
                        index === 0
                          ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
                          : index === 1
                            ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-white'
                            : index === 2
                              ? 'bg-gradient-to-br from-orange-500 to-orange-700 text-white'
                              : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      #{index + 1}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-white">{entry.username}</p>
                      {user?.id === entry.user_id ? <p className="text-xs text-cyan-300">You</p> : null}
                    </div>
                  </div>
                  <p className="text-lg font-bold text-cyan-300">{entry.score}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
              No game scores have been recorded yet.
            </div>
          )}
        </GlowingCard>
      </div>

      <AnimatePresence>
        {activeGame && currentPrompt ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#050913]/80 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-[linear-gradient(160deg,rgba(8,12,28,0.96),rgba(12,20,44,0.92))] p-6 shadow-[0_30px_80px_rgba(3,7,22,0.45)]"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-white">{activeGame.name}</CardTitle>
                  <CardDescription className="mt-1">
                    Question {questionIndex + 1} of {activeGame.prompts.length} | Current score {currentScore}
                  </CardDescription>
                </div>
                <button
                  type="button"
                  onClick={closeGame}
                  className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:text-white"
                  aria-label="Close game"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-lg font-semibold text-white">{currentPrompt.prompt}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {currentPrompt.options.map((option, index) => (
                    <Button
                      key={option}
                      type="button"
                      variant="secondary"
                      onClick={() => void answerQuestion(index)}
                      className="justify-start px-4 py-5 text-left"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

