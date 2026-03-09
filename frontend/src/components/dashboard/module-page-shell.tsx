import type { ReactNode } from 'react'

import { motion } from 'framer-motion'

import { AnimatedGradientOrb } from '../ui/animated-gradient-orb'
import { FloatingShapes } from '../ui/floating-shapes'
import { GradientText } from '../ui/gradient-text'
import { PulseDot } from '../ui/pulse-dot'

type ModulePageShellProps = {
  badge: string
  title: string
  highlight: string
  description: string
  children: ReactNode
  actions?: ReactNode
}

export function ModulePageShell({
  badge,
  title,
  highlight,
  description,
  children,
  actions,
}: ModulePageShellProps) {
  return (
    <div className="relative space-y-6 pb-6">
      <FloatingShapes />
      <AnimatedGradientOrb
        className="-right-16 top-12"
        colors={['rgba(34, 211, 238, 0.14)', 'rgba(56, 189, 248, 0.1)']}
        size="lg"
        delay={0}
      />
      <AnimatedGradientOrb
        className="bottom-16 left-6"
        colors={['rgba(124, 58, 237, 0.16)', 'rgba(167, 139, 250, 0.1)']}
        size="md"
        delay={1}
      />

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_24%),radial-gradient(circle_at_78%_16%,rgba(124,58,237,0.2),transparent_28%),linear-gradient(150deg,rgba(7,11,26,0.95),rgba(11,20,46,0.9))] p-6 shadow-[0_30px_80px_rgba(4,8,24,0.45)] backdrop-blur-2xl sm:p-8"
      >
        <div className="premium-grid absolute inset-0 opacity-20" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-cyan-200">
            <PulseDot size="sm" color="bg-cyan-400" />
            {badge}
          </div>

          <div className="mt-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                {title} <GradientText>{highlight}</GradientText>
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">{description}</p>
            </div>

            {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
          </div>
        </div>
      </motion.section>

      {children}
    </div>
  )
}
