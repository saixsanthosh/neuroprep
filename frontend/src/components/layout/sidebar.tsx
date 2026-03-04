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
  return (
    <motion.aside
      animate={{ width: collapsed ? 90 : 270 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="glass sticky top-4 flex h-[calc(100vh-2rem)] flex-col rounded-3xl p-4"
    >
      <div className="mb-8 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-cyan text-lg font-bold text-white">
            N
          </div>
          {!collapsed && (
            <div>
              <p className="font-heading text-lg font-semibold">NeuroPrep</p>
              <p className="text-xs text-muted">AI Study Companion</p>
            </div>
          )}
        </div>

        <button
          className="rounded-xl p-2 text-muted transition hover:rotate-90 hover:text-[var(--text-main)]"
          onClick={onToggle}
          type="button"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map(({ label, icon: Icon, to }, index) => (
          <motion.div
            key={to}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04 }}
          >
            <NavLink
              to={to}
              end={to === '/dashboard'}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-300',
                  isActive
                    ? 'bg-gradient-to-r from-primary-500/25 to-accent-cyan/15 text-white shadow-soft-glow'
                    : 'text-muted hover:bg-white/10 hover:text-[var(--text-main)]',
                )
              }
            >
              <Icon className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-6" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {!collapsed && (
        <div className="gradient-border mt-6 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-cyan/10 p-4">
          <p className="text-sm font-semibold">Focus Mode</p>
          <p className="mt-1 text-xs text-muted">Keep the timer running to unlock break games.</p>
        </div>
      )}
    </motion.aside>
  )
}
