import { motion } from 'framer-motion'
import {
  BarChart3,
  Brain,
  CalendarDays,
  Files,
  Gamepad2,
  LayoutDashboard,
  LibraryBig,
  Languages,
  Menu,
  MessagesSquare,
  NotebookPen,
  ScanSearch,
  Settings,
  Target,
  Timer,
  BookMarked,
  Grid3x3,
  ClipboardList,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { useAuth } from '../../contexts/auth-context'
import { useLearningProfile } from '../../contexts/learning-profile-context'
import { cn } from '../../lib/utils'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Modular View', icon: Grid3x3, to: '/dashboard/modular' },
  { label: 'AI Tutor', icon: Brain, to: '/dashboard/ai-tutor' },
  { label: 'Notes', icon: NotebookPen, to: '/dashboard/notes' },
  { label: 'Document Learning', icon: Files, to: '/dashboard/document-learning' },
  { label: 'Research Mode', icon: ScanSearch, to: '/dashboard/research-mode' },
  { label: 'Flashcards', icon: BookMarked, to: '/dashboard/flashcards' },
  { label: 'Revision', icon: LibraryBig, to: '/dashboard/revision' },
  { label: 'Study Tracker', icon: ClipboardList, to: '/dashboard/tracker' },
  { label: 'Language Lab', icon: Languages, to: '/dashboard/language-lab' },
  { label: 'Study Planner', icon: CalendarDays, to: '/dashboard/planner' },
  { label: 'Mock Tests', icon: Target, to: '/dashboard/mock-tests' },
  { label: 'Analytics', icon: BarChart3, to: '/dashboard/analytics' },
  { label: 'Games', icon: Gamepad2, to: '/dashboard/games' },
  { label: 'Community', icon: MessagesSquare, to: '/dashboard/community' },
  { label: 'Timer', icon: Timer, to: '/dashboard/timer' },
  { label: 'Settings', icon: Settings, to: '/dashboard/settings' },
]

type SidebarProps = {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user } = useAuth()
  const { profile, dashboard } = useLearningProfile()
  const focusTracks = dashboard?.focus_tracks?.slice(0, 3) ?? []
  const goalLabel = profile?.goal_type ? profile.goal_type.replaceAll('_', ' ') : 'student learning'
  const modulePreview = dashboard?.modules?.slice(0, 3) ?? []

  return (
    <motion.aside
      animate={{ width: collapsed ? 94 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="glass-panel sticky top-4 flex h-[calc(100vh-2rem)] flex-col overflow-hidden p-4"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(56,189,248,0.95),rgba(124,58,237,0.95))] text-lg font-bold text-white shadow-[0_0_28px_rgba(34,211,238,0.28)]">
            N
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate font-heading text-lg font-semibold text-white">NeuroPrep</p>
              <p className="truncate text-xs text-slate-400">{goalLabel}</p>
            </div>
          )}
        </div>

        <button
          className="shrink-0 rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:rotate-90 hover:border-white/20 hover:text-white"
          onClick={onToggle}
          type="button"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {!collapsed && (
        <div className="mt-6 rounded-[1.7rem] border border-white/10 bg-[linear-gradient(145deg,rgba(14,22,54,0.95),rgba(11,18,40,0.75))] p-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Study mode</p>
          <p className="mt-2 text-lg font-semibold leading-tight text-white">
            {dashboard?.hero_title ?? 'AI-guided prep is active'}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            {dashboard?.hero_subtitle ??
              'Keep your focus timer running to unlock break games and preserve streak rewards.'}
          </p>
          {focusTracks.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {focusTracks.map((track) => (
                <span
                  key={track}
                  className="rounded-full border border-cyan-300/15 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200"
                >
                  {track}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <nav className="mt-6 flex-1 space-y-2 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
        {navItems.map(({ label, icon: Icon, to }, index) => (
          <motion.div
            key={to}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.06 * index }}
          >
            <NavLink
              to={to}
              end={to === '/dashboard'}
              className={({ isActive }) =>
                cn(
                  'group relative flex items-center gap-3 overflow-hidden rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-300',
                  isActive
                    ? 'border border-cyan-300/15 bg-white/10 text-white shadow-soft-glow'
                    : 'border border-transparent text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-white',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active-pill"
                      className="absolute inset-y-2 left-1 w-1 rounded-full bg-gradient-to-b from-cyan-300 to-violet-400"
                    />
                  )}
                  <span
                    className={cn(
                      'relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-300',
                      isActive
                        ? 'border-cyan-300/20 bg-cyan-300/10 text-cyan-200'
                        : 'border-white/10 bg-white/5 text-slate-400 group-hover:border-white/15 group-hover:text-white',
                    )}
                  >
                    <Icon className="h-4.5 w-4.5 transition-transform duration-300 group-hover:rotate-6" />
                  </span>
                  {!collapsed && <span className="truncate">{label}</span>}
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {!collapsed && (
        <div className="mt-4 space-y-3 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
          {modulePreview.length > 0 && (
            <div className="rounded-[1.7rem] border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Recommended stack</p>
              <div className="mt-3 space-y-2">
                {modulePreview.map((module) => (
                  <div key={module.id} className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                    <p className="truncate text-sm font-semibold text-white">{module.title}</p>
                    <p className="mt-1 truncate text-xs leading-5 text-slate-400">{module.category}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-[1.7rem] border border-white/10 bg-white/5 p-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Session profile</p>
            <p className="mt-2 truncate text-sm font-semibold text-white">{user?.name ?? user?.username ?? 'Guest user'}</p>
            <p className="mt-1 truncate text-xs text-slate-400">{user?.email ?? 'No email loaded'}</p>
          </div>
        </div>
      )}
    </motion.aside>
  )
}
