import { motion } from 'framer-motion'
import { Clock, User } from 'lucide-react'
import { GlowingCard } from '../ui/glowing-card'

interface PlayerPanelProps {
  player: 'white' | 'black'
  time: number
  isActive: boolean
  captured: string[]
  label?: string
}

export function PlayerPanel({ player, time, isActive, captured, label }: PlayerPanelProps) {
  const minutes = Math.floor(time / 60)
  const seconds = time % 60

  const formatTime = () => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <GlowingCard
      className={`p-4 transition-all ${isActive ? 'ring-2 ring-cyan-400' : ''}`}
      glowColor={isActive ? 'rgba(34, 211, 238, 0.4)' : 'rgba(100, 116, 139, 0.2)'}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${
              player === 'white' ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
            }`}
          >
            <User className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-white">
              {player === 'white' ? 'White' : 'Black'}
            </h3>
            <p className="text-xs text-slate-400">
              {label ?? (player === 'white' ? 'You' : 'Opponent')}
            </p>
          </div>
        </div>

        <motion.div
          animate={{
            scale: isActive ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: 1,
            repeat: isActive ? Infinity : 0,
          }}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 ${
            time < 60
              ? 'bg-red-500/20 text-red-300'
              : time < 180
                ? 'bg-yellow-500/20 text-yellow-300'
                : 'bg-cyan-500/20 text-cyan-300'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span className="font-mono text-lg font-bold">{formatTime()}</span>
        </motion.div>
      </div>

      {captured.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1 border-t border-white/10 pt-3">
          {captured.map((piece, index) => (
            <span key={index} className="text-xl opacity-50">
              {piece}
            </span>
          ))}
        </div>
      )}
    </GlowingCard>
  )
}
