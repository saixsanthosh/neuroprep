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
type Category = 'science' | 'technology' | 'programming' | 'english' | 'history' | 'mathematics' | 'general-knowledge'

type Tile = {
  id: string
  letter: string
}

type Puzzle = {
  word: string
  scrambled: string
  category: Category
  difficulty: Difficulty
  hint: string
}

type LeaderboardEntry = {
  name: string
  score: number
}

const XP_PER_CORRECT = 100
const XP_PER_LEVEL = 100
const HINT_COST = 50
const COIN_REWARD = 10
const STORAGE_KEY = 'neuroprep_word_builder_leaderboard_v2'

const puzzles: Puzzle[] = [
  { word: 'COMPUTER', scrambled: 'PTACMOEUR', category: 'technology', difficulty: 'beginner', hint: 'Electronic machine for processing information.' },
  { word: 'PYTHON', scrambled: 'TNYHOP', category: 'programming', difficulty: 'beginner', hint: 'Popular programming language known for readability.' },
  { word: 'JAVASCRIPT', scrambled: 'VCIAJSRAPT', category: 'programming', difficulty: 'intermediate', hint: 'The scripting language of the web.' },
  { word: 'DATABASE', scrambled: 'TAADBSAE', category: 'technology', difficulty: 'beginner', hint: 'Structured system for storing data.' },
  { word: 'ALGORITHM', scrambled: 'LMGHORAIT', category: 'science', difficulty: 'advanced', hint: 'Step-by-step method for solving a problem.' },
  { word: 'FUNCTION', scrambled: 'NFUCTION', category: 'mathematics', difficulty: 'intermediate', hint: 'A relation that maps each input to one output.' },
  { word: 'ARRAY', scrambled: 'RAAVY', category: 'english', difficulty: 'beginner', hint: 'Ordered collection of values in programming.' },
  { word: 'OBJECT', scrambled: 'JBTOCE', category: 'general-knowledge', difficulty: 'intermediate', hint: 'A thing, item, or structured instance in code.' },
]

function buildTiles(scrambled: string): Tile[] {
  return scrambled.split('').map((letter, index) => ({ id: `${letter}-${index}-${crypto.randomUUID()}`, letter }))
}

function randomPuzzle(previousWord?: string) {
  const pool = previousWord ? puzzles.filter((puzzle) => puzzle.word !== previousWord) : puzzles
  return pool[Math.floor(Math.random() * pool.length)] ?? puzzles[0]
}

function shuffleTiles(items: Tile[]) {
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

function readLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as LeaderboardEntry[]) : []
  } catch {
    return []
  }
}

