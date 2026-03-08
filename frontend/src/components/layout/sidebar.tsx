import { motion } from 'framer-motion'
import {
  BarChart3,
  Brain,
  CalendarDays,
  Gamepad2,
  LayoutDashboard,
  Menu,
  NotebookPen,
  Settings,
  Target,
  Timer,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { useAuth } from '../../contexts/auth-context'
import { cn } from '../../lib/utils'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'AI Tutor', icon: Brain, to: '/dashboard/ai-tutor' },
  { label: 'Notes', icon: NotebookPen, to: '/dashboard/notes' },
  { label: 'Study Planner', icon: CalendarDays, to: '/dashboard/planner' },
  { label: 'Mock Tests', icon: Target, to: '/dashboard/mock-tests' },
  { label: 'Analytics', icon: BarChart3, to: '/dashboard/analytics' },
  { label: 'Games', icon: Gamepad2, to: '/dashboard/games' },
  { label: 'Timer', icon: Timer, to: '/dashboard/timer' },
  { label: 'Settings', icon: Settings, to: '/dashboard/settings' },
]

type SidebarProps = {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user } = useAuth()
  const roleLabel = user?.role ? user.role[0].toUpperCase() + user.role.slice(1) : 'Guest'

  return (
    <motion.aside
      animate={{ width: collapsed ? 94 : 286 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="glass-panel sticky top-4 flex h-[calc(100vh-2rem)] flex-col p-4"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(56,189,248,0.95),rgba(124,58,237,0.95))] text-lg font-bold text-white shadow-[0_0_28px_rgba(34,211,238,0.28)]">
            N
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate font-heading text-lg font-semibold text-white">NeuroPrep</p>
              <p className="text-xs text-slate-400">{roleLabel} workspace</p>
            </div>
          )}
        </div>

        <button
          className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:rotate-90 hover:border-white/20 hover:text-white"
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
          <p className="mt-2 text-lg font-semibold text-white">AI-guided prep is active</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Keep your focus timer running to unlock break games and preserve streak rewards.
          </p>
        </div>
      )}

      <nav className="mt-6 flex-1 space-y-2">
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
        <div className="rounded-[1.7rem] border border-white/10 bg-white/5 p-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Session profile</p>
          <p className="mt-2 text-sm font-semibold text-white">{user?.name ?? user?.username ?? 'Guest user'}</p>
          <p className="mt-1 text-xs text-slate-400">{user?.email ?? 'No email loaded'}</p>
        </div>
      )}
    </motion.aside>
  )
}
