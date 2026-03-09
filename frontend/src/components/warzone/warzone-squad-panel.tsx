import { motion } from 'framer-motion'
import { Shield, UserRound } from 'lucide-react'

import { GlowingCard } from '../ui/glowing-card'

interface SquadMember {
  id: string
  name: string
  role: string
  status: string
}

interface WarzoneSquadPanelProps {
  mode: 'solo' | 'duo' | 'squad'
  members: ReadonlyArray<SquadMember>
}

export function WarzoneSquadPanel({ mode, members }: WarzoneSquadPanelProps) {
  return (
    <GlowingCard className="p-6" glowColor="rgba(139, 92, 246, 0.24)">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-2xl bg-violet-500/15 p-3">
          <Shield className="h-5 w-5 text-violet-300" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Squad Panel</h3>
          <p className="text-sm text-slate-400">Current queue mode: {mode}</p>
        </div>
      </div>

      <div className="space-y-3">
        {members.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.06 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-white/10 p-3">
                  <UserRound className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">{member.name}</p>
                  <p className="text-sm uppercase tracking-[0.18em] text-slate-500">{member.role}</p>
                </div>
              </div>
              <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                {member.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </GlowingCard>
  )
}
