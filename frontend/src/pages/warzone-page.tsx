import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  Flame,
  Layers3,
  Rocket,
  Shield,
  Sparkles,
  Swords,
  Timer,
  WandSparkles,
} from 'lucide-react'

import { WarzoneLoadoutGrid, type WarzoneLoadout } from '../components/warzone/warzone-loadout-grid'
import { WarzoneMapPanel } from '../components/warzone/warzone-map-panel'
import { WarzoneMissionFeed } from '../components/warzone/warzone-mission-feed'
import { WarzoneModeSelector, type WarzoneMode } from '../components/warzone/warzone-mode-selector'
import { WarzoneSquadPanel } from '../components/warzone/warzone-squad-panel'
import { AnimatedGradientOrb } from '../components/ui/animated-gradient-orb'
import { Button } from '../components/ui/button'
import { FloatingShapes } from '../components/ui/floating-shapes'
import { GlowingCard } from '../components/ui/glowing-card'
import { ParticlesBackground } from '../components/ui/particles-background'

const loadouts: WarzoneLoadout[] = [
  {
    id: 'entry-frag',
    name: 'Entry Frag',
    role: 'entry',
    weapon: 'VX-9 carbine + breach shotgun',
    support: 'stim burst + smoke stack',
    accent: 'from-rose-400 to-orange-500',
  },
  {
    id: 'recon-overwatch',
    name: 'Recon Overwatch',
    role: 'recon',
    weapon: 'M77 marksman rifle + burst pistol',
    support: 'scan drone + ping beacon',
    accent: 'from-cyan-400 to-blue-500',
  },
  {
    id: 'support-anchor',
    name: 'Support Anchor',
    role: 'support',
    weapon: 'LMG platform + machine pistol',
    support: 'armor cache + trophy field',
    accent: 'from-emerald-400 to-teal-500',
  },
  {
    id: 'stealth-rotate',
    name: 'Stealth Rotate',
    role: 'stealth',
    weapon: 'suppressed SMG + combat knife',
    support: 'dead silence + sensor scrambler',
    accent: 'from-violet-400 to-fuchsia-500',
  },
]

const zones = [
  { id: 'summit', name: 'Summit', risk: 'high' as const, top: '24%', left: '38%' },
  { id: 'harbor', name: 'Harbor', risk: 'medium' as const, top: '64%', left: '26%' },
  { id: 'metro', name: 'Metro', risk: 'high' as const, top: '54%', left: '57%' },
  { id: 'ridge', name: 'Ridge', risk: 'low' as const, top: '32%', left: '73%' },
  { id: 'terminal', name: 'Terminal', risk: 'medium' as const, top: '74%', left: '70%' },
]

const missions = [
  {
    id: 'm1',
    title: 'Lock the opening lane',
    detail: 'Secure one low-risk drop, collect early armor, and rotate before the first collapse hits midpoint.',
    reward: '+600 prep XP',
  },
  {
    id: 'm2',
    title: 'Run one recon sweep',
    detail: 'Use a drone or radar pulse before crossing the center grid so the squad avoids blind pushes.',
    reward: 'intel token',
  },
  {
    id: 'm3',
    title: 'Draft final loadout',
    detail: 'Align each operator role so entry, support, and rotate pressure do not overlap.',
    reward: 'loadout bonus',
  },
]

const squadByMode = {
  solo: [{ id: 's1', name: 'Sai', role: 'Operator', status: 'Ready' }],
  duo: [
    { id: 's1', name: 'Sai', role: 'IGL', status: 'Ready' },
    { id: 's2', name: 'Nova', role: 'Entry', status: 'Synced' },
  ],
  squad: [
    { id: 's1', name: 'Sai', role: 'IGL', status: 'Ready' },
    { id: 's2', name: 'Nova', role: 'Entry', status: 'Synced' },
    { id: 's3', name: 'Trace', role: 'Recon', status: 'Synced' },
    { id: 's4', name: 'Mako', role: 'Anchor', status: 'Online' },
  ],
} as const

