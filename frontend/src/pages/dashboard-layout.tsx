import { motion } from 'framer-motion'
import { Bell, LogOut, Search } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, Outlet } from 'react-router-dom'

import { useAuth } from '../contexts/auth-context'
import { Sidebar } from '../components/layout/sidebar'
import { ThemeToggle } from '../components/ui/theme-toggle'
import { Button } from '../components/ui/button'

export function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-hero-gradient text-[var(--text-main)]">
      <div className="section-wrap grid min-h-screen gap-4 py-4 lg:grid-cols-[auto_1fr]">
        <div className="hidden lg:block">
          <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((prev) => !prev)} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="glass-panel flex min-h-[calc(100vh-2rem)] flex-col"
        >
          <header className="sticky top-0 z-20 flex h-20 items-center justify-between gap-4 border-b border-white/10 bg-[#070c1bcc]/80 px-4 backdrop-blur-xl sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowMobileSidebar((prev) => !prev)}
                className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white lg:hidden"
              >
                Menu
              </button>
              <div className="relative hidden sm:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  className="h-10 w-72 rounded-2xl border border-white/15 bg-white/5 pl-10 pr-3 text-sm text-[var(--text-main)] placeholder:text-muted focus:border-accent-cyan/60 focus:outline-none"
                  placeholder="Search notes, tasks, analytics"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button className="rounded-xl border border-white/15 bg-white/10 p-2 text-white transition hover:rotate-6 hover:bg-white/20" type="button">
                <Bell className="h-4 w-4" />
              </button>
              <Link
                to="/dashboard/settings"
                className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-xs text-slate-300 sm:text-sm"
              >
                {user?.name ?? user?.username ?? 'Student'}
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </header>

          {showMobileSidebar && (
            <div className="fixed inset-0 z-40 bg-black/60 p-4 lg:hidden" onClick={() => setShowMobileSidebar(false)}>
              <div className="h-full w-72" onClick={(event) => event.stopPropagation()}>
                <Sidebar collapsed={false} onToggle={() => setShowMobileSidebar(false)} />
              </div>
            </div>
          )}

          <main className="flex-1 overflow-x-hidden p-4 sm:p-6">
            <Outlet />
          </main>
        </motion.div>
      </div>
    </div>
  )
}
