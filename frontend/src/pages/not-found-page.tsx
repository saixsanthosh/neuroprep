import { Link } from 'react-router-dom'

import { Button } from '../components/ui/button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-hero-gradient px-4 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-accent-cyan">404</p>
      <h1 className="mt-3 text-4xl font-bold">Page not found</h1>
      <p className="mt-2 max-w-md text-muted">The route you are looking for does not exist in this NeuroPrep build.</p>
      <Link to="/" className="mt-6">
        <Button>Back to Home</Button>
      </Link>
    </div>
  )
}
