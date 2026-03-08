import { motion } from 'framer-motion'
import { Loader2, LogOut, Mail, ShieldCheck, Sparkles, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../contexts/auth-context'
import { getWeeklyReport, requestPasswordReset } from '../lib/api'
import { Button } from '../components/ui/button'
import { Card, CardDescription, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { ThemeToggle } from '../components/ui/theme-toggle'

export function SettingsPage() {
  const { user, logout, updateProfile, isLoading } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(true)
  const [name, setName] = useState(user?.name ?? '')
  const [username, setUsername] = useState(user?.username ?? '')
  const [profileMessage, setProfileMessage] = useState('')
  const [profileError, setProfileError] = useState('')
  const [resetMessage, setResetMessage] = useState('')
  const [reportSummary, setReportSummary] = useState('')
  const [focusSubjects, setFocusSubjects] = useState<string[]>([])
  const [reportLoading, setReportLoading] = useState(true)

  useEffect(() => {
    setName(user?.name ?? '')
    setUsername(user?.username ?? '')
  }, [user?.name, user?.username])

  useEffect(() => {
    let active = true

    const loadReport = async () => {
      if (!weeklyReport || !user) {
        setReportLoading(false)
        return
      }

      setReportLoading(true)
      try {
        const report = await getWeeklyReport()
        if (!active) return
        setReportSummary(report.summary)
        setFocusSubjects(report.focus_subjects)
      } catch {
        if (!active) return
        setReportSummary('Unable to load the weekly AI report right now.')
        setFocusSubjects([])
      } finally {
        if (active) setReportLoading(false)
      }
    }

    void loadReport()
    return () => {
      active = false
    }
  }, [user, weeklyReport])

  const handleLogoutAll = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const handleProfileSave = async () => {
    setProfileError('')
    setProfileMessage('')

    if (!name.trim() || !username.trim()) {
      setProfileError('Name and username are required.')
      return
    }

    try {
      await updateProfile({ name: name.trim(), username: username.trim() })
      setProfileMessage('Profile updated successfully.')
    } catch (err: unknown) {
      const apiError =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { detail?: string } } })
          : null
      setProfileError(apiError?.response?.data?.detail || 'Unable to update profile.')
    }
  }

  const handlePasswordReset = async () => {
    setResetMessage('')
    if (!user?.email) {
      setProfileError('No email is available for password reset.')
      return
    }

    try {
      const response = await requestPasswordReset(user.email, `${window.location.origin}/login`)
      setResetMessage(response.message)
    } catch (err: unknown) {
      const apiError =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { detail?: string } } })
          : null
      setProfileError(apiError?.response?.data?.detail || 'Unable to send reset instructions.')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Settings</h1>
        <p className="mt-1 text-slate-400">
          Account controls, password recovery, theme state, and weekly AI planning.
        </p>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-white">Profile</CardTitle>
              <CardDescription>Editable identity, password reset, and account state.</CardDescription>
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
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">Username</p>
              <p className="mt-2 text-base font-semibold text-white">{user?.username ?? 'unknown'}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="settings-display-name" className="text-sm font-medium text-white">
                Display name
              </label>
              <Input
                id="settings-display-name"
                name="settings-display-name"
                placeholder="Enter display name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="settings-username" className="text-sm font-medium text-white">
                Username
              </label>
              <Input
                id="settings-username"
                name="settings-username"
                placeholder="Choose username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {profileError && (
            <p className="mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {profileError}
            </p>
          )}

          {profileMessage && (
            <p className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {profileMessage}
            </p>
          )}

          {resetMessage && (
            <p className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100">
              {resetMessage}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button className="gap-2" onClick={() => void handleProfileSave()} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Save profile
            </Button>
            <Button variant="secondary" className="gap-2" onClick={() => void handlePasswordReset()}>
              <Mail className="h-4 w-4" />
              Send password reset
            </Button>
            <Button variant="secondary" className="gap-2" onClick={handleLogoutAll}>
              <LogOut className="h-4 w-4" />
              Logout from this device
            </Button>
          </div>
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
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-white">Weekly AI Study Report</CardTitle>
            <CardDescription className="mt-1">
              Personalized recommendation output generated from your weak-topic signal.
            </CardDescription>
          </div>
          <span className="premium-pill w-fit gap-2">
            <Sparkles className="h-3.5 w-3.5 text-violet-300" />
            Live report
          </span>
        </div>

        {!weeklyReport ? (
          <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5 text-sm text-slate-400">
            Weekly AI report is currently turned off in preferences.
          </div>
        ) : reportLoading ? (
          <div className="flex items-center gap-3 rounded-[1.6rem] border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
            <Loader2 className="h-4 w-4 animate-spin text-cyan-300" />
            Generating this week&apos;s plan...
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-300">
              {reportSummary}
            </div>
            <div className="flex flex-wrap gap-2">
              {focusSubjects.length ? (
                focusSubjects.map((subject) => (
                  <span
                    key={subject}
                    className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200"
                  >
                    {subject}
                  </span>
                ))
              ) : (
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
                  No focus subjects recorded yet
                </span>
              )}
            </div>
          </div>
        )}
      </Card>

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
