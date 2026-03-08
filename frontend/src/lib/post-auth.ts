import { getLearningProfile } from './api'

type ApiLikeError = {
  response?: {
    status?: number
  }
}

export async function resolvePostAuthRoute(defaultRoute = '/dashboard'): Promise<string> {
  try {
    const profile = await getLearningProfile()
    return profile.onboarding_completed ? defaultRoute : '/onboarding'
  } catch (error: unknown) {
    const status =
      error && typeof error === 'object' && 'response' in error
        ? (error as ApiLikeError).response?.status
        : undefined

    if (status === 404) {
      return '/onboarding'
    }

    return defaultRoute
  }
}
