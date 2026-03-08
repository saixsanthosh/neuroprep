import { Clock, TrendingUp } from 'lucide-react'
import { GlowingCard } from '../../ui/glowing-card'
import { AnimatedCounter } from '../../ui/animated-counter'

interface StudyHoursWidgetProps {
  hours: number
  trend?: number
}

export function StudyHoursWidget({ hours, trend = 12 }: StudyHoursWidgetProps) {
  return (
    <GlowingCard glowColor="cyan" className="h-full">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider">Study Hours</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <AnimatedCounter value={hours} className="text-4xl font-black text-white" />
            <span className="text-lg text-slate-400">hrs</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-sm">
            <TrendingUp className="h-3 w-3 text-emerald-400" />
            <span className="text-emerald-400">+{trend}%</span>
            <span className="text-slate-500">this week</span>
          </div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 p-3">
          <Clock className="h-6 w-6 text-white" />
        </div>
      </div>
    </GlowingCard>
  )
}
