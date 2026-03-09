import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { LayoutGrid, Rows3, Settings } from 'lucide-react'

import { useLearningProfile } from '../contexts/learning-profile-context'
import {
  getAnalyticsStudyHours,
  getGamificationSummary,
  getStudyStats,
  type GamificationSummary,
  type StudyHoursResponse,
  type StudyStatsResponse,
} from '../lib/api'
import { ParticlesBackground } from '../components/ui/particles-background'
import { FloatingShapes } from '../components/ui/floating-shapes'
import { AnimatedGradientOrb } from '../components/ui/animated-gradient-orb'
import { Button } from '../components/ui/button'
import { StudyHoursWidget } from '../components/dashboard/widgets/study-hours-widget'
import { StreakWidget } from '../components/dashboard/widgets/streak-widget'
import { ProductivityWidget } from '../components/dashboard/widgets/productivity-widget'
import { TasksWidget } from '../components/dashboard/widgets/tasks-widget'
import { ActivityWidget } from '../components/dashboard/widgets/activity-widget'
import { SubjectProgressWidget } from '../components/dashboard/widgets/subject-progress-widget'
import { QuickActionsWidget } from '../components/dashboard/widgets/quick-actions-widget'
import { DailySummaryWidget } from '../components/dashboard/widgets/daily-summary-widget'
import { WeeklyGoalWidget } from '../components/dashboard/widgets/weekly-goal-widget'
import { WeeklyChartWidget } from '../components/dashboard/widgets/weekly-chart-widget'
import { XPLevelCard } from '../components/gamification/xp-level-card'

type DashboardTask = {
  id: string
  title: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
}

type ActivityType = 'study' | 'achievement' | 'goal'
type LayoutMode = 'editorial' | 'dense'

function todayLabel() {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
  }).format(new Date())
}

function readLayoutMode(): LayoutMode {
  const saved = window.localStorage.getItem('dashboard-layout-mode')
  return saved === 'dense' ? 'dense' : 'editorial'
}

