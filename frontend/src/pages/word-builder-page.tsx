import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import {
  Brain,
  Clock,
  Coins,
  Flame,
  Lightbulb,
  Settings,
  Shuffle,
  SkipForward,
  Star,
  Target,
  Trophy,
  Zap,
} from 'lucide-react'

import { AnswerInput } from '../components/word-builder/answer-input'
import { GameInfoPanel } from '../components/word-builder/game-info-panel'
import { GameModeSelector } from '../components/word-builder/game-mode-selector'
import { LetterTile } from '../components/word-builder/letter-tile'
import { LevelUpAnimation } from '../components/word-builder/level-up-animation'
import { PlayerStatsPanel } from '../components/word-builder/player-stats-panel'
import { SuccessAnimation } from '../components/word-builder/success-animation'
import { AnimatedGradientOrb } from '../components/ui/animated-gradient-orb'
import { Button } from '../components/ui/button'
import { FloatingShapes } from '../components/ui/floating-shapes'
import { ParticlesBackground } from '../components/ui/particles-background'

type GameMode = 'menu' | 'classic' | 'speed' | 'survival' | 'battle'
type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert'
type Category = 'science' | 'technology' | 'programming' | 'vocabulary' | 'history' | 'math' | 'general'

interface Puzzle {
  word: string
  scrambled: string
  category: Category
  difficulty: Difficulty
  hint: string
}

const puzzles: Puzzle[] = [
  {
    word: 'COMPUTER',
    scrambled: 'PTACMOUER',
    category: 'technology',
    difficulty: 'beginner',
    hint: 'Electronic device for processing data.',
  },
  {
    word: 'ALGORITHM',
    scrambled: 'MHGLORAIT',
    category: 'programming',
    difficulty: 'intermediate',
    hint: 'Step-by-step procedure for calculations.',
  },
  {
    word: 'PHOTOSYNTHESIS',
    scrambled: 'YSSHTNPOHOTIES',
    category: 'science',
    difficulty: 'advanced',
    hint: 'Process plants use to make food.',
  },
  {
    word: 'MATHEMATICS',
    scrambled: 'THMACAMITES',
    category: 'math',
    difficulty: 'intermediate',
    hint: 'Study of numbers and shapes.',
  },
  {
    word: 'REVOLUTION',
    scrambled: 'NOLTUVOIER',
    category: 'history',
    difficulty: 'intermediate',
    hint: 'Fundamental change in society.',
  },
  {
    word: 'VOCABULARY',
    scrambled: 'YBCALUARVO',
    category: 'vocabulary',
    difficulty: 'beginner',
    hint: 'Collection of words.',
  },
  {
    word: 'QUANTUM',
    scrambled: 'TMUQANU',
    category: 'science',
    difficulty: 'advanced',
    hint: 'Smallest unit of energy.',
  },
  {
    word: 'DATABASE',
    scrambled: 'AABTSADE',
    category: 'technology',
    difficulty: 'beginner',
    hint: 'Organized collection of data.',
  },
]

function randomPuzzle(previousWord?: string) {
  const pool = previousWord ? puzzles.filter((puzzle) => puzzle.word !== previousWord) : puzzles
  return pool[Math.floor(Math.random() * pool.length)] ?? puzzles[0]
}

function shuffleArray<T>(items: T[]) {
  const next = [...items]
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
  }
  return next
}

function playTone(sound: 'move' | 'correct' | 'wrong' | 'levelup') {
  if (typeof window === 'undefined' || !window.AudioContext) {
    return
  }

  const context = new window.AudioContext()
  const oscillator = context.createOscillator()
  const gain = context.createGain()

  const toneMap = {
    move: { frequency: 440, duration: 0.08 },
    correct: { frequency: 740, duration: 0.14 },
    wrong: { frequency: 220, duration: 0.12 },
    levelup: { frequency: 880, duration: 0.2 },
  } as const

  oscillator.type = sound === 'wrong' ? 'sawtooth' : 'sine'
  oscillator.frequency.value = toneMap[sound].frequency
  gain.gain.value = 0.03
  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start()
  oscillator.stop(context.currentTime + toneMap[sound].duration)
  window.setTimeout(() => void context.close(), 220)
}

