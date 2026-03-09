import { motion, AnimatePresence } from 'framer-motion'
import { LetterTile } from './letter-tile'

interface AnswerInputProps {
  letters: string[]
  onRemoveLetter: (index: number) => void
}

export function AnswerInput({ letters, onRemoveLetter }: AnswerInputProps) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-cyan-400/30 bg-cyan-500/5 p-6 backdrop-blur-xl">
      <p className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-cyan-300">
        Your Answer
      </p>
      
      <div className="flex min-h-[80px] flex-wrap items-center justify-center gap-2 sm:gap-3">
        <AnimatePresence mode="popLayout">
          {letters.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-slate-500"
            >
              Tap letters to build your word
            </motion.p>
          ) : (
            letters.map((letter, index) => (
              <LetterTile
                key={`answer-${index}`}
                letter={letter}
                onClick={() => onRemoveLetter(index)}
                glowColor="cyan"
                size="md"
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {letters.length > 0 && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center text-xs text-slate-400"
        >
          Tap a letter to remove it
        </motion.p>
      )}
    </div>
  )
}
