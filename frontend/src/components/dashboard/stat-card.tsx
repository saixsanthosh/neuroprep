import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

import { useAnimatedNumber } from '../../hooks/use-animated-number'
import { Card } from '../ui/card'

type StatCardProps = {
  label: string
  value: number
  suffix?: string
  icon: LucideIcon
  delay?: number
}

export function StatCard({ label, value, suffix = '', icon: Icon, delay = 0 }: StatCardProps) {
  const animatedValue = useAnimatedNumber(value)

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -6 }}
    >
      <Card className="interactive-card overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(124,58,237,0.14),transparent_30%)]" />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-slate-400">{label}</p>
            <p className="mt-3 font-heading text-3xl font-bold text-white">
              {animatedValue}
              {suffix}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-3 text-accent-cyan transition duration-300 hover:rotate-6 hover:bg-white/20">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
