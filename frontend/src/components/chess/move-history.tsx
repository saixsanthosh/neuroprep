import { motion } from 'framer-motion'
import { useRef, useEffect } from 'react'

interface MoveHistoryProps {
  moves: string[]
}

export function MoveHistory({ moves }: MoveHistoryProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [moves])

  if (moves.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-white/10 bg-white/5">
        <p className="text-sm text-slate-500">No moves yet</p>
      </div>
    )
  }

  return (
    <div
      ref={scrollRef}
      className="h-48 space-y-2 overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10"
    >
      {moves.map((move, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
          className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2 text-sm"
        >
          <span className="font-mono font-semibold text-cyan-300">
            {Math.floor(index / 2) + 1}.
          </span>
          <span className="flex-1 text-white">{move}</span>
          <span className="text-xs text-slate-500">
            {index % 2 === 0 ? 'White' : 'Black'}
          </span>
        </motion.div>
      ))}
    </div>
  )
}
