import { AnimatePresence, motion } from 'framer-motion'

import { LetterTile } from './letter-tile'

interface Tile {
  id: string
  letter: string
}

interface AnswerInputProps {
  letters: Tile[]
  onRemoveLetter: (index: number) => void
  onDropLetter: () => void
  isDragOver: boolean
}

export function AnswerInput({ letters, onRemoveLetter, onDropLetter, isDragOver }: AnswerInputProps) {
  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        onDropLetter()
      }}
      className={`rounded-2xl border-2 border-dashed p-6 backdrop-blur-xl transition ${
        isDragOver
          ? 'border-cyan-300/70 bg-cyan-400/15 shadow-[0_0_40px_rgba(34,211,238,0.25)]'
          : 'border-cyan-400/30 bg-cyan-500/5'
      }`}
    >
      <p className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-cyan-300">Your Answer</p>

      <div className="flex min-h-[80px] flex-wrap items-center justify-center gap-2 sm:gap-3">
        <AnimatePresence mode="popLayout">
          {letters.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-slate-500"
            >
              Drag letters here or tap tiles to build the answer.
            </motion.p>
          ) : (
            letters.map((letter, index) => (
              <LetterTile
                key={letter.id}
                id={letter.id}
                letter={letter.letter}
                onClick={() => onRemoveLetter(index)}
                glowColor="cyan"
                size="md"
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {letters.length > 0 ? (
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-center text-xs text-slate-400">
          Tap a letter to remove it from the answer lane.
        </motion.p>
      ) : null}
    </div>
  )
}
