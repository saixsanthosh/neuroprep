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
      <Card className="interactive-card">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-2 font-heading text-3xl font-bold">
              {animatedValue}
              {suffix}
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 p-3 text-accent-cyan transition duration-300 hover:rotate-6 hover:bg-white/20">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
