import { Flame } from 'lucide-react'
import { GlowingCard } from '../../ui/glowing-card'
import { AnimatedCounter } from '../../ui/animated-counter'

interface StreakWidgetProps {
  streak: number
  longest?: number
}

export function StreakWidget({ streak, longest = 28 }: StreakWidgetProps) {
  return (
    <GlowingCard glowColor="amber" className="h-full">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-slate-400">
            <Flame className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider">Study Streak</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <AnimatedCounter value={streak} className="text-4xl font-black text-white" />
            <span className="text-lg text-slate-400">days</span>
          </div>
          <div className="mt-2 text-sm text-slate-500">
            Longest: {longest} days
          </div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 p-3">
          <Flame className="h-6 w-6 text-white" />
        </div>
      </div>
    </GlowingCard>
  )
}
