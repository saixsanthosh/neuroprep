import { motion } from 'framer-motion'
import { ChevronRight, Clock, Infinity as InfinityIcon, Skull, Swords } from 'lucide-react'

import { GlowingCard } from '../ui/glowing-card'

type GameMode = 'classic' | 'speed' | 'survival' | 'battle'

interface GameModeSelectorProps {
  onSelectMode: (mode: GameMode) => void
}

const modes = [
  {
    id: 'classic' as GameMode,
    title: 'Classic Mode',
    description: 'Solve puzzles at your own pace with unlimited time.',
    icon: InfinityIcon,
    color: 'from-violet-400 to-purple-500',
    glow: 'rgba(139, 92, 246, 0.4)',
  },
  {
    id: 'speed' as GameMode,
    title: 'Speed Mode',
    description: 'Race against time and solve as many words as possible in 60 seconds.',
    icon: Clock,
    color: 'from-cyan-400 to-blue-500',
    glow: 'rgba(34, 211, 238, 0.4)',
  },
  {
    id: 'survival' as GameMode,
    title: 'Survival Mode',
    description: 'One wrong answer ends the run. Build a streak while the pressure climbs.',
    icon: Skull,
    color: 'from-red-400 to-rose-500',
    glow: 'rgba(239, 68, 68, 0.4)',
  },
  {
    id: 'battle' as GameMode,
    title: 'Battle Mode',
    description: 'Play continuous rounds with higher scoring and faster tempo.',
    icon: Swords,
    color: 'from-emerald-400 to-teal-500',
    glow: 'rgba(16, 185, 129, 0.4)',
  },
]

export function GameModeSelector({ onSelectMode }: GameModeSelectorProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {modes.map((mode, index) => {
        const Icon = mode.icon

        return (
          <motion.div
            key={mode.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <GlowingCard
              className="group relative h-full cursor-pointer overflow-hidden p-8 transition-all hover:scale-105"
              glowColor={mode.glow}
              onClick={() => onSelectMode(mode.id)}
            >
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-0 transition-opacity duration-500 group-hover:opacity-20`}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />

              <div className="relative z-10">
                <motion.div
                  className={`mb-6 inline-flex rounded-2xl bg-gradient-to-br ${mode.color} p-4`}
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="h-10 w-10 text-white" />
                </motion.div>

                <h3 className="mb-3 text-2xl font-bold text-white sm:text-3xl">{mode.title}</h3>
                <p className="mb-6 text-slate-300">{mode.description}</p>

                <motion.div
                  className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${mode.color} px-6 py-3 font-semibold text-white shadow-lg`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Play Now
                  <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                    <ChevronRight className="h-4 w-4" />
                  </motion.span>
                </motion.div>
              </div>

              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
              <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
            </GlowingCard>
          </motion.div>
        )
      })}
    </div>
  )
}