export function WordBuilderPage() {
  const [gameMode, setGameMode] = useState<GameMode>('menu')
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle>(puzzles[0])
  const [scrambledTiles, setScrambledTiles] = useState<Tile[]>(() => buildTiles(puzzles[0].scrambled))
  const [answerTiles, setAnswerTiles] = useState<Tile[]>([])
  const [draggedTileId, setDraggedTileId] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [solvedCount, setSolvedCount] = useState(0)
  const [level, setLevel] = useState(1)
  const [xp, setXp] = useState(0)
  const [streak, setStreak] = useState(0)
  const [combo, setCombo] = useState(1)
  const [coins, setCoins] = useState(100)
  const [timeLeft, setTimeLeft] = useState(60)
  const [totalAttempts, setTotalAttempts] = useState(0)
  const [correctAttempts, setCorrectAttempts] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [lastReward, setLastReward] = useState(0)
  const [botScore, setBotScore] = useState(0)
  const [botAccuracy, setBotAccuracy] = useState(72)
  const [gameOverMessage, setGameOverMessage] = useState<string | null>(null)
  const [storedLeaderboard, setStoredLeaderboard] = useState<LeaderboardEntry[]>(() => readLeaderboard())

  const answer = useMemo(() => answerTiles.map((tile) => tile.letter).join(''), [answerTiles])
  const accuracy = useMemo(
    () => (totalAttempts === 0 ? 0 : Math.round((correctAttempts / totalAttempts) * 100)),
    [correctAttempts, totalAttempts],
  )
  const xpToNextLevel = XP_PER_LEVEL

  const leaderboard = useMemo(() => {
    const current = score > 0 ? [{ name: gameMode === 'battle' ? 'You' : 'Current Run', score }] : []
    const battleBot = gameMode === 'battle' ? [{ name: 'Bot Sigma', score: botScore }] : []
    const merged = [...current, ...battleBot, ...storedLeaderboard]
      .sort((left, right) => right.score - left.score)
      .slice(0, 5)

    return merged.length > 0 ? merged : [{ name: 'No scores yet', score: 0 }]
  }, [botScore, gameMode, score, storedLeaderboard])

  useEffect(() => {
    if ((gameMode !== 'speed' && gameMode !== 'battle') || timeLeft <= 0 || gameOverMessage) {
      return
    }

    const timer = window.setInterval(() => {
      setTimeLeft((previous) => {
        const next = Math.max(0, previous - 1)
        if (next === 0) {
          window.setTimeout(() => {
            setGameOverMessage(
              gameMode === 'battle'
                ? score >= botScore
                  ? `Time. You win ${score} to ${botScore}.`
                  : `Time. Bot Sigma wins ${botScore} to ${score}.`
                : `Time. You solved ${solvedCount} puzzle${solvedCount === 1 ? '' : 's'}.`,
            )
          }, 0)
        }
        return next
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [botScore, gameMode, gameOverMessage, score, solvedCount, timeLeft])

  useEffect(() => {
    if (gameMode !== 'battle' || timeLeft <= 0 || gameOverMessage) {
      return
    }

    const botInterval = window.setInterval(() => {
      setBotScore((previous) => previous + 60 + Math.floor(Math.random() * 60))
      setBotAccuracy(68 + Math.floor(Math.random() * 22))
    }, 4200)

    return () => window.clearInterval(botInterval)
  }, [gameMode, gameOverMessage, timeLeft])

  function playSound(type: 'move' | 'correct' | 'wrong' | 'levelup') {
    if (!soundEnabled) {
      return
    }

    playTone(type)
  }

  function recordLeaderboard(nextScore: number) {
    if (typeof window === 'undefined' || nextScore <= 0) {
      return
    }

    const nextLeaderboard = [...storedLeaderboard, { name: `Run ${storedLeaderboard.length + 1}`, score: nextScore }]
      .sort((left, right) => right.score - left.score)
      .slice(0, 5)

    setStoredLeaderboard(nextLeaderboard)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextLeaderboard))
  }

  function resetBoard(nextPuzzle: Puzzle) {
    setCurrentPuzzle(nextPuzzle)
    setScrambledTiles(buildTiles(nextPuzzle.scrambled))
    setAnswerTiles([])
    setDraggedTileId(null)
    setShowHint(false)
  }

  function startMode(mode: Exclude<GameMode, 'menu'>) {
    setGameMode(mode)
    setScore(0)
    setSolvedCount(0)
    setLevel(1)
    setXp(0)
    setStreak(0)
    setCombo(1)
    setCoins(100)
    setTotalAttempts(0)
    setCorrectAttempts(0)
    setLastReward(0)
    setBotScore(0)
    setBotAccuracy(72)
    setTimeLeft(mode === 'classic' ? 0 : 60)
    setGameOverMessage(null)
    resetBoard(randomPuzzle())
  }

  function moveTileToAnswer(tileId: string) {
    const tile = scrambledTiles.find((item) => item.id === tileId)
    if (!tile) {
      return
    }

    setScrambledTiles((previous) => previous.filter((item) => item.id !== tileId))
    setAnswerTiles((previous) => [...previous, tile])
    setDraggedTileId(null)
    playSound('move')
  }

  function moveTileBackToPool(index: number) {
    const tile = answerTiles[index]
    if (!tile) {
      return
    }

    setAnswerTiles((previous) => previous.filter((_, currentIndex) => currentIndex !== index))
    setScrambledTiles((previous) => [...previous, tile])
    playSound('move')
  }

  function shuffleLetters() {
    setScrambledTiles((previous) => shuffleTiles(previous))
    playSound('move')
  }

  function useHint() {
    if (coins < HINT_COST || showHint) {
      return
    }

    setCoins((previous) => previous - HINT_COST)
    setShowHint(true)
    window.setTimeout(() => setShowHint(false), 5000)
  }

  function skipPuzzle() {
    resetBoard(randomPuzzle(currentPuzzle.word))
    setStreak(0)
    setCombo(1)
  }

  function finishRound(message: string) {
    recordLeaderboard(score)
    setGameOverMessage(message)
  }

  function submitAnswer() {
    if (gameOverMessage) {
      return
    }

    setTotalAttempts((previous) => previous + 1)

    if (answer.toUpperCase() === currentPuzzle.word) {
      const nextStreak = streak + 1
      const nextCombo = Math.min(combo + 0.5, 5)
      const reward = Math.floor(100 * nextCombo)
      const nextScore = score + reward
      const totalXp = xp + XP_PER_CORRECT
      const levelUps = Math.floor(totalXp / XP_PER_LEVEL)
      const levelProgress = totalXp % XP_PER_LEVEL
      const nextLevel = 1 + levelUps

      playSound('correct')
      setCorrectAttempts((previous) => previous + 1)
      setStreak(nextStreak)
      setCombo(nextCombo)
      setScore(nextScore)
      setSolvedCount((previous) => previous + 1)
      setLastReward(XP_PER_CORRECT)
      setCoins((previous) => previous + COIN_REWARD)
      setXp(levelProgress)

      if (nextLevel > level) {
        setLevel(nextLevel)
        setShowLevelUp(true)
        playSound('levelup')
        window.setTimeout(() => setShowLevelUp(false), 3000)
      }

      setShowSuccess(true)
      window.setTimeout(() => {
        setShowSuccess(false)
        resetBoard(randomPuzzle(currentPuzzle.word))
      }, 1800)
      return
    }

    playSound('wrong')
    setLastReward(0)
    setStreak(0)
    setCombo(1)

    if (gameMode === 'survival') {
      finishRound(`Run ended. Final score: ${score}.`)
      return
    }

    setAnswerTiles([])
    setScrambledTiles(buildTiles(currentPuzzle.scrambled))
  }

  if (gameMode === 'menu') {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <ParticlesBackground />
        <FloatingShapes />
        <AnimatedGradientOrb className="left-10 top-20" colors={['rgba(139, 92, 246, 0.3)', 'rgba(167, 139, 250, 0.2)']} size="lg" delay={0} />
        <AnimatedGradientOrb className="bottom-20 right-10" colors={['rgba(34, 211, 238, 0.3)', 'rgba(56, 189, 248, 0.2)']} size="lg" delay={1} />

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
                Premium brain-training with glowing tiles, drag-and-drop answers, and competitive scoring.
              </motion.p>
            </div>

            <GameModeSelector onSelectMode={startMode} />
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden pb-6">
      <ParticlesBackground />
      <FloatingShapes />
      <AnimatedGradientOrb className="left-10 top-20" colors={['rgba(139, 92, 246, 0.2)', 'rgba(167, 139, 250, 0.15)']} size="md" delay={0} />

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
          <button type="button" onClick={() => setSoundEnabled((previous) => !previous)} className="rounded-xl border border-white/10 bg-white/5 p-2 transition hover:bg-white/10">
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
            leaderboard={leaderboard}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="space-y-4">
          <div className="glass-panel relative overflow-hidden p-6 sm:p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-cyan-500/10" />

            <div className="relative">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-violet-500/20 p-2">
                    <Target className="h-5 w-5 text-violet-300" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Unscramble the word</p>
                    <p className="text-xs capitalize text-slate-500">{currentPuzzle.category.replace('-', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {gameMode === 'speed' || gameMode === 'battle' ? (
                    <div className="flex items-center gap-2 rounded-xl border border-red-300/20 bg-red-400/10 px-4 py-2">
                      <Clock className="h-4 w-4 text-red-300" />
                      <span className="font-mono text-lg font-bold text-red-200">{timeLeft}s</span>
                    </div>
                  ) : null}
                  {gameMode === 'battle' ? (
                    <div className="rounded-xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
                      Bot Sigma: <span className="font-bold">{botScore}</span>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-5 transition">
                <div className="mb-4 text-center text-xs uppercase tracking-[0.22em] text-slate-500">Available letters</div>
                <div className="flex min-h-[124px] flex-wrap justify-center gap-2 sm:gap-3">
                  {scrambledTiles.map((tile) => (
                    <LetterTile
                      key={tile.id}
                      id={tile.id}
                      letter={tile.letter}
                      draggable
                      onDragStart={(id) => setDraggedTileId(id)}
                      onDragEnd={() => setDraggedTileId(null)}
                      onClick={() => moveTileToAnswer(tile.id)}
                      glowColor="violet"
                    />
                  ))}
                </div>
              </div>

              <AnswerInput
                letters={answerTiles}
                onRemoveLetter={moveTileBackToPool}
                onDropLetter={() => {
                  if (draggedTileId) {
                    moveTileToAnswer(draggedTileId)
                  }
                }}
                isDragOver={Boolean(draggedTileId)}
              />

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
                <Button variant="secondary" onClick={useHint} disabled={coins < HINT_COST || showHint} className="gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Hint (50)
                </Button>
                <Button variant="secondary" onClick={skipPuzzle} className="gap-2">
                  <SkipForward className="h-4 w-4" />
                  Skip
                </Button>
                <Button onClick={submitAnswer} disabled={answerTiles.length === 0 || Boolean(gameOverMessage)} className="gap-2 bg-gradient-to-r from-violet-500 to-purple-600">
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

          {gameMode === 'battle' ? (
            <div className="glass-panel grid gap-3 p-4 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Bot pressure</p>
                <p className="mt-1 text-2xl font-black text-white">{botScore}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Bot accuracy</p>
                <p className="mt-1 text-2xl font-black text-white">{botAccuracy}%</p>
              </div>
            </div>
          ) : null}
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <PlayerStatsPanel level={level} xp={xp} xpToNextLevel={xpToNextLevel} streak={streak} combo={combo} accuracy={accuracy} />
        </motion.div>
      </div>

      <SuccessAnimation show={showSuccess} score={lastReward} />
      <LevelUpAnimation show={showLevelUp} level={level} />

      <AnimatePresence>
        {gameOverMessage ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-[linear-gradient(160deg,rgba(8,12,28,0.96),rgba(12,20,44,0.92))] p-8 shadow-[0_30px_80px_rgba(3,7,22,0.45)]"
            >
              <h3 className="text-3xl font-black text-white">Round Complete</h3>
              <p className="mt-3 text-base leading-7 text-slate-300">{gameOverMessage}</p>
              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Score</p>
                  <p className="mt-2 text-2xl font-black text-white">{score}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Solved</p>
                  <p className="mt-2 text-2xl font-black text-white">{solvedCount}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Accuracy</p>
                  <p className="mt-2 text-2xl font-black text-white">{accuracy}%</p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={() => startMode(gameMode)} className="bg-gradient-to-r from-violet-500 to-purple-600 text-white">Play Again</Button>
                <Button variant="secondary" onClick={() => setGameMode('menu')}>Back to Menu</Button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