export function ModularDashboardPage() {
  const { profile, dashboard, companionBrief } = useLearningProfile()
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(() => readLayoutMode())
  const [gamification, setGamification] = useState<GamificationSummary | null>(null)
  const [studyHours, setStudyHours] = useState<StudyHoursResponse | null>(null)
  const [studyStats, setStudyStats] = useState<StudyStatsResponse | null>(null)

  useEffect(() => {
    let active = true

    const loadGamification = async () => {
      try {
        const data = await getGamificationSummary()
        if (active) {
          setGamification(data)
        }
      } catch {
        if (active) {
          setGamification(null)
        }
      }
    }

    void loadGamification()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true

    const loadStudyStats = async () => {
      try {
        const data = await getStudyStats()
        if (active) {
          setStudyStats(data)
        }
      } catch {
        if (active) {
          setStudyStats(null)
        }
      }
    }

    void loadStudyStats()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true

    const loadStudyHours = async () => {
      try {
        const data = await getAnalyticsStudyHours()
        if (active) {
          setStudyHours(data)
        }
      } catch {
        if (active) {
          setStudyHours(null)
        }
      }
    }

    void loadStudyHours()
    return () => {
      active = false
    }
  }, [])

  const tasks = useMemo<DashboardTask[]>(() => {
    const brief = companionBrief?.daily_brief ?? []
    if (!brief.length) {
      return [
        {
          id: 'setup-task',
          title: 'Complete a study session to activate your modular widgets.',
          completed: false,
          priority: 'medium',
        },
      ]
    }

    return brief.slice(0, 4).map((item, index) => ({
      id: `task-${index}`,
      title: item,
      completed: false,
      priority: index === 0 ? 'high' : index === 1 ? 'medium' : 'low',
    }))
  }, [companionBrief?.daily_brief])

  const activities = useMemo<Array<{ id: string; type: ActivityType; message: string; time: string }>>(() => {
    const suggestions = companionBrief?.smart_suggestions ?? []
    const revisions = companionBrief?.revision_alerts ?? []
    const badges = gamification?.achievements ?? []
    const items: Array<{ id: string; type: ActivityType; message: string; time: string }> = []

    suggestions.slice(0, 2).forEach((message, index) => {
      items.push({ id: `suggestion-${index}`, type: 'study', message, time: 'AI suggestion' })
    })
    revisions.slice(0, 2).forEach((message, index) => {
      items.push({ id: `revision-${index}`, type: 'goal', message, time: 'Revision alert' })
    })
    badges.slice(0, 1).forEach((badge, index) => {
      items.push({ id: `badge-${index}`, type: 'achievement', message: `Unlocked ${badge.badge_name}`, time: 'Latest reward' })
    })

    return items.length
      ? items.slice(0, 5)
      : [{ id: 'empty-activity', type: 'goal', message: 'No recent activity yet. Start studying to fill the dashboard.', time: 'Waiting for activity' }]
  }, [companionBrief?.revision_alerts, companionBrief?.smart_suggestions, gamification?.achievements])

  const subjects = useMemo(() => {
    const source = companionBrief?.skill_progress_map ?? []
    if (!source.length) {
      return [{ name: 'Core mastery', progress: 0, color: 'from-cyan-400 to-blue-500' }]
    }

    return source.slice(0, 4).map((item, index) => ({
      name: item.label,
      progress: item.mastery,
      color:
        index % 4 === 0
          ? 'from-cyan-400 to-blue-500'
          : index % 4 === 1
            ? 'from-purple-400 to-pink-500'
            : index % 4 === 2
              ? 'from-amber-400 to-orange-500'
              : 'from-emerald-400 to-teal-500',
    }))
  }, [companionBrief?.skill_progress_map])

  const goals = useMemo(() => {
    const xp = gamification?.profile.xp ?? 0
    return [
      { title: 'Study Hours', current: studyStats?.weekly_hours ?? 0, target: Math.max(profile?.study_hours ?? 0, 6), unit: 'hrs' },
      { title: 'Quizzes', current: gamification?.profile.quizzes_completed ?? 0, target: 5, unit: 'quizzes' },
      { title: 'Questions', current: gamification?.profile.questions_solved ?? 0, target: Math.max(25, Math.ceil((xp + 1) / 10)), unit: 'qs' },
    ]
  }, [gamification?.profile.questions_solved, gamification?.profile.quizzes_completed, gamification?.profile.xp, profile?.study_hours, studyStats?.weekly_hours])

  const level = gamification?.profile.level ?? 1
  const totalXp = gamification?.profile.xp ?? 0
  const levelBase = Math.max(0, (level - 1) * 120)
  const currentLevelXp = Math.max(0, totalXp - levelBase)
  const xpForNextLevel = Math.max(currentLevelXp + (gamification?.profile.xp_to_next_level ?? 120), 120)

  const sectionClassName =
    layoutMode === 'dense'
      ? 'grid gap-3 sm:gap-4 xl:grid-cols-12'
      : 'grid gap-4 sm:gap-6 xl:grid-cols-12'

  const setMode = (nextMode: LayoutMode) => {
    setLayoutMode(nextMode)
    window.localStorage.setItem('dashboard-layout-mode', nextMode)
  }

  return (
    <div className="relative min-h-screen pb-6 sm:pb-8">
      <ParticlesBackground />
      <FloatingShapes />
      <AnimatedGradientOrb color="cyan" size="lg" top="5%" left="5%" />
      <AnimatedGradientOrb color="purple" size="md" top="50%" right="10%" />
      <AnimatedGradientOrb color="pink" size="sm" bottom="10%" left="15%" />

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-6 sm:gap-4"
        >
          <div>
            <h1 className="text-gradient text-3xl font-black sm:text-4xl">Modular Dashboard</h1>
            <p className="mt-1 text-slate-300">
              A flexible dashboard view backed by your live profile, AI brief, and habit-loop progress.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant={layoutMode === 'editorial' ? 'primary' : 'secondary'} size="sm" onClick={() => setMode('editorial')} className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              Editorial
            </Button>
            <Button variant={layoutMode === 'dense' ? 'primary' : 'secondary'} size="sm" onClick={() => setMode('dense')} className="gap-2">
              <Rows3 className="h-4 w-4" />
              Dense
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setMode('editorial')} className="gap-2">
              <Settings className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </motion.div>

        <div className={sectionClassName}>
          <div className="xl:col-span-3">
            <StudyHoursWidget hours={studyStats?.today_hours ?? 0} trend={Math.max(0, Math.round((studyStats?.productivity_score ?? 0) / 8))} />
          </div>
          <div className="xl:col-span-3">
            <StreakWidget streak={gamification?.profile.current_streak ?? 0} longest={gamification?.profile.longest_streak ?? 0} />
          </div>
          <div className="xl:col-span-3">
            <ProductivityWidget score={companionBrief?.readiness_score ?? 0} />
          </div>
          <div className="xl:col-span-3">
            <XPLevelCard
              level={level}
              levelTitle={gamification?.profile.level_title ?? 'Beginner'}
              currentXP={currentLevelXp}
              xpForNextLevel={xpForNextLevel}
              totalXP={totalXp}
            />
          </div>

          <div className="xl:col-span-7">
            <WeeklyChartWidget points={studyHours?.daily ?? []} />
          </div>
          <div className="xl:col-span-5">
            <TasksWidget tasks={tasks} />
          </div>

          <div className="xl:col-span-4">
            <QuickActionsWidget />
          </div>
          <div className="xl:col-span-4">
            <DailySummaryWidget
              date={`Today, ${todayLabel()}`}
              studyTime={studyStats?.today_hours ?? 0}
              tasksCompleted={tasks.filter((task) => task.completed).length}
              totalTasks={tasks.length}
              focusScore={studyStats?.productivity_score ?? 0}
            />
          </div>
          <div className="xl:col-span-4">
            <ActivityWidget activities={activities} />
          </div>

          <div className="xl:col-span-6">
            <SubjectProgressWidget subjects={subjects} />
          </div>
          <div className="xl:col-span-6">
            <WeeklyGoalWidget goals={goals} />
          </div>
        </div>

        {!dashboard && !companionBrief && (
          <p className="mt-4 text-sm text-slate-400">
            Complete onboarding or sign in again if this dashboard remains empty.
          </p>
        )}
      </div>
    </div>
  )
}
