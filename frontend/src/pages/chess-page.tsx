/* eslint-disable react-hooks/preserve-manual-memoization */
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Chess, type Move, type Square } from 'chess.js'
import {
  Bot,
  Check,
  Copy,
  Crown,
  RotateCcw,
  Sparkles,
  Users,
  Volume2,
  VolumeX,
} from 'lucide-react'

import { ChessBoard } from '../components/chess/chess-board'
import { getBestMove, getHintMove, type ChessDifficulty } from '../components/chess/chess-ai'
import { DifficultySelector } from '../components/chess/difficulty-selector'
import { GameControls } from '../components/chess/game-controls'
import { MoveHistory } from '../components/chess/move-history'
import { PlayerPanel } from '../components/chess/player-panel'
import { ThemeSelector } from '../components/chess/theme-selector'
import { AnimatedGradientOrb } from '../components/ui/animated-gradient-orb'
import { Button } from '../components/ui/button'
import { FloatingShapes } from '../components/ui/floating-shapes'
import { GlowingCard } from '../components/ui/glowing-card'

type GameMode = 'menu' | 'ai' | 'local'
type BoardTheme = 'classic' | 'wood' | 'neon' | 'glass' | 'marble'
type ChessSide = 'white' | 'black'
type HighlightMove = { from: Square; to: Square }
type PromotionChoice = 'q' | 'r' | 'b' | 'n'
type PromotionState = { from: Square; to: Square; color: 'w' | 'b' } | null

type SavedChessState = {
  gameMode: Exclude<GameMode, 'menu'>
  boardTheme: BoardTheme
  difficulty: ChessDifficulty
  soundEnabled: boolean
  pgn: string
  whiteTime: number
  blackTime: number
}

const DEFAULT_TIME = 10 * 60
const STORAGE_KEY = 'neuroprep_chess_state_v2'
const promotionChoices: PromotionChoice[] = ['q', 'r', 'b', 'n']
const capturedPieceSymbols = {
  w: {
    p: '\u2659',
    n: '\u2658',
    b: '\u2657',
    r: '\u2656',
    q: '\u2655',
  },
  b: {
    p: '\u265F',
    n: '\u265E',
    b: '\u265D',
    r: '\u265C',
    q: '\u265B',
  },
} as const

function readSavedChessState(): SavedChessState | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SavedChessState) : null
  } catch {
    return null
  }
}

function sideLabel(side: ChessSide) {
  return side === 'white' ? 'White' : 'Black'
}

function buildCaptured(history: Move[]) {
  const white: string[] = []
  const black: string[] = []

  for (const move of history) {
    if (!move.captured) continue
    const capturedColor = move.color === 'w' ? 'b' : 'w'
    const symbol = capturedPieceSymbols[capturedColor][move.captured as keyof typeof capturedPieceSymbols.b]
    if (!symbol) continue
    if (move.color === 'w') {
      white.push(symbol)
    } else {
      black.push(symbol)
    }
  }

  return { white, black }
}

function findCheckedKingSquare(game: Chess) {
  if (!game.isCheck()) {
    return null
  }

  const checkedColor = game.turn()
  for (const row of game.board()) {
    for (const piece of row) {
      if (piece?.type === 'k' && piece.color === checkedColor) {
        return piece.square as Square
      }
    }
  }

  return null
}

function buildAnalysis(game: Chess, moves: string[], whiteCaptures: string[], blackCaptures: string[], result: string | null) {
  const moveCount = Math.max(1, Math.ceil(moves.length / 2))
  const resultLine = result ?? (game.isGameOver() ? 'The game is complete.' : 'The battle is still live.')
  const captureEdge =
    whiteCaptures.length === blackCaptures.length
      ? 'Material stayed balanced for most of the game.'
      : whiteCaptures.length > blackCaptures.length
        ? 'White won more material and controlled the exchanges.'
        : 'Black won more material and converted that edge.'

  return `${resultLine} ${captureEdge} ${moveCount} full moves were played. Review the final five plies in the move log to identify the turning point.`
}

function nextSoundForMove(game: Chess, move: Move) {
  if (game.isCheckmate()) return 'win'
  if (move.captured) return 'capture'
  if (game.isCheck()) return 'check'
  return 'move'
}

