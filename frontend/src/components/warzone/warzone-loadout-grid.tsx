import { motion } from 'framer-motion'
import { Ghost, Radar, ShieldPlus, Sword, Zap } from 'lucide-react'

import { GlowingCard } from '../ui/glowing-card'

export interface WarzoneLoadout {
  id: string
  name: string
  role: string
  weapon: string
  support: string
  accent: string
}

interface WarzoneLoadoutGridProps {
  loadouts: WarzoneLoadout[]
  selectedLoadout: string
  onSelectLoadout: (id: string) => void
}

const roleIcons = {
  entry: Sword,
  recon: Radar,
  support: ShieldPlus,
  stealth: Ghost,
} as const

export function WarzoneLoadoutGrid({ loadouts, selectedLoadout, onSelectLoadout }: WarzoneLoadoutGridProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {loadouts.map((loadout, index) => {
        const active = loadout.id === selectedLoadout
        const Icon = roleIcons[loadout.role as keyof typeof roleIcons] ?? Zap

        return (
          <motion.div
            key={loadout.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + index * 0.08 }}
          >
            <GlowingCard
              className={`h-full cursor-pointer p-5 transition-transform hover:-translate-y-1 ${active ? 'ring-1 ring-cyan-300/40' : ''}`}
              glowColor="rgba(34, 211, 238, 0.25)"
              onClick={() => onSelectLoadout(loadout.id)}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className={`mb-3 inline-flex rounded-2xl bg-gradient-to-br ${loadout.accent} p-3`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{loadout.name}</h3>
                  <p className="mt-1 text-sm uppercase tracking-[0.18em] text-slate-400">{loadout.role}</p>
                </div>
                {active ? <span className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">Equipped</span> : null}
              </div>
              <div className="mt-5 space-y-3 text-sm text-slate-300">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <span className="block text-xs uppercase tracking-[0.18em] text-slate-500">Primary</span>
                  <span className="mt-1 block font-semibold text-white">{loadout.weapon}</span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <span className="block text-xs uppercase tracking-[0.18em] text-slate-500">Utility</span>
                  <span className="mt-1 block font-semibold text-white">{loadout.support}</span>
                </div>
              </div>
            </GlowingCard>
          </motion.div>
        )
      })}
    </div>
  )
}
