import { motion } from 'framer-motion'

import { Button } from '../components/ui/button'
import { Card, CardDescription, CardTitle } from '../components/ui/card'

const exams = [
  {
    title: 'JEE Full-Length Mock',
    duration: '180 min',
    negativeMarking: true,
  },
  {
    title: 'NEET Biology Intensive',
    duration: '90 min',
    negativeMarking: true,
  },
  {
    title: 'UPSC GS Mini Sim',
    duration: '120 min',
    negativeMarking: false,
  },
]

export function MockTestsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Mock Exam Engine</h1>
        <p className="mt-1 text-muted">Timed exams with scoring, ranking, and performance analysis.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {exams.map((exam, index) => (
          <motion.div
            key={exam.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <Card className="h-full">
              <CardTitle>{exam.title}</CardTitle>
              <CardDescription className="mt-1">Duration: {exam.duration}</CardDescription>
              <p className="mt-3 text-sm text-muted">
                Negative marking: <span>{exam.negativeMarking ? 'Enabled' : 'Disabled'}</span>
              </p>
              <Button className="mt-5 w-full">Start Mock</Button>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardTitle>Recent Mock Results</CardTitle>
        <CardDescription className="mb-4">Last three test outcomes and analysis snapshots.</CardDescription>
        <div className="space-y-2">
          {[
            { exam: 'JEE Full-Length', score: '184/300', rank: 321 },
            { exam: 'NEET Biology Intensive', score: '521/720', rank: 188 },
            { exam: 'College Midterm Sim', score: '78/100', rank: 42 },
          ].map((result) => (
            <div key={result.exam} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
              <span>{result.exam}</span>
              <span className="text-muted">
                {result.score} · Rank {result.rank}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
