import { motion } from 'framer-motion'
import { Crosshair, Shield, Users } from 'lucide-react'

import { GlowingCard } from '../ui/glowing-card'

export type WarzoneMode = 'solo' | 'duo' | 'squad'

interface WarzoneModeSelectorProps {
  selectedMode: WarzoneMode
  onSelectMode: (mode: WarzoneMode) => void
}

const modes: Array<{
  id: WarzoneMode
  title: string
  description: string
  icon: typeof Crosshair
  glow: string
  accent: string
}> = [
  {
    id: 'solo',
    title: 'Solo Drop',
    description: 'One operator, fast rotations, full focus on survival and clean aim.',
    icon: Crosshair,
    glow: 'rgba(34, 211, 238, 0.35)',
    accent: 'from-cyan-400 to-sky-500',
  },
  {
    id: 'duo',
    title: 'Duo Stack',
    description: 'Tight two-player pacing for revives, split pressure, and flanks.',
    icon: Shield,
    glow: 'rgba(139, 92, 246, 0.35)',
    accent: 'from-violet-400 to-purple-500',
  },
  {
    id: 'squad',
    title: 'Squad Push',
    description: 'Full-team drop with layered roles, utility timing, and map control.',
    icon: Users,
    glow: 'rgba(16, 185, 129, 0.35)',
    accent: 'from-emerald-400 to-teal-500',
  },
]

export function WarzoneModeSelector({ selectedMode, onSelectMode }: WarzoneModeSelectorProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {modes.map((mode, index) => {
        const Icon = mode.icon
        const active = selectedMode === mode.id

        return (
          <motion.div
            key={mode.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <GlowingCard
              className={`h-full cursor-pointer p-5 transition-transform hover:-translate-y-1 ${active ? 'ring-1 ring-cyan-300/40' : ''}`}
              glowColor={mode.glow}
              onClick={() => onSelectMode(mode.id)}
            >
              <div className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br ${mode.accent} p-3`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">{mode.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{mode.description}</p>
            </GlowingCard>
          </motion.div>
        )
      })}
    </div>
  )
}
