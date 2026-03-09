import { Chess, type Square } from 'chess.js'
import { AnimatePresence, motion } from 'framer-motion'

import { GlowingCard } from '../ui/glowing-card'

type BoardTheme = 'classic' | 'wood' | 'neon' | 'glass' | 'marble'

type HighlightMove = {
  from: Square
  to: Square
}

interface ChessBoardProps {
  theme: BoardTheme
  fen: string
  orientation?: 'white' | 'black'
  selectedSquare: Square | null
  legalTargets: Square[]
  lastMove: HighlightMove | null
  hintMove: HighlightMove | null
  checkSquare: Square | null
  disabled?: boolean
  onSquareClick: (square: Square) => void
}

const pieceSymbols = {
  w: {
    k: '\u2654',
    q: '\u2655',
    r: '\u2656',
    b: '\u2657',
    n: '\u2658',
    p: '\u2659',
  },
  b: {
    k: '\u265A',
    q: '\u265B',
    r: '\u265C',
    b: '\u265D',
    n: '\u265E',
    p: '\u265F',
  },
} as const

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const
const ranks = [8, 7, 6, 5, 4, 3, 2, 1] as const

const themeColors: Record<BoardTheme, { light: string; dark: string; glow: string }> = {
  classic: {
    light: 'bg-slate-200',
    dark: 'bg-slate-700',
    glow: 'rgba(148, 163, 184, 0.3)',
  },
  wood: {
    light: 'bg-amber-200',
    dark: 'bg-amber-800',
    glow: 'rgba(217, 119, 6, 0.3)',
  },
  neon: {
    light: 'bg-cyan-400/30',
    dark: 'bg-violet-600/30',
    glow: 'rgba(34, 211, 238, 0.45)',
  },
  glass: {
    light: 'bg-white/20',
    dark: 'bg-white/10',
    glow: 'rgba(255, 255, 255, 0.25)',
  },
  marble: {
    light: 'bg-slate-100',
    dark: 'bg-slate-400',
    glow: 'rgba(203, 213, 225, 0.35)',
  },
}

function squareColor(square: Square) {
  const fileIndex = square.charCodeAt(0) - 97
  const rankIndex = Number(square[1]) - 1
  return (fileIndex + rankIndex) % 2 === 0 ? 'dark' : 'light'
}

export function ChessBoard({
  theme,
  fen,
  orientation = 'white',
  selectedSquare,
  legalTargets,
  lastMove,
  hintMove,
  checkSquare,
  disabled = false,
  onSquareClick,
}: ChessBoardProps) {
  const game = new Chess(fen)
  const colors = themeColors[theme]
  const displayFiles = orientation === 'white' ? files : [...files].reverse()
  const displayRanks = orientation === 'white' ? ranks : [...ranks].reverse()

  return (
    <GlowingCard className="p-4 sm:p-6 lg:p-8" glowColor={colors.glow}>
      <div className="mx-auto aspect-square w-full max-w-4xl">
        <div className="grid h-full w-full grid-cols-8 grid-rows-8 overflow-hidden rounded-[2rem] border-4 border-white/10 shadow-[0_30px_80px_rgba(4,10,28,0.45)]">
          {displayRanks.map((rankValue) =>
            displayFiles.map((fileValue) => {
              const square = `${fileValue}${rankValue}` as Square
              const piece = game.get(square)
              const squareTone = squareColor(square)
              const isSelected = selectedSquare === square
              const isLegalTarget = legalTargets.includes(square)
              const isLastMove =
                lastMove?.from === square || lastMove?.to === square
              const isHintSquare = hintMove?.from === square || hintMove?.to === square
              const isCheckSquare = checkSquare === square

              return (
                <motion.button
                  key={square}
                  type="button"
                  disabled={disabled}
                  onClick={() => onSquareClick(square)}
                  whileHover={disabled ? undefined : { scale: 1.02 }}
                  whileTap={disabled ? undefined : { scale: 0.98 }}
                  className={`relative flex items-center justify-center transition-all ${
                    squareTone === 'light' ? colors.light : colors.dark
                  } ${disabled ? 'cursor-default' : 'cursor-pointer'} ${
                    isSelected
                      ? 'ring-4 ring-cyan-400 ring-inset'
                      : isCheckSquare
                        ? 'ring-4 ring-red-400/80 ring-inset'
                        : isHintSquare
                          ? 'ring-4 ring-violet-300/70 ring-inset'
                          : isLastMove
                            ? 'ring-4 ring-amber-300/60 ring-inset'
                            : ''
                  }`}
                >
                  {isLegalTarget ? (
                    piece ? (
                      <span className="pointer-events-none absolute inset-2 rounded-full border-4 border-emerald-300/70" />
                    ) : (
                      <span className="pointer-events-none absolute h-4 w-4 rounded-full bg-emerald-300/60" />
                    )
                  ) : null}

                  <AnimatePresence mode="wait">
                    {piece ? (
                      <motion.span
                        key={`${square}-${piece.type}-${piece.color}`}
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                        className={`select-none text-[2rem] leading-none sm:text-[2.6rem] lg:text-[3.2rem] ${
                          piece.color === 'w' ? 'text-white' : 'text-slate-950'
                        }`}
                        style={{
                          filter:
                            piece.color === 'w'
                              ? 'drop-shadow(0 3px 8px rgba(5, 9, 20, 0.65))'
                              : 'drop-shadow(0 3px 8px rgba(241, 245, 249, 0.4))',
                        }}
                      >
                        {pieceSymbols[piece.color][piece.type]}
                      </motion.span>
                    ) : null}
                  </AnimatePresence>

                  {fileValue === displayFiles[0] ? (
                    <span className="pointer-events-none absolute left-1.5 top-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {rankValue}
                    </span>
                  ) : null}
                  {rankValue === displayRanks[displayRanks.length - 1] ? (
                    <span className="pointer-events-none absolute bottom-1 right-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {fileValue}
                    </span>
                  ) : null}
                </motion.button>
              )
            }),
          )}
        </div>
      </div>
    </GlowingCard>
  )
}
