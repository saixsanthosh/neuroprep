import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { RequireAuth } from './components/auth/require-auth'
import { RequireLearningProfile } from './components/auth/require-learning-profile'
import { Skeleton } from './components/ui/skeleton'
import { DashboardLayout } from './pages/dashboard-layout'
import { AuthCallbackPage } from './pages/auth-callback-page'
import { LandingPage } from './pages/landing-page'
import { LoginPage } from './pages/login-page'
import { NeuroProject } from './pages/neuroproject'
import { NotFoundPage } from './pages/not-found-page'
import { RegisterPage } from './pages/register-page'

const DashboardHomePage = lazy(() =>
  import('./pages/dashboard-home-page').then((module) => ({ default: module.DashboardHomePage })),
)
const AITutorPage = lazy(() =>
  import('./pages/ai-tutor-page').then((module) => ({ default: module.AITutorPage })),
)
const NotesPage = lazy(() => import('./pages/notes-page').then((module) => ({ default: module.NotesPage })))
const PlannerPage = lazy(() =>
  import('./pages/planner-page').then((module) => ({ default: module.PlannerPage })),
)
const MockTestsPage = lazy(() =>
  import('./pages/mock-tests-page').then((module) => ({ default: module.MockTestsPage })),
)
const AnalyticsPage = lazy(() =>
  import('./pages/analytics-page').then((module) => ({ default: module.AnalyticsPage })),
)
const GamesPage = lazy(() => import('./pages/games-page').then((module) => ({ default: module.GamesPage })))
const ChessPage = lazy(() => import('./pages/chess-page').then((module) => ({ default: module.ChessPage })))
const TimerPage = lazy(() => import('./pages/timer-page').then((module) => ({ default: module.TimerPage })))
const SettingsPage = lazy(() =>
  import('./pages/settings-page').then((module) => ({ default: module.SettingsPage })),
)
const OnboardingPage = lazy(() =>
  import('./pages/onboarding-page').then((module) => ({ default: module.OnboardingPage })),
)
const ModularDashboardPage = lazy(() =>
  import('./pages/modular-dashboard-page').then((module) => ({ default: module.ModularDashboardPage })),
)

function RouteLoader() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-1/3" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

function App() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/neuroproject" element={<NeuroProject />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route
          path="/onboarding"
          element={
            <RequireAuth>
              <OnboardingPage />
            </RequireAuth>
          }
        />

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <RequireLearningProfile>
                <DashboardLayout />
              </RequireLearningProfile>
            </RequireAuth>
          }
        >
          <Route index element={<DashboardHomePage />} />
          <Route path="modular" element={<ModularDashboardPage />} />
          <Route path="ai-tutor" element={<AITutorPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="planner" element={<PlannerPage />} />
          <Route path="mock-tests" element={<MockTestsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="games" element={<GamesPage />} />
          <Route path="games/chess" element={<ChessPage />} />
          <Route path="timer" element={<TimerPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

export default App
