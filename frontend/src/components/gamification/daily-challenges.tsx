import { motion } from 'framer-motion'
import { Target, CheckCircle, Zap } from 'lucide-react'
import { GlowingCard } from '../ui/glowing-card'

interface Challenge {
  id: string
  title: string
  description: string
  rewardXP: number
  progress: number
  target: number
  completed: boolean
}

interface DailyChallengesProps {
  challenges: Challenge[]
}

export function DailyChallenges({ challenges }: DailyChallengesProps) {
  return (
    <GlowingCard className="p-6" glowColor="rgba(124, 58, 237, 0.4)">
      <div className="flex items-center gap-2 mb-6">
        <Target className="h-6 w-6 text-violet-400" />
        <h3 className="text-lg font-bold text-white">Daily Challenges</h3>
      </div>

      <div className="space-y-3">
        {challenges.map((challenge, index) => {
          const progress = (challenge.progress / challenge.target) * 100

          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-xl border p-4 transition-all ${
                challenge.completed
                  ? 'border-emerald-400/30 bg-emerald-400/10'
                  : 'border-white/10 bg-white/5 hover:border-violet-400/30 hover:bg-white/10'
              }`}
            >
              {challenge.completed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-4 top-4"
                >
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                </motion.div>
              )}

              <div className="pr-10">
                <h4 className="font-semibold text-white">{challenge.title}</h4>
                <p className="mt-1 text-sm text-slate-400">{challenge.description}</p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center gap-1 rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-1">
                    <Zap className="h-3 w-3 text-amber-300" />
                    <span className="text-xs font-medium text-amber-200">+{challenge.rewardXP} XP</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {challenge.progress} / {challenge.target}
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className={`h-full rounded-full ${
                      challenge.completed
                        ? 'bg-gradient-to-r from-emerald-400 to-green-500'
                        : 'bg-gradient-to-r from-violet-400 to-purple-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </GlowingCard>
  )
}
