import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'

import { useAnimatedNumber } from '../hooks/use-animated-number'
import { Card, CardDescription, CardTitle } from '../components/ui/card'

type Game = {
  name: string
  description: string
  score: number
}

const games: Game[] = [
  { name: 'Concept Blitz', description: 'Fast MCQ reaction challenge', score: 1380 },
  { name: 'Formula Hunter', description: 'Fill missing formulas before timeout', score: 1220 },
  { name: 'Memory Match', description: 'Pair concepts and definitions quickly', score: 1115 },
  { name: 'Diagram Rush', description: 'Label diagrams under pressure', score: 990 },
  { name: 'Quiz Battle', description: '60-second exam quiz duel', score: 1450 },
]

const leaderboard = [
  { player: 'Arjun', score: 15840 },
  { player: 'Maya', score: 14930 },
  { player: 'Santosh', score: 14475 },
  { player: 'Nisha', score: 13760 },
]

function GameCard({ game, delay }: { game: Game; delay: number }) {
  const score = useAnimatedNumber(game.score, 1300)

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="glass interactive-card rounded-3xl p-5"
    >
      <p className="font-semibold">{game.name}</p>
      <p className="mt-1 text-sm text-muted">{game.description}</p>
      <div className="mt-4 rounded-2xl border border-white/15 bg-white/5 p-3">
        <p className="text-xs text-muted">Best Score</p>
        <p className="mt-1 text-2xl font-bold">{score}</p>
      </div>
    </motion.div>
  )
}

export function GamesPage() {
  const totalScore = useAnimatedNumber(5798)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Break Mini Games</h1>
        <p className="mt-1 text-muted">Quick educational games available only in break sessions.</p>
      </div>

      <Card>
        <CardTitle>Total Score</CardTitle>
        <CardDescription>Animated score counter and leaderboard.</CardDescription>
        <div className="mt-3 flex items-center gap-3">
          <Trophy className="h-6 w-6 text-amber-300" />
          <p className="font-heading text-3xl font-bold">{totalScore}</p>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {games.map((game, index) => (
          <GameCard key={game.name} game={game} delay={index * 0.08} />
        ))}
      </div>

      <Card>
        <CardTitle>Leaderboard</CardTitle>
        <CardDescription className="mb-4">Top performers this week.</CardDescription>
        <div className="space-y-2">
          {leaderboard.map((entry, index) => (
            <motion.div
              key={entry.player}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <p className="text-sm">
                #{index + 1} {entry.player}
              </p>
              <p className="text-sm font-semibold">{entry.score}</p>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  )
}