export function WarzonePage() {
  const [mode, setMode] = useState<WarzoneMode>('squad')
  const [selectedLoadout, setSelectedLoadout] = useState(loadouts[0].id)
  const [selectedZone, setSelectedZone] = useState(zones[0].id)
  const [queueState, setQueueState] = useState<'idle' | 'searching' | 'ready'>('idle')
  const [queueProgress, setQueueProgress] = useState(0)

  useEffect(() => {
    if (queueState !== 'searching') {
      return
    }

    const timer = window.setInterval(() => {
      setQueueProgress((previous) => {
        const next = Math.min(100, previous + 14)
        if (next === 100) {
          window.setTimeout(() => setQueueState('ready'), 0)
        }
        return next
      })
    }, 420)

    return () => window.clearInterval(timer)
  }, [queueState])

  const selectedLoadoutData = useMemo(
    () => loadouts.find((loadout) => loadout.id === selectedLoadout) ?? loadouts[0],
    [selectedLoadout],
  )
  const selectedZoneData = useMemo(() => zones.find((zone) => zone.id === selectedZone) ?? zones[0], [selectedZone])
  const squad = squadByMode[mode]

  function startQueue() {
    setQueueState('searching')
    setQueueProgress(0)
  }

  function cancelQueue() {
    setQueueState('idle')
    setQueueProgress(0)
  }

  return (
    <div className="relative min-h-screen overflow-hidden pb-8">
      <ParticlesBackground />
      <FloatingShapes />
      <AnimatedGradientOrb
        className="left-10 top-16"
        colors={['rgba(34, 211, 238, 0.18)', 'rgba(56, 189, 248, 0.14)']}
        size="lg"
        delay={0}
      />
      <AnimatedGradientOrb
        className="right-10 top-28"
        colors={['rgba(139, 92, 246, 0.18)', 'rgba(236, 72, 153, 0.14)']}
        size="lg"
        delay={0.6}
      />

      <div className="relative z-10 space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]"
        >
          <GlowingCard className="overflow-hidden p-8" glowColor="rgba(34, 211, 238, 0.24)">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_45%)]" />
            <div className="relative">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2">
                <Rocket className="h-4 w-4 text-cyan-300" />
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">Warzone Phase 1</span>
              </div>
              <h1 className="max-w-3xl text-5xl font-black leading-[0.95] text-white sm:text-6xl xl:text-7xl">
                AAA-style lobby, loadout, and drop-planning shell.
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
                The full shooter spec is still missing from the repo, so this build is the first usable slice: queue control, squad orchestration, tactical map, and animated loadout selection wired into NeuroPrep&apos;s games hub.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                {queueState === 'idle' ? (
                  <Button onClick={startQueue} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                    Queue Match
                  </Button>
                ) : queueState === 'searching' ? (
                  <Button variant="secondary" onClick={cancelQueue}>
                    Cancel Queue
                  </Button>
                ) : (
                  <Button onClick={cancelQueue} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                    Reset Lobby
                  </Button>
                )}
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                  Loadout: <span className="font-semibold text-white">{selectedLoadoutData.name}</span>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                  Drop: <span className="font-semibold text-white">{selectedZoneData.name}</span>
                </div>
              </div>
            </div>
          </GlowingCard>

          <GlowingCard className="p-6" glowColor="rgba(139, 92, 246, 0.24)">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Queue Console</h2>
                <p className="text-sm text-slate-400">Live matchmaker shell for the future WebGL arena.</p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                {queueState}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                  <span>Match sync</span>
                  <span>{queueProgress}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-500"
                    animate={{ width: `${queueProgress}%` }}
                    transition={{ duration: 0.35 }}
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <Timer className="mb-3 h-5 w-5 text-cyan-300" />
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">ETA</p>
                  <p className="mt-1 text-xl font-bold text-white">{queueState === 'ready' ? 'locked' : '00:23'}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <Layers3 className="mb-3 h-5 w-5 text-violet-300" />
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Playlist</p>
                  <p className="mt-1 text-xl font-bold capitalize text-white">{mode}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <Activity className="mb-3 h-5 w-5 text-emerald-300" />
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Readiness</p>
                  <p className="mt-1 text-xl font-bold text-white">{queueState === 'ready' ? '100%' : '82%'}</p>
                </div>
              </div>
            </div>
          </GlowingCard>
        </motion.section>

        <WarzoneModeSelector selectedMode={mode} onSelectMode={setMode} />

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <GlowingCard className="p-6" glowColor="rgba(34, 211, 238, 0.2)">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-cyan-500/15 p-3">
                  <Swords className="h-5 w-5 text-cyan-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Loadout Bay</h2>
                  <p className="text-sm text-slate-400">Choose the role package that should deploy with your squad.</p>
                </div>
              </div>
              <WarzoneLoadoutGrid
                loadouts={loadouts}
                selectedLoadout={selectedLoadout}
                onSelectLoadout={setSelectedLoadout}
              />
            </GlowingCard>

            <WarzoneMissionFeed missions={missions} />
          </div>

          <div className="space-y-6">
            <WarzoneMapPanel zones={zones} selectedZone={selectedZone} onSelectZone={setSelectedZone} />
            <WarzoneSquadPanel mode={mode} members={squad} />
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <GlowingCard className="p-6" glowColor="rgba(251, 191, 36, 0.2)">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-amber-500/15 p-3">
                <Flame className="h-5 w-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Hot Zone Readout</h3>
                <p className="text-sm text-slate-400">Real-time drop advice generated from the selected map lane.</p>
              </div>
            </div>
            <div className="space-y-3 text-sm leading-7 text-slate-300">
              <p>
                <span className="font-semibold text-white">{selectedZoneData.name}</span> is tagged as a <span className="capitalize text-white">{selectedZoneData.risk}</span> risk opening.
                Pair it with <span className="font-semibold text-white">{selectedLoadoutData.name}</span> if the squad wants early map control.
              </p>
              <p>
                For this mode, the safest path is to loot one side lane, stabilize shields, then cut toward the center after the first collapse.
              </p>
            </div>
          </GlowingCard>

          <GlowingCard className="p-6" glowColor="rgba(34, 211, 238, 0.2)">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-500/15 p-3">
                <WandSparkles className="h-5 w-5 text-cyan-300" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Implementation Track</h3>
                <p className="text-sm text-slate-400">This is the currently delivered slice from the absent Warzone spec.</p>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                'Route and game hub integration',
                'Premium animated lobby shell',
                'Mode, loadout, and drop selection',
                'Queue console with progress state',
                'Tactical map with selectable zones',
                'Squad and mission panels',
              ].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300"
                >
                  <div className="flex items-center gap-2 text-white">
                    <Sparkles className="h-4 w-4 text-cyan-300" />
                    <span className="font-semibold">{item}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlowingCard>
        </section>

        <AnimatePresence>
          {queueState === 'ready' ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 right-6 z-40 max-w-sm rounded-[1.75rem] border border-emerald-300/25 bg-[linear-gradient(160deg,rgba(10,18,34,0.96),rgba(6,28,36,0.92))] p-5 shadow-[0_24px_80px_rgba(4,10,24,0.45)]"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-emerald-500/15 p-3">
                  <Shield className="h-5 w-5 text-emerald-300" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Lobby locked</h4>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    Match shell is ready. When the full Warzone spec is added to the repo, this queue card becomes the handoff point into the live arena.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}
