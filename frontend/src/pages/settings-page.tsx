import { useState } from 'react'

import { Button } from '../components/ui/button'
import { Card, CardDescription, CardTitle } from '../components/ui/card'
import { ThemeToggle } from '../components/ui/theme-toggle'

export function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(true)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Settings</h1>
        <p className="mt-1 text-muted">Customize preferences, theme, and AI recommendation behavior.</p>
      </div>

      <Card>
        <CardTitle>Appearance</CardTitle>
        <CardDescription className="mb-4">Dark mode is default, switch anytime.</CardDescription>
        <ThemeToggle />
      </Card>

      <Card>
        <CardTitle>Preferences</CardTitle>
        <CardDescription className="mb-4">Micro-interaction toggles and reminders.</CardDescription>
        <div className="space-y-3">
          <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
            Push Notifications
            <button
              type="button"
              onClick={() => setNotifications((prev) => !prev)}
              className={`relative h-6 w-11 rounded-full transition ${notifications ? 'bg-accent-cyan/70' : 'bg-white/20'}`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${notifications ? 'left-[22px]' : 'left-0.5'}`}
              />
            </button>
          </label>

          <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
            Weekly AI Report
            <button
              type="button"
              onClick={() => setWeeklyReport((prev) => !prev)}
              className={`relative h-6 w-11 rounded-full transition ${weeklyReport ? 'bg-accent-cyan/70' : 'bg-white/20'}`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${weeklyReport ? 'left-[22px]' : 'left-0.5'}`}
              />
            </button>
          </label>
        </div>
      </Card>

      <Card>
        <CardTitle>Data Export</CardTitle>
        <CardDescription className="mb-4">Backup study logs, notes, and analytics.</CardDescription>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary">Export Study Logs</Button>
          <Button variant="secondary">Export Notes</Button>
          <Button variant="secondary">Export Analytics</Button>
        </div>
      </Card>
    </div>
  )
}
