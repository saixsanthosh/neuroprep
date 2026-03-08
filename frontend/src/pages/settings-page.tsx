import { motion } from 'framer-motion'
import { LogOut, Mail, ShieldCheck, User } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../contexts/auth-context'
import { Button } from '../components/ui/button'
import { Card, CardDescription, CardTitle } from '../components/ui/card'
import { ThemeToggle } from '../components/ui/theme-toggle'

export function SettingsPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(true)

  const handleLogoutAll = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Settings</h1>
        <p className="mt-1 text-slate-400">
          Account profile, theme controls, alerts, and quick data actions.
        </p>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-white">Profile</CardTitle>
              <CardDescription>Your current account identity and access state.</CardDescription>
            </div>
            <span className="premium-pill w-fit gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-300" />
              Secure session
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
              <User className="h-5 w-5 text-slate-400" />
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">Name</p>
              <p className="mt-2 text-base font-semibold text-white">{user?.name ?? 'Not set'}</p>
            </div>
            <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
              <Mail className="h-5 w-5 text-slate-400" />
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">Email</p>
              <p className="mt-2 text-base font-semibold text-white">{user?.email ?? 'Not set'}</p>
            </div>
            <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
              <User className="h-5 w-5 text-slate-400" />
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">Username / Role</p>
              <p className="mt-2 text-base font-semibold text-white">
                {user?.username ?? 'unknown'} / {user?.role ?? 'student'}
              </p>
            </div>
          </div>

          <Button variant="secondary" className="mt-6 gap-2" onClick={handleLogoutAll}>
            <LogOut className="h-4 w-4" />
            Logout from this device
          </Button>
        </Card>
      </motion.div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-6">
          <CardTitle className="text-white">Appearance</CardTitle>
          <CardDescription className="mb-4">
            Switch the visual mode without leaving the dashboard.
          </CardDescription>
          <ThemeToggle />
        </Card>

        <Card className="p-6">
          <CardTitle className="text-white">Preferences</CardTitle>
          <CardDescription className="mb-4">
            Notification and AI report controls with animated toggles.
          </CardDescription>
          <div className="space-y-3">
            <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white">
              Push notifications
              <button
                type="button"
                onClick={() => setNotifications((prev) => !prev)}
                className={`relative h-6 w-11 rounded-full transition ${notifications ? 'bg-cyan-400/70' : 'bg-white/20'}`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${notifications ? 'left-[22px]' : 'left-0.5'}`}
                />
              </button>
            </label>

            <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white">
              Weekly AI report
              <button
                type="button"
                onClick={() => setWeeklyReport((prev) => !prev)}
                className={`relative h-6 w-11 rounded-full transition ${weeklyReport ? 'bg-cyan-400/70' : 'bg-white/20'}`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${weeklyReport ? 'left-[22px]' : 'left-0.5'}`}
                />
              </button>
            </label>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <CardTitle className="text-white">Data Export</CardTitle>
        <CardDescription className="mb-4">
          Backup study logs, notes, and analytics snapshots.
        </CardDescription>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary">Export Study Logs</Button>
          <Button variant="secondary">Export Notes</Button>
          <Button variant="secondary">Export Analytics</Button>
        </div>
      </Card>
    </div>
  )
}
