import { motion } from 'framer-motion'
import { Brain, Zap, Flame, ArrowLeft } from 'lucide-react'
import { GlowingCard } from '../ui/glowing-card'
import { Button } from '../ui/button'

type Difficulty = 'beginner' | 'intermediate' | 'advanced'

interface DifficultySelectorProps {
  onSelect: (difficulty: Difficulty) => void
  onBack: () => void
}

const difficulties: {
  value: Difficulty
  label: string
  description: string
  icon: typeof Brain
  color: string
}[] = [
  {
    value: 'beginner',
    label: 'Beginner',
    description: 'Perfect for learning the basics and building confidence',
    icon: Brain,
    color: 'emerald',
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    description: 'Balanced challenge for developing strategic thinking',
    icon: Zap,
    color: 'cyan',
  },
  {
    value: 'advanced',
    label: 'Advanced',
    description: 'Ultimate test for experienced players seeking mastery',
    icon: Flame,
    color: 'violet',
  },
]

export function DifficultySelector({ onSelect, onBack }: DifficultySelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-4xl p-4"
    >
      <div className="mb-6">
        <Button variant="secondary" size="sm" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h2 className="mb-2 text-4xl font-black text-white">Select Difficulty</h2>
        <p className="text-slate-300">Choose your AI opponent's skill level</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {difficulties.map((difficulty, index) => {
          const Icon = difficulty.icon
          return (
            <motion.div
              key={difficulty.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlowingCard
                className="group h-full cursor-pointer p-6 transition-all hover:scale-105"
                glowColor={
                  difficulty.color === 'emerald'
                    ? 'rgba(16, 185, 129, 0.4)'
                    : difficulty.color === 'cyan'
                      ? 'rgba(34, 211, 238, 0.4)'
                      : 'rgba(124, 58, 237, 0.4)'
                }
                onClick={() => onSelect(difficulty.value)}
              >
                <div
                  className={`mb-4 inline-flex rounded-2xl p-3 ${
                    difficulty.color === 'emerald'
                      ? 'bg-emerald-500/20'
                      : difficulty.color === 'cyan'
                        ? 'bg-cyan-500/20'
                        : 'bg-violet-500/20'
                  }`}
                >
                  <Icon
                    className={`h-8 w-8 ${
                      difficulty.color === 'emerald'
                        ? 'text-emerald-300'
                        : difficulty.color === 'cyan'
                          ? 'text-cyan-300'
                          : 'text-violet-300'
                    }`}
                  />
                </div>
                <h3 className="mb-2 text-2xl font-bold text-white">{difficulty.label}</h3>
                <p className="text-sm text-slate-300">{difficulty.description}</p>
              </GlowingCard>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
