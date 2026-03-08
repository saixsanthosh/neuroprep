import { motion } from 'framer-motion'
import { Award, Lock, Star, Zap, Trophy, Target } from 'lucide-react'
import { GlowingCard } from '../ui/glowing-card'

interface Badge {
  id: string
  name: string
  description: string
  icon: 'award' | 'star' | 'zap' | 'trophy' | 'target'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlocked: boolean
  unlockedDate?: string
}

interface AchievementBadgesProps {
  badges: Badge[]
}

const iconMap = {
  award: Award,
  star: Star,
  zap: Zap,
  trophy: Trophy,
  target: Target,
}

const rarityColors = {
  common: 'from-slate-400 to-slate-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-amber-400 to-orange-600',
}

export function AchievementBadges({ badges }: AchievementBadgesProps) {
  const recentlyUnlocked = badges.filter(b => b.unlocked).slice(0, 3)

  return (
    <div className="space-y-4">
      {recentlyUnlocked.length > 0 && (
        <GlowingCard className="p-6" glowColor="rgba(168, 85, 247, 0.4)">
          <h3 className="mb-4 text-lg font-bold text-white">Recently Unlocked</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {recentlyUnlocked.map((badge, index) => {
              const Icon = iconMap[badge.icon]
              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-shrink-0"
                >
                  <div className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-4 w-24">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${rarityColors[badge.rarity]}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-xs font-medium text-white text-center">{badge.name}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </GlowingCard>
      )}

      <GlowingCard className="p-6" glowColor="rgba(168, 85, 247, 0.4)">
        <div className="mb-6 flex items-center gap-2">
          <Award className="h-6 w-6 text-purple-400" />
          <h3 className="text-lg font-bold text-white">Achievement Badges</h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map((badge, index) => {
            const Icon = iconMap[badge.icon]
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: badge.unlocked ? 1.05 : 1 }}
                className={`relative overflow-hidden rounded-xl border p-4 transition-all ${
                  badge.unlocked
                    ? `border-${badge.rarity === 'legendary' ? 'amber' : badge.rarity === 'epic' ? 'purple' : badge.rarity === 'rare' ? 'blue' : 'slate'}-400/30 bg-white/10`
                    : 'border-white/10 bg-white/5 opacity-50'
                }`}
              >
                {!badge.unlocked && (
                  <div className="absolute right-2 top-2">
                    <Lock className="h-4 w-4 text-slate-500" />
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${
                    badge.unlocked
                      ? `bg-gradient-to-br ${rarityColors[badge.rarity]}`
                      : 'bg-white/10'
                  }`}>
                    <Icon className={`h-6 w-6 ${badge.unlocked ? 'text-white' : 'text-slate-500'}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white">{badge.name}</p>
                    <p className="mt-1 text-xs text-slate-400">{badge.description}</p>
                    {badge.unlocked && badge.unlockedDate && (
                      <p className="mt-2 text-xs text-emerald-300">Unlocked {badge.unlockedDate}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </GlowingCard>
    </div>
  )
}
