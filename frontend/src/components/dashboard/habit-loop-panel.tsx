import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Award, BellRing, Flame, Sparkles, Trophy } from 'lucide-react'

import {
  getGamificationSummary,
  type Achievement,
  type DailyChallenge,
  type GamificationSummary,
  type HabitLeaderboardEntry,
  type MasteryTrack,
  type StudyMission,
} from '../../lib/api'
import { Badge } from '../ui/badge'
import { Card, CardDescription, CardTitle } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-3 rounded-full bg-white/10 p-[3px]">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-500"
      />
    </div>
  )
}

function ChallengeCard({ challenge }: { challenge: DailyChallenge }) {
  const progress = Math.round((challenge.progress_count / challenge.target_count) * 100)
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">{challenge.title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-400">{challenge.description}</p>
        </div>
        <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-200">
          +{challenge.reward_xp} XP
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <span>
          {challenge.progress_count}/{challenge.target_count}
        </span>
        <span>{challenge.reward_claimed ? 'Completed' : 'In progress'}</span>
      </div>
      <div className="mt-2">
        <ProgressBar value={progress} />
      </div>
    </div>
  )
}

function MissionCard({ mission }: { mission: StudyMission | null | undefined }) {
  if (!mission) {
    return (
      <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
        No active mission is running yet.
      </div>
    )
  }

  const progress = Math.round((mission.progress_count / mission.target_count) * 100)
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">{mission.title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-400">{mission.description}</p>
        </div>
        <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-200">
          +{mission.reward_xp} XP
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <span>
          {mission.progress_count}/{mission.target_count}
        </span>
        <span>{mission.status}</span>
      </div>
      <div className="mt-2">
        <ProgressBar value={progress} />
      </div>
      {mission.badge_name ? <p className="mt-3 text-xs text-cyan-200">Badge reward: {mission.badge_name}</p> : null}
    </div>
  )
}

function AchievementPills({ achievements }: { achievements: Achievement[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {achievements.length ? (
        achievements.map((achievement) => (
          <span
            key={achievement.id}
            className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200"
          >
            {achievement.badge_name}
          </span>
        ))
      ) : (
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
          No badges unlocked yet
        </span>
      )}
    </div>
  )
}

function LeaderboardList({ entries }: { entries: HabitLeaderboardEntry[] }) {
  return (
    <div className="space-y-3">
      {entries.length ? (
        entries.map((entry) => (
          <div key={entry.user_id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">
                #{entry.rank} {entry.username}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Level {entry.level} • {entry.streak} day streak
              </p>
            </div>
            <span className="text-sm font-semibold text-cyan-200">{entry.xp} XP</span>
          </div>
        ))
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400">
          Leaderboard data will appear after XP events are recorded.
        </div>
      )}
    </div>
  )
}

function MasteryTracks({ tracks }: { tracks: MasteryTrack[] }) {
  return (
    <div className="space-y-4">
      {tracks.map((track) => (
        <div key={track.label}>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-white">{track.label}</span>
            <span className="text-cyan-200">{track.progress}%</span>
          </div>
          <ProgressBar value={track.progress} />
        </div>
      ))}
    </div>
  )
}

export function HabitLoopPanel() {
  const [summary, setSummary] = useState<GamificationSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const load = async () => {
      setIsLoading(true)
      setError('')
      try {
        const data = await getGamificationSummary()
        if (!active) return
        setSummary(data)
      } catch {
        if (!active) return
        setError('Habit loop data is not available right now.')
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void load()
    return () => {
      active = false
    }
  }, [])

  if (isLoading) {
    return <Skeleton className="h-[26rem] w-full rounded-[2rem] bg-white/5" />
  }

  if (!summary || error) {
    return (
      <Card className="glass-panel p-6">
        <CardTitle className="text-xl text-white">Habit Loop System</CardTitle>
        <CardDescription className="mt-2 text-slate-400">{error || 'No habit loop data available.'}</CardDescription>
      </Card>
    )
  }

  const { profile, reminder_message, encouragement_message, active_challenges, active_mission, achievements, leaderboard_preview, mastery_tracks } = summary
  const levelProgress = Math.round(
    (1 - profile.xp_to_next_level / Math.max(profile.level * 120, 1)) * 100,
  )

  return (
    <Card className="glass-panel p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <CardTitle className="text-2xl text-white">Habit Loop Engine</CardTitle>
          <CardDescription className="mt-2 text-slate-400">
            Daily streaks, XP, levels, missions, challenges, badges, and weekly rankings.
          </CardDescription>
        </div>
        <Badge className="gap-2 border-white/15 bg-white/10 text-white">
          <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
          +{profile.xp} XP total
        </Badge>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3 text-white">
                <Flame className="h-5 w-5 text-orange-300" />
                <span className="text-sm font-semibold">Daily streak</span>
              </div>
              <p className="mt-4 text-3xl font-black text-white">{profile.current_streak}d</p>
              <p className="mt-2 text-xs text-slate-400">Longest: {profile.longest_streak}d</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3 text-white">
                <Sparkles className="h-5 w-5 text-cyan-300" />
                <span className="text-sm font-semibold">Level</span>
              </div>
              <p className="mt-4 text-3xl font-black text-white">{profile.level}</p>
              <p className="mt-2 text-xs text-slate-400">{profile.level_title}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3 text-white">
                <Award className="h-5 w-5 text-violet-300" />
                <span className="text-sm font-semibold">Streak freeze</span>
              </div>
              <p className="mt-4 text-3xl font-black text-white">{profile.streak_freezes}</p>
              <p className="mt-2 text-xs text-slate-400">Auto-protects one missed day</p>
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Level progress</p>
              <span className="text-xs text-cyan-200">{profile.xp_to_next_level} XP to next level</span>
            </div>
            <ProgressBar value={levelProgress} />
            {profile.last_reward_message ? (
              <p className="mt-3 text-sm text-emerald-200">{profile.last_reward_message}</p>
            ) : null}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
              <div className="mb-3 flex items-center gap-2 text-white">
                <BellRing className="h-4 w-4 text-amber-300" />
                <p className="text-sm font-semibold">Smart reminder</p>
              </div>
              <p className="text-sm leading-6 text-slate-300">{reminder_message}</p>
            </div>
            <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
              <div className="mb-3 flex items-center gap-2 text-white">
                <Sparkles className="h-4 w-4 text-cyan-300" />
                <p className="text-sm font-semibold">AI encouragement</p>
              </div>
              <p className="text-sm leading-6 text-slate-300">{encouragement_message}</p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-semibold text-white">Daily challenges</p>
              <div className="space-y-3">
                {active_challenges.map((challenge) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold text-white">Active mission</p>
              <MissionCard mission={active_mission} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
            <div className="mb-4 flex items-center gap-2 text-white">
              <Trophy className="h-4 w-4 text-amber-300" />
              <p className="text-sm font-semibold">Weekly leaderboard</p>
            </div>
            <LeaderboardList entries={leaderboard_preview} />
          </div>

          <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
            <div className="mb-4 flex items-center gap-2 text-white">
              <Award className="h-4 w-4 text-emerald-300" />
              <p className="text-sm font-semibold">Achievement badges</p>
            </div>
            <AchievementPills achievements={achievements} />
          </div>

          <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
            <p className="mb-4 text-sm font-semibold text-white">Progress visualization</p>
            <MasteryTracks tracks={mastery_tracks} />
          </div>
        </div>
      </div>
    </Card>
  )
}