export function WordBuilderPage() {
  const [gameMode, setGameMode] = useState<GameMode>('menu')
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle>(puzzles[0])
  const [scrambledLetters, setScrambledLetters] = useState<string[]>(() => puzzles[0].scrambled.split(''))
  const [selectedLetters, setSelectedLetters] = useState<string[]>([])
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [solvedCount, setSolvedCount] = useState(0)
  const [level, setLevel] = useState(1)
  const [xp, setXp] = useState(0)
  const [xpToNextLevel, setXpToNextLevel] = useState(100)
  const [streak, setStreak] = useState(0)
  const [combo, setCombo] = useState(1)
  const [coins, setCoins] = useState(50)
  const [hints, setHints] = useState(3)
  const [timeLeft, setTimeLeft] = useState(60)
  const [totalAttempts, setTotalAttempts] = useState(0)
  const [correctAttempts, setCorrectAttempts] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [lastReward, setLastReward] = useState(0)

  const accuracy = useMemo(
    () => (totalAttempts === 0 ? 0 : Math.round((correctAttempts / totalAttempts) * 100)),
    [correctAttempts, totalAttempts],
  )

  useEffect(() => {
    if (gameMode !== 'speed' || timeLeft <= 0) {
      return
    }

    const timer = window.setInterval(() => {
      setTimeLeft((previous) => {
        const next = Math.max(0, previous - 1)
        if (next === 0) {
          window.setTimeout(() => setGameMode('menu'), 0)
        }
        return next
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [gameMode, timeLeft])

  function playSound(type: 'move' | 'correct' | 'wrong' | 'levelup') {
    if (!soundEnabled) {
      return
    }

    playTone(type)
  }

  function loadPuzzle(nextPuzzle: Puzzle) {
    setCurrentPuzzle(nextPuzzle)
    setScrambledLetters(nextPuzzle.scrambled.split(''))
    setSelectedLetters([])
    setAnswer('')
    setShowHint(false)
  }

  function selectLetter(letter: string, index: number) {
    setSelectedLetters((previous) => [...previous, letter])
    setAnswer((previous) => previous + letter)
    setScrambledLetters((previous) => previous.filter((_, currentIndex) => currentIndex !== index))
    playSound('move')
  }

  function deselectLetter(index: number) {
    const letter = selectedLetters[index]
    if (!letter) {
      return
    }

    setSelectedLetters((previous) => previous.filter((_, currentIndex) => currentIndex !== index))
    setAnswer((previous) => previous.slice(0, index) + previous.slice(index + 1))
    setScrambledLetters((previous) => [...previous, letter])
    playSound('move')
  }

  function shuffleLetters() {
    setScrambledLetters((previous) => shuffleArray(previous))
    playSound('move')
  }

  function useHint() {
    if (hints <= 0) {
      return
    }

    setHints((previous) => previous - 1)
    setShowHint(true)
    window.setTimeout(() => setShowHint(false), 5000)
  }

  function skipPuzzle() {
    loadPuzzle(randomPuzzle(currentPuzzle.word))
    setStreak(0)
    setCombo(1)
  }

  function submitAnswer() {
    setTotalAttempts((previous) => previous + 1)

    if (answer.toUpperCase() === currentPuzzle.word) {
      const nextStreak = streak + 1
      const nextCombo = Math.min(combo + 0.5, 5)
      const basePoints = 100
      const comboBonus = Math.floor(basePoints * (nextCombo - 1))
      const streakBonus = nextStreak * 10
      const totalPoints = basePoints + comboBonus + streakBonus
      const nextScore = score + totalPoints

      playSound('correct')
      setCorrectAttempts((previous) => previous + 1)
      setStreak(nextStreak)
      setCombo(nextCombo)
      setScore(nextScore)
      setBestScore((previous) => Math.max(previous, nextScore))
      setSolvedCount((previous) => previous + 1)
      setLastReward(totalPoints)
      setCoins((previous) => previous + 10)

      setXp((previous) => {
        const updatedXp = previous + totalPoints
        if (updatedXp >= xpToNextLevel) {
          setLevel((currentLevel) => currentLevel + 1)
          setXpToNextLevel((currentTarget) => Math.floor(currentTarget * 1.5))
          setShowLevelUp(true)
          playSound('levelup')
          window.setTimeout(() => setShowLevelUp(false), 3000)
          return updatedXp - xpToNextLevel
        }
        return updatedXp
      })

      setShowSuccess(true)
      window.setTimeout(() => {
        setShowSuccess(false)
        loadPuzzle(randomPuzzle(currentPuzzle.word))
      }, 1800)
      return
    }

    playSound('wrong')
    setLastReward(0)
    setStreak(0)
    setCombo(1)

    if (gameMode === 'survival') {
      setGameMode('menu')
      return
    }

    setAnswer('')
    setSelectedLetters([])
    setScrambledLetters(currentPuzzle.scrambled.split(''))
  }

  if (gameMode === 'menu') {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <ParticlesBackground />
        <FloatingShapes />
        <AnimatedGradientOrb
          className="left-10 top-20"
          colors={['rgba(139, 92, 246, 0.3)', 'rgba(167, 139, 250, 0.2)']}
          size="lg"
          delay={0}
        />
        <AnimatedGradientOrb
          className="bottom-20 right-10"
          colors={['rgba(34, 211, 238, 0.3)', 'rgba(56, 189, 248, 0.2)']}
          size="lg"
          delay={1}
        />

        <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-6xl">
            <div className="mb-12 text-center">
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6 inline-flex items-center gap-3 rounded-full border border-violet-300/20 bg-violet-400/10 px-6 py-3"
              >
                <Brain className="h-6 w-6 text-violet-300" />
                <span className="text-lg font-bold uppercase tracking-wider text-violet-200">Brain Training Arena</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6 text-6xl font-black text-white sm:text-7xl lg:text-8xl"
              >
                Word <span className="text-gradient">Builder</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-slate-300"
              >
                Unscramble letters, build words, and train your pattern recognition.
              </motion.p>
            </div>

            <GameModeSelector onSelectMode={setGameMode} />
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden pb-6">
      <ParticlesBackground />
      <FloatingShapes />
      <AnimatedGradientOrb
        className="left-10 top-20"
        colors={['rgba(139, 92, 246, 0.2)', 'rgba(167, 139, 250, 0.15)']}
        size="md"
        delay={0}
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <Button variant="secondary" size="sm" onClick={() => setGameMode('menu')}>
            Back to Menu
          </Button>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 p-2">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Word Builder Arena</h2>
              <p className="text-xs capitalize text-slate-400">{gameMode} mode</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-amber-300/20 bg-amber-400/10 px-4 py-2">
            <Coins className="h-4 w-4 text-amber-300" />
            <span className="font-bold text-amber-200">{coins}</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-2">
            <Star className="h-4 w-4 text-cyan-300" />
            <span className="font-bold text-cyan-200">Lvl {level}</span>
          </div>
          <button
            type="button"
            onClick={() => setSoundEnabled((previous) => !previous)}
            className="rounded-xl border border-white/10 bg-white/5 p-2 transition hover:bg-white/10"
          >
            <Settings className="h-4 w-4 text-white" />
          </button>
        </div>
      </motion.div>

      <div className="relative z-10 grid gap-4 lg:grid-cols-[300px_1fr_300px]">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <GameInfoPanel
            category={currentPuzzle.category}
            difficulty={currentPuzzle.difficulty}
            streak={streak}
            solvedCount={solvedCount}
            score={score}
            bestScore={bestScore}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div className="glass-panel relative overflow-hidden p-6 sm:p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-cyan-500/10" />

            <div className="relative">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-violet-500/20 p-2">
                    <Target className="h-5 w-5 text-violet-300" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Unscramble the word</p>
                    <p className="text-xs capitalize text-slate-500">{currentPuzzle.category}</p>
                  </div>
                </div>
                {gameMode === 'speed' ? (
                  <div className="flex items-center gap-2 rounded-xl border border-red-300/20 bg-red-400/10 px-4 py-2">
                    <Clock className="h-4 w-4 text-red-300" />
                    <span className="font-mono text-lg font-bold text-red-200">{timeLeft}s</span>
                  </div>
                ) : null}
              </div>

              <div className="mb-6 flex flex-wrap justify-center gap-2 sm:gap-3">
                {scrambledLetters.map((letter, index) => (
                  <LetterTile
                    key={`scrambled-${letter}-${index}`}
                    letter={letter}
                    onClick={() => selectLetter(letter, index)}
                    glowColor="violet"
                  />
                ))}
              </div>

              <AnswerInput letters={selectedLetters} onRemoveLetter={deselectLetter} />

              <AnimatePresence>
                {showHint ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 rounded-xl border border-cyan-300/20 bg-cyan-400/10 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 shrink-0 text-cyan-300" />
                      <p className="text-sm text-cyan-200">{currentPuzzle.hint}</p>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Button variant="secondary" onClick={shuffleLetters} className="gap-2">
                  <Shuffle className="h-4 w-4" />
                  Shuffle
                </Button>
                <Button variant="secondary" onClick={useHint} disabled={hints === 0} className="gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Hint ({hints})
                </Button>
                <Button variant="secondary" onClick={skipPuzzle} className="gap-2">
                  <SkipForward className="h-4 w-4" />
                  Skip
                </Button>
                <Button
                  onClick={submitAnswer}
                  disabled={answer.length === 0 || (gameMode === 'speed' && timeLeft === 0)}
                  className="gap-2 bg-gradient-to-r from-violet-500 to-purple-600"
                >
                  <Zap className="h-4 w-4" />
                  Submit
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="glass-panel p-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-300" />
                <span className="text-xs text-slate-400">Score</span>
              </div>
              <p className="mt-1 text-2xl font-black text-white">{score}</p>
            </div>
            <div className="glass-panel p-4">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-300" />
                <span className="text-xs text-slate-400">Streak</span>
              </div>
              <p className="mt-1 text-2xl font-black text-white">{streak}</p>
            </div>
            <div className="glass-panel p-4">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-cyan-300" />
                <span className="text-xs text-slate-400">Combo</span>
              </div>
              <p className="mt-1 text-2xl font-black text-white">x{combo.toFixed(1)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <PlayerStatsPanel level={level} xp={xp} xpToNextLevel={xpToNextLevel} streak={streak} combo={combo} accuracy={accuracy} />
        </motion.div>
      </div>

      <SuccessAnimation show={showSuccess} score={lastReward} />
      <LevelUpAnimation show={showLevelUp} level={level} />
    </div>
  )
}