function toneConfig(sound: string) {
  if (sound === 'capture') return { frequency: 220, duration: 0.12 }
  if (sound === 'check') return { frequency: 640, duration: 0.16 }
  if (sound === 'win') return { frequency: 880, duration: 0.25 }
  return { frequency: 440, duration: 0.1 }
}

export function ChessPage() {
  const savedState = useMemo(() => readSavedChessState(), [])
  const initialGame = useMemo(() => {
    const game = new Chess()
    if (savedState?.pgn) {
      try {
        game.loadPgn(savedState.pgn)
      } catch {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(STORAGE_KEY)
        }
      }
    }
    return game
  }, [savedState])
  const gameRef = useRef(initialGame)
  const audioContextRef = useRef<AudioContext | null>(null)

  const [gameMode, setGameMode] = useState<GameMode>(savedState?.gameMode ?? 'menu')
  const [boardTheme, setBoardTheme] = useState<BoardTheme>(savedState?.boardTheme ?? 'classic')
  const [difficulty, setDifficulty] = useState<ChessDifficulty>(savedState?.difficulty ?? 'intermediate')
  const [soundEnabled, setSoundEnabled] = useState(savedState?.soundEnabled ?? true)
  const [fen, setFen] = useState(initialGame.fen())
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null)
  const [legalTargets, setLegalTargets] = useState<Square[]>([])
  const [hintMove, setHintMove] = useState<HighlightMove | null>(null)
  const [hintText, setHintText] = useState('')
  const initialHistory = initialGame.history({ verbose: true }) as Move[]
  const initialCaptures = buildCaptured(initialHistory)
  const initialLastMove = initialHistory[initialHistory.length - 1]
  const [moves, setMoves] = useState<string[]>(initialHistory.map((move) => move.san))
  const [capturedByWhite, setCapturedByWhite] = useState<string[]>(initialCaptures.white)
  const [capturedByBlack, setCapturedByBlack] = useState<string[]>(initialCaptures.black)
  const [currentPlayer, setCurrentPlayer] = useState<ChessSide>(initialGame.turn() === 'w' ? 'white' : 'black')
  const [whiteTime, setWhiteTime] = useState(savedState?.whiteTime ?? DEFAULT_TIME)
  const [blackTime, setBlackTime] = useState(savedState?.blackTime ?? DEFAULT_TIME)
  const [gameStarted, setGameStarted] = useState(Boolean(savedState?.gameMode))
  const [gameResult, setGameResult] = useState<string | null>(null)
  const [analysisText, setAnalysisText] = useState(
    initialHistory.length
      ? buildAnalysis(initialGame, initialGame.history(), initialCaptures.white, initialCaptures.black, null)
      : 'Start a game to see endgame analysis and turning-point notes here.',
  )
  const [statusMessage, setStatusMessage] = useState(
    initialHistory.length ? `${sideLabel(initialGame.turn() === 'w' ? 'white' : 'black')} to move.` : 'Select a mode and start your next match.',
  )
  const [promotionState, setPromotionState] = useState<PromotionState>(null)
  const [isAITurning, setIsAITurning] = useState(false)
  const [copiedState, setCopiedState] = useState(false)
  const [checkSquare, setCheckSquare] = useState<Square | null>(findCheckedKingSquare(initialGame))
  const [lastMove, setLastMove] = useState<HighlightMove | null>(
    initialLastMove ? { from: initialLastMove.from as Square, to: initialLastMove.to as Square } : null,
  )

  const syncFromGame = useCallback((message?: string, overrideResult?: string | null) => {
    const game = gameRef.current
    const verboseHistory = game.history({ verbose: true }) as Move[]
    const captureState = buildCaptured(verboseHistory)
    const latestMove = verboseHistory[verboseHistory.length - 1]
    const activeResult =
      overrideResult ??
      (game.isCheckmate()
        ? `${sideLabel(game.turn() === 'w' ? 'black' : 'white')} wins by checkmate.`
        : game.isStalemate()
          ? 'Draw by stalemate.'
          : game.isThreefoldRepetition()
            ? 'Draw by repetition.'
            : game.isInsufficientMaterial()
              ? 'Draw by insufficient material.'
              : game.isDraw()
                ? 'Draw.'
                : null)

    setFen(game.fen())
    setMoves(verboseHistory.map((move) => move.san))
    setCapturedByWhite(captureState.white)
    setCapturedByBlack(captureState.black)
    setCurrentPlayer(game.turn() === 'w' ? 'white' : 'black')
    setLastMove(latestMove ? { from: latestMove.from as Square, to: latestMove.to as Square } : null)
    setCheckSquare(findCheckedKingSquare(game))
    setGameResult(activeResult)
    setAnalysisText(buildAnalysis(game, game.history(), captureState.white, captureState.black, activeResult))

    if (message) {
      setStatusMessage(message)
    } else if (activeResult) {
      setStatusMessage(activeResult)
    } else if (game.isCheck()) {
      setStatusMessage(`${sideLabel(game.turn() === 'w' ? 'white' : 'black')} is in check.`)
    } else {
      setStatusMessage(`${sideLabel(game.turn() === 'w' ? 'white' : 'black')} to move.`)
    }
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedSquare(null)
    setLegalTargets([])
    setPromotionState(null)
  }, [])

  const playSound = useCallback(
    async (sound: 'move' | 'capture' | 'check' | 'win') => {
      if (!soundEnabled || typeof window === 'undefined') {
        return
      }

      try {
        const audio = new Audio(`/sounds/${sound}.mp3`)
        audio.volume = sound === 'win' ? 0.55 : 0.35
        await audio.play()
        return
      } catch {
        if (!window.AudioContext) {
          return
        }
        const context = audioContextRef.current ?? new window.AudioContext()
        audioContextRef.current = context
        const oscillator = context.createOscillator()
        const gain = context.createGain()
        const { frequency, duration } = toneConfig(sound)
        oscillator.type = sound === 'win' ? 'triangle' : 'sine'
        oscillator.frequency.value = frequency
        gain.gain.value = 0.03
        oscillator.connect(gain)
        gain.connect(context.destination)
        oscillator.start()
        oscillator.stop(context.currentTime + duration)
      }
    },
    [soundEnabled],
  )

  const persistGame = useCallback(() => {
    if (typeof window === 'undefined') return
    if (!gameStarted || gameMode === 'menu') {
      window.localStorage.removeItem(STORAGE_KEY)
      return
    }

    const nextState: SavedChessState = {
      gameMode,
      boardTheme,
      difficulty,
      soundEnabled,
      pgn: gameRef.current.pgn(),
      whiteTime,
      blackTime,
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
  }, [blackTime, boardTheme, difficulty, gameMode, gameStarted, soundEnabled, whiteTime])

  const applyMove = useCallback(
    async (from: Square, to: Square, promotion?: PromotionChoice) => {
      const result = gameRef.current.move({ from, to, promotion }) as Move | null
      if (!result) {
        setStatusMessage('That move is not legal from the current position.')
        return false
      }

      clearSelection()
      setHintMove(null)
      setHintText('')
      syncFromGame(undefined)
      await playSound(nextSoundForMove(gameRef.current, result))

      if (gameRef.current.isGameOver()) {
        await playSound('win')
      }

      return true
    },
    [clearSelection, playSound, syncFromGame],
  )

  const resetBoard = useCallback(
    (nextMode: GameMode = 'menu', nextDifficulty: ChessDifficulty = difficulty) => {
      gameRef.current = new Chess()
      setGameMode(nextMode)
      setDifficulty(nextDifficulty)
      setFen(gameRef.current.fen())
      setSelectedSquare(null)
      setLegalTargets([])
      setLastMove(null)
      setHintMove(null)
      setHintText('')
      setMoves([])
      setCapturedByWhite([])
      setCapturedByBlack([])
      setCurrentPlayer('white')
      setWhiteTime(DEFAULT_TIME)
      setBlackTime(DEFAULT_TIME)
      setGameStarted(nextMode !== 'menu')
      setGameResult(null)
      setPromotionState(null)
      setIsAITurning(false)
      setCheckSquare(null)
      setAnalysisText('Start a game to see endgame analysis and turning-point notes here.')
      setStatusMessage(nextMode === 'menu' ? 'Select a mode and start your next match.' : 'White to move.')
      if (typeof window !== 'undefined' && nextMode === 'menu') {
        window.localStorage.removeItem(STORAGE_KEY)
      }
    },
    [difficulty],
  )

  const startAIGame = useCallback((selectedDifficulty: ChessDifficulty) => {
    resetBoard('ai', selectedDifficulty)
  }, [resetBoard])

  const startLocalGame = useCallback(() => {
    resetBoard('local')
  }, [resetBoard])

  const getTargetsForSquare = useCallback((square: Square) => {
    return (gameRef.current.moves({ square, verbose: true }) as Move[]).map((move) => move.to as Square)
  }, [])

  const handleSquareClick = useCallback(
    (square: Square) => {
      if (gameMode === 'menu' || gameResult || isAITurning) {
        return
      }

      const piece = gameRef.current.get(square)
      const turn = gameRef.current.turn()
      const humanLocked = gameMode === 'ai' && turn === 'b'
      if (humanLocked) {
        return
      }

      if (selectedSquare) {
        if (selectedSquare === square) {
          clearSelection()
          return
        }

        if (legalTargets.includes(square)) {
          const movingPiece = gameRef.current.get(selectedSquare)
          const needsPromotion = movingPiece?.type === 'p' && (square.endsWith('8') || square.endsWith('1'))
          if (needsPromotion) {
            setPromotionState({ from: selectedSquare, to: square, color: movingPiece.color })
            return
          }
          void applyMove(selectedSquare, square, movingPiece?.type === 'p' ? 'q' : undefined)
          return
        }

        if (piece && piece.color === turn) {
          setSelectedSquare(square)
          setLegalTargets(getTargetsForSquare(square))
          return
        }

        clearSelection()
        return
      }

      if (!piece || piece.color !== turn) {
        return
      }

      setSelectedSquare(square)
      setLegalTargets(getTargetsForSquare(square))
    },
    [applyMove, clearSelection, gameMode, gameResult, getTargetsForSquare, isAITurning, legalTargets, selectedSquare],
  )

  const handlePromotion = useCallback(
    (promotion: PromotionChoice) => {
      if (!promotionState) return
      void applyMove(promotionState.from, promotionState.to, promotion)
      setPromotionState(null)
    },
    [applyMove, promotionState],
  )

  const handleHint = useCallback(() => {
    const move = getHintMove(new Chess(gameRef.current.fen()), difficulty)
    if (!move) {
      setHintText('No legal hint available from this position.')
      setHintMove(null)
      return
    }

    setHintMove({ from: move.from as Square, to: move.to as Square })
    setHintText(`Suggested move: ${move.san}`)
  }, [difficulty])

  const handleUndo = useCallback(() => {
    const movesToUndo = gameMode === 'ai' ? 2 : 1
    let undone = 0
    while (undone < movesToUndo && gameRef.current.history().length > 0) {
      const reverted = gameRef.current.undo()
      if (!reverted) break
      undone += 1
    }

    if (undone === 0) {
      setStatusMessage('There is no move to undo.')
      return
    }

    setGameResult(null)
    setHintMove(null)
    setHintText('Last move reverted.')
    clearSelection()
    syncFromGame('Move reverted.')
  }, [clearSelection, gameMode, syncFromGame])

  const handleResign = useCallback(() => {
    const loser = gameRef.current.turn() === 'w' ? 'white' : 'black'
    const result = `${sideLabel(loser === 'white' ? 'black' : 'white')} wins by resignation.`
    setGameResult(result)
    setStatusMessage(result)
    setAnalysisText(buildAnalysis(gameRef.current, gameRef.current.history(), capturedByWhite, capturedByBlack, result))
    void playSound('win')
  }, [capturedByBlack, capturedByWhite, playSound])

  const copyPosition = useCallback(() => {
    void navigator.clipboard.writeText(gameRef.current.fen())
    setCopiedState(true)
    window.setTimeout(() => setCopiedState(false), 1500)
  }, [])

  useEffect(() => {
    persistGame()
  }, [persistGame, fen, moves.length])

  useEffect(() => {
    if (!gameStarted || gameMode !== 'ai' || gameResult || gameRef.current.isGameOver() || gameRef.current.turn() !== 'b') {
      return
    }

    const timer = window.setTimeout(() => {
      setIsAITurning(true)
      setStatusMessage('AI is evaluating the position...')
      const bestMove = getBestMove(new Chess(gameRef.current.fen()), difficulty)
      if (!bestMove) {
        setIsAITurning(false)
        return
      }

      const result = gameRef.current.move({
        from: bestMove.from,
        to: bestMove.to,
        promotion: (bestMove.promotion as PromotionChoice | undefined) ?? 'q',
      }) as Move | null

      if (result) {
        syncFromGame(undefined)
        void playSound(nextSoundForMove(gameRef.current, result))
        if (gameRef.current.isGameOver()) {
          void playSound('win')
        }
      }

      setIsAITurning(false)
    }, difficulty === 'advanced' ? 420 : 260)

    return () => window.clearTimeout(timer)
  }, [difficulty, gameMode, gameResult, gameStarted, playSound, syncFromGame, fen])

  useEffect(() => {
    if (!gameStarted || gameResult || gameMode === 'menu') {
      return
    }

    const interval = window.setInterval(() => {
      const turn = gameRef.current.turn()
      if (turn === 'w') {
        setWhiteTime((previous) => {
          if (previous <= 1) {
            const result = 'Black wins on time.'
            setGameResult(result)
            setStatusMessage(result)
            setAnalysisText(buildAnalysis(gameRef.current, gameRef.current.history(), capturedByWhite, capturedByBlack, result))
            void playSound('win')
            return 0
          }
          return previous - 1
        })
      } else {
        setBlackTime((previous) => {
          if (previous <= 1) {
            const result = 'White wins on time.'
            setGameResult(result)
            setStatusMessage(result)
            setAnalysisText(buildAnalysis(gameRef.current, gameRef.current.history(), capturedByWhite, capturedByBlack, result))
            void playSound('win')
            return 0
          }
          return previous - 1
        })
      }
    }, 1000)

    return () => window.clearInterval(interval)
  }, [capturedByBlack, capturedByWhite, gameMode, gameResult, gameStarted, playSound])

  const heroBadge = useMemo(() => {
    if (gameMode === 'ai') return `AI opponent | ${difficulty}`
    if (gameMode === 'local') return 'Local duel'
    return 'Premium chess arena'
  }, [difficulty, gameMode])

  if (gameMode === 'menu') {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <FloatingShapes />
        <AnimatedGradientOrb
          className="left-10 top-20"
          colors={['rgba(34, 211, 238, 0.2)', 'rgba(56, 189, 248, 0.15)']}
          size="lg"
          delay={0}
        />
        <AnimatedGradientOrb
          className="bottom-20 right-10"
          colors={['rgba(124, 58, 237, 0.2)', 'rgba(167, 139, 250, 0.15)']}
          size="lg"
          delay={1}
        />

        <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
            className="w-full max-w-5xl"
          >
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2">
                <Crown className="h-5 w-5 text-cyan-300" />
                <span className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200">Premium chess arena</span>
              </div>
              <h1 className="mb-4 text-5xl font-black text-white sm:text-6xl lg:text-7xl">
                NeuroPrep <span className="text-gradient">Chess</span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-slate-300">
                The old mini-games are gone. This is now the dedicated break-game experience: a full chess board with legal rules, timers, AI, hints, undo, and saved state.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <GlowingCard className="h-full cursor-pointer p-8" glowColor="rgba(124, 58, 237, 0.35)" onClick={() => setGameMode('ai')}>
                <div className="mb-6 inline-flex rounded-2xl bg-violet-500/20 p-4">
                  <Bot className="h-12 w-12 text-violet-300" />
                </div>
                <h2 className="mb-3 text-3xl font-bold text-white">Play vs AI</h2>
                <p className="mb-6 text-slate-300">
                  Choose a difficulty and play against a minimax-based opponent with legal move validation, promotion, castling, en passant, checkmate, and stalemate handling.
                </p>
                <div className="flex items-center gap-2 text-sm text-violet-300">
                  <Sparkles className="h-4 w-4" />
                  <span>Beginner, intermediate, and advanced</span>
                </div>
              </GlowingCard>

              <GlowingCard className="h-full cursor-pointer p-8" glowColor="rgba(34, 211, 238, 0.35)" onClick={startLocalGame}>
                <div className="mb-6 inline-flex rounded-2xl bg-cyan-500/20 p-4">
                  <Users className="h-12 w-12 text-cyan-300" />
                </div>
                <h2 className="mb-3 text-3xl font-bold text-white">Local Duel</h2>
                <p className="mb-6 text-slate-300">
                  Hand the board to another player and run a same-device chess match with timers, move log, capture tracking, and post-game analysis.
                </p>
                <div className="flex items-center gap-2 text-sm text-cyan-300">
                  <Sparkles className="h-4 w-4" />
                  <span>Pass-and-play on one board</span>
                </div>
              </GlowingCard>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (gameMode === 'ai' && !gameStarted) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <FloatingShapes />
        <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
          <DifficultySelector onSelect={startAIGame} onBack={() => resetBoard('menu')} />
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden pb-6">
      <FloatingShapes />
      <AnimatedGradientOrb
        className="left-10 top-20"
        colors={['rgba(34, 211, 238, 0.15)', 'rgba(56, 189, 248, 0.1)']}
        size="md"
        delay={0}
      />

      <div className="relative z-10 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" size="sm" onClick={() => resetBoard('menu')}>
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Back to menu</span>
            </Button>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <Crown className="h-4 w-4 text-cyan-300" />
              <span className="text-sm font-semibold text-white">{heroBadge}</span>
            </div>
            <button
              type="button"
              onClick={copyPosition}
              className="flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 transition hover:bg-cyan-400/20"
            >
              <span className="text-sm font-semibold text-cyan-200">Copy FEN</span>
              {copiedState ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4 text-cyan-300" />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSoundEnabled((previous) => !previous)}
              className="rounded-xl border border-white/10 bg-white/5 p-2 transition hover:bg-white/10"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4 text-white" /> : <VolumeX className="h-4 w-4 text-slate-400" />}
            </button>
            <ThemeSelector currentTheme={boardTheme} onThemeChange={setBoardTheme} />
          </div>
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
            <ChessBoard
              theme={boardTheme}
              fen={fen}
              selectedSquare={selectedSquare}
              legalTargets={legalTargets}
              lastMove={lastMove}
              hintMove={hintMove}
              checkSquare={checkSquare}
              disabled={Boolean(gameResult) || isAITurning}
              onSquareClick={handleSquareClick}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
            <PlayerPanel
              player="black"
              time={blackTime}
              isActive={currentPlayer === 'black' && !gameResult}
              captured={capturedByBlack}
              label={gameMode === 'ai' ? (isAITurning ? 'AI thinking' : 'AI opponent') : 'Player two'}
            />

            <GlowingCard className="p-4" glowColor="rgba(34, 211, 238, 0.3)">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Game status</h3>
                <span className="text-xs text-slate-500">{moves.length} plies</span>
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">{statusMessage}</div>
                {hintText ? (
                  <div className="rounded-2xl border border-violet-300/20 bg-violet-500/10 p-4 text-sm leading-6 text-violet-100">
                    {hintText}
                  </div>
                ) : null}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">{analysisText}</div>
              </div>
            </GlowingCard>

            <GlowingCard className="p-4" glowColor="rgba(34, 211, 238, 0.3)">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Move history</h3>
                <span className="text-xs text-slate-500">Live SAN log</span>
              </div>
              <MoveHistory moves={moves} />
            </GlowingCard>

            <PlayerPanel
              player="white"
              time={whiteTime}
              isActive={currentPlayer === 'white' && !gameResult}
              captured={capturedByWhite}
              label={gameMode === 'ai' ? 'You' : 'Player one'}
            />

            <GameControls onHint={handleHint} onUndo={handleUndo} onResign={handleResign} />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {promotionState ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#050913]/80 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[linear-gradient(160deg,rgba(8,12,28,0.96),rgba(12,20,44,0.92))] p-6 shadow-[0_30px_80px_rgba(3,7,22,0.45)]"
            >
              <h3 className="text-2xl font-bold text-white">Choose promotion piece</h3>
              <p className="mt-2 text-sm text-slate-400">Select the piece that should replace the pawn on the promotion square.</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {promotionChoices.map((piece) => (
                  <Button key={piece} variant="secondary" className="justify-center py-6 text-lg" onClick={() => handlePromotion(piece)}>
                    {piece === 'q' ? 'Queen' : piece === 'r' ? 'Rook' : piece === 'b' ? 'Bishop' : 'Knight'}
                  </Button>
                ))}
              </div>
              <Button variant="secondary" className="mt-4 w-full" onClick={() => setPromotionState(null)}>
                Cancel
              </Button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
