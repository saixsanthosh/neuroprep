import { motion } from 'framer-motion'
import { MapPinned } from 'lucide-react'

import { GlowingCard } from '../ui/glowing-card'

interface TacticalZone {
  id: string
  name: string
  risk: 'low' | 'medium' | 'high'
  top: string
  left: string
}

interface WarzoneMapPanelProps {
  zones: TacticalZone[]
  selectedZone: string
  onSelectZone: (id: string) => void
}

const riskClasses = {
  low: 'bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.45)]',
  medium: 'bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.45)]',
  high: 'bg-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.45)]',
} as const

export function WarzoneMapPanel({ zones, selectedZone, onSelectZone }: WarzoneMapPanelProps) {
  return (
    <GlowingCard className="overflow-hidden p-6" glowColor="rgba(34, 211, 238, 0.22)">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-2xl bg-cyan-500/15 p-3">
          <MapPinned className="h-5 w-5 text-cyan-300" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Tactical Map</h3>
          <p className="text-sm text-slate-400">Pick the opening drop lane and scan hot zones.</p>
        </div>
      </div>

      <div className="relative h-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(20,42,88,0.85),rgba(5,10,24,0.96))]">
        <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.18)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="absolute inset-[8%] rounded-[1.5rem] border border-cyan-300/10 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.08),transparent_65%)]" />

        {zones.map((zone, index) => {
          const active = zone.id === selectedZone

          return (
            <motion.button
              key={zone.id}
              type="button"
              onClick={() => onSelectZone(zone.id)}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
              style={{ top: zone.top, left: zone.left }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: active ? 1.1 : 1 }}
              transition={{ delay: index * 0.08 }}
            >
              <motion.span
                className={`h-4 w-4 rounded-full ${riskClasses[zone.risk]} ${active ? 'ring-4 ring-cyan-300/25' : ''}`}
                animate={{ scale: [1, 1.18, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: index * 0.1 }}
              />
              <span className="rounded-full border border-white/10 bg-[#081127]/85 px-3 py-1 text-xs font-semibold text-white shadow-[0_8px_30px_rgba(3,7,18,0.35)]">
                {zone.name}
              </span>
            </motion.button>
          )
        })}
      </div>
    </GlowingCard>
  )
}
