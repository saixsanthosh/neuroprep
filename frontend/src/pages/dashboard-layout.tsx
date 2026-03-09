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
    <div className="min-h-screen text-[var(--text-main)]" style={{ background: 'var(--bg-main)' }}>
      <div className="mx-auto grid min-h-screen w-full gap-4 px-3 py-4 sm:px-4 lg:grid-cols-[280px_1fr] lg:px-6 xl:px-8">
        <div className="hidden lg:block">
          <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((prev) => !prev)} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="glass-panel flex min-h-[calc(100vh-2rem)] flex-col"
        >
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-white/10 bg-[#070c1bcc]/80 px-3 backdrop-blur-xl sm:h-18 sm:px-4 lg:px-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setShowMobileSidebar((prev) => !prev)}
                className="rounded-xl border border-white/15 bg-white/10 px-2.5 py-1.5 text-xs text-white sm:px-3 sm:py-2 sm:text-sm lg:hidden"
              >
                Menu
              </button>
              <div className="relative hidden sm:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  className="h-9 w-48 rounded-2xl border border-white/15 bg-white/5 pl-10 pr-3 text-sm text-[var(--text-main)] placeholder:text-muted focus:border-accent-cyan/60 focus:outline-none md:w-64 lg:w-80"
                  placeholder="Search notes, tasks, analytics"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <button className="rounded-xl border border-white/15 bg-white/10 p-1.5 text-white transition hover:rotate-6 hover:bg-white/20 sm:p-2" type="button">
                <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
              <Link
                to="/dashboard/settings"
                className="rounded-2xl border border-white/15 bg-white/10 px-2 py-1.5 text-xs text-slate-300 sm:px-3 sm:py-2 sm:text-sm"
              >
                {user?.name ?? user?.username ?? 'Student'}
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5 px-2 sm:gap-2 sm:px-3">
                <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </header>

          {showMobileSidebar && (
            <div className="fixed inset-0 z-40 bg-black/60 p-4 lg:hidden" onClick={() => setShowMobileSidebar(false)}>
              <div className="h-full w-[280px]" onClick={(event) => event.stopPropagation()}>
                <Sidebar collapsed={false} onToggle={() => setShowMobileSidebar(false)} />
              </div>
            </div>
          )}

          <main className="flex-1 overflow-x-hidden p-3 sm:p-4 lg:p-6">
            <Outlet />
          </main>
        </motion.div>
      </div>
    </div>
  )
}
