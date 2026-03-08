/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as api from '../lib/api'
import { useAuth } from './auth-context'
import type {
  CompanionBriefResponse,
  LanguagePathResponse,
  LearningDashboardResponse,
  LearningProfile,
  OnboardingOptionsResponse,
} from '../lib/api'

type LearningProfileContextValue = {
  profile: LearningProfile | null
  dashboard: LearningDashboardResponse | null
  onboardingOptions: OnboardingOptionsResponse | null
  companionBrief: CompanionBriefResponse | null
  languagePath: LanguagePathResponse | null
  isLoading: boolean
  hasResolvedProfile: boolean
  needsOnboarding: boolean
  profileError: string | null
  refreshProfile: () => Promise<void>
  saveProfile: (payload: Parameters<typeof api.saveLearningProfile>[0]) => Promise<void>
}

const LearningProfileContext = createContext<LearningProfileContextValue | null>(null)

export function LearningProfileProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  const userId = user?.id
  const [profile, setProfile] = useState<LearningProfile | null>(null)
  const [dashboard, setDashboard] = useState<LearningDashboardResponse | null>(null)
  const [onboardingOptions, setOnboardingOptions] = useState<OnboardingOptionsResponse | null>(null)
  const [companionBrief, setCompanionBrief] = useState<CompanionBriefResponse | null>(null)
  const [languagePath, setLanguagePath] = useState<LanguagePathResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasResolvedProfile, setHasResolvedProfile] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)

  const loadOptions = useCallback(async () => {
    try {
      const options = await api.getOnboardingOptions()
      setOnboardingOptions(options)
    } catch {
      setOnboardingOptions(null)
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!isAuthenticated) {
      setProfile(null)
      setDashboard(null)
      setCompanionBrief(null)
      setLanguagePath(null)
      setHasResolvedProfile(false)
      setProfileError(null)
      return
    }

    setIsLoading(true)
    setProfileError(null)
    try {
      const profileResponse = await api.getLearningProfile()
      setProfile(profileResponse)

      const [dashboardResponse, companionResponse] = await Promise.all([
        api.getLearningDashboard(),
        api.getCompanionDailyBrief(),
      ])
      setDashboard(dashboardResponse)
      setCompanionBrief(companionResponse)

      if (profileResponse.goal_type === 'language_learning') {
        try {
          setLanguagePath(await api.getLanguagePath())
        } catch {
          setLanguagePath(null)
        }
      } else {
        setLanguagePath(null)
      }
      setHasResolvedProfile(true)
    } catch (error: unknown) {
      const status =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { status?: number } }).response?.status
          : undefined

      if (status === 404) {
        setProfile(null)
        setDashboard(null)
        setCompanionBrief(null)
        setLanguagePath(null)
        setProfileError(null)
      } else {
        setProfile(null)
        setDashboard(null)
        setCompanionBrief(null)
        setLanguagePath(null)
        setProfileError('Unable to load your personalized learning workspace right now.')
      }
      setHasResolvedProfile(true)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  const saveProfile = useCallback(
    async (payload: Parameters<typeof api.saveLearningProfile>[0]) => {
      setIsLoading(true)
      setProfileError(null)
      try {
        const saved = await api.saveLearningProfile(payload)
        setProfile(saved)

        const [dashboardResponse, companionResponse] = await Promise.all([
          api.getLearningDashboard(),
          api.getCompanionDailyBrief(),
        ])
        setDashboard(dashboardResponse)
        setCompanionBrief(companionResponse)

        if (saved.goal_type === 'language_learning') {
          try {
            setLanguagePath(await api.getLanguagePath())
          } catch {
            setLanguagePath(null)
          }
        } else {
          setLanguagePath(null)
        }
        setHasResolvedProfile(true)
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    void loadOptions()
  }, [loadOptions])

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      setProfile(null)
      setDashboard(null)
      setCompanionBrief(null)
      setLanguagePath(null)
      setHasResolvedProfile(false)
      setProfileError(null)
      return
    }

    void refreshProfile()
  }, [isAuthenticated, userId, refreshProfile])

  const value = useMemo<LearningProfileContextValue>(
    () => ({
      profile,
      dashboard,
      onboardingOptions,
      companionBrief,
      languagePath,
      isLoading,
      hasResolvedProfile,
      needsOnboarding: isAuthenticated && hasResolvedProfile && !profile?.onboarding_completed && !profileError,
      profileError,
      refreshProfile,
      saveProfile,
    }),
    [
      profile,
      dashboard,
      onboardingOptions,
      companionBrief,
      languagePath,
      isLoading,
      hasResolvedProfile,
      isAuthenticated,
      profileError,
      refreshProfile,
      saveProfile,
    ],
  )

  return <LearningProfileContext.Provider value={value}>{children}</LearningProfileContext.Provider>
}

export function useLearningProfile() {
  const ctx = useContext(LearningProfileContext)
  if (!ctx) throw new Error('useLearningProfile must be used within LearningProfileProvider')
  return ctx
}
