import { Zap } from 'lucide-react'
import { GlowingCard } from '../../ui/glowing-card'
import { AnimatedCounter } from '../../ui/animated-counter'

interface ProductivityWidgetProps {
  score: number
}

export function ProductivityWidget({ score }: ProductivityWidgetProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400'
    if (score >= 60) return 'text-cyan-400'
    if (score >= 40) return 'text-amber-400'
    return 'text-red-400'
  }

  return (
    <GlowingCard glowColor="purple" className="h-full">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-slate-400">
            <Zap className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider">Productivity</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <AnimatedCounter value={score} className={`text-4xl font-black ${getScoreColor(score)}`} />
            <span className="text-lg text-slate-400">%</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-violet-600 transition-all duration-1000"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 p-3">
          <Zap className="h-6 w-6 text-white" />
        </div>
      </div>
    </GlowingCard>
  )
}
