import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { AnimatedCounter } from './animated-counter'

interface StatCardAnimatedProps {
  label: string
  value: string | number
  caption: string
  icon: LucideIcon
  delay?: number
  color?: string
  isNumeric?: boolean
}

export function StatCardAnimated({
  label,
  value,
  caption,
  icon: Icon,
  delay = 0,
  color = 'from-cyan-400 to-blue-500',
  isNumeric = false,
}: StatCardAnimatedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20 p-4 backdrop-blur-2xl transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{label}</p>
        <motion.span
          className={`rounded-xl bg-gradient-to-br ${color} p-2 text-white`}
          whileHover={{ rotate: 5, scale: 1.1 }}
        >
          <Icon className="h-4 w-4" />
        </motion.span>
      </div>
      <p className="mt-4 text-3xl font-bold text-white">
        {isNumeric && typeof value === 'number' ? (
          <AnimatedCounter value={value} />
        ) : (
          value
        )}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{caption}</p>

      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-violet-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        initial={false}
      />
    </motion.div>
  )
}
