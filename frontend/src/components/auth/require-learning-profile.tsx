import { Navigate, useLocation } from 'react-router-dom'
import { Button } from '../ui/button'

import { useLearningProfile } from '../../contexts/learning-profile-context'

export function RequireLearningProfile({ children }: { children: React.ReactNode }) {
  const { isLoading, hasResolvedProfile, needsOnboarding, profileError, refreshProfile } = useLearningProfile()
  const location = useLocation()

  if (isLoading || !hasResolvedProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-hero-gradient">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    )
  }

  if (profileError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-hero-gradient px-4">
        <div className="glass-panel max-w-lg space-y-4 rounded-[2rem] p-8 text-center">
          <h1 className="text-2xl font-bold text-white">Learning workspace unavailable</h1>
          <p className="text-sm leading-7 text-slate-300">{profileError}</p>
          <Button onClick={() => void refreshProfile()}>Retry loading profile</Button>
        </div>
      </div>
    )
  }

  if (needsOnboarding) {
    return <Navigate to="/onboarding" state={{ from: location }} replace />
  }

  return <>{children}</>
}
