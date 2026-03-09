import { motion } from 'framer-motion'
import { Crown, Sparkles, Brain, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ParticlesBackground } from '../components/ui/particles-background'
import { FloatingShapes } from '../components/ui/floating-shapes'
import { AnimatedGradientOrb } from '../components/ui/animated-gradient-orb'
import { GlowingCard } from '../components/ui/glowing-card'

export function GamesHubPage() {
  const navigate = useNavigate()

  const games = [
    {
      title: 'Word Builder Arena',
      description: 'Unscramble letters and build words in this premium brain-training game',
      icon: Sparkles,
      color: 'from-violet-400 to-purple-500',
      glow: 'rgba(139, 92, 246, 0.4)',
      route: '/dashboard/games/word-builder',
    },
    {
      title: 'Chess Arena',
      description: 'Challenge your strategic thinking with premium chess gameplay',
      icon: Crown,
      color: 'from-cyan-400 to-blue-500',
      glow: 'rgba(34, 211, 238, 0.4)',
      route: '/dashboard/games/chess',
    },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ParticlesBackground />
      <FloatingShapes />
      <AnimatedGradientOrb
        className="left-10 top-20"
        colors={['rgba(139, 92, 246, 0.3)', 'rgba(167, 139, 250, 0.2)']}
        size="lg"
        delay={0}
      />
      <AnimatedGradientOrb
        className="bottom-20 right-10"
        colors={['rgba(34, 211, 238, 0.3)', 'rgba(56, 189, 248, 0.2)']}
        size="lg"
        delay={1}
      />

      <div className="relative z-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-4 py-2">
            <Brain className="h-5 w-5 text-violet-300" />
            <span className="text-sm font-semibold uppercase tracking-wider text-violet-200">
              Premium Games
            </span>
          </div>
          <h1 className="mb-4 text-5xl font-black text-white sm:text-6xl">
            Game <span className="text-gradient">Arena</span>
          </h1>
          <p className="text-xl text-slate-300">
            Train your brain with premium educational games
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {games.map((game, index) => {
            const Icon = game.icon
            return (
              <motion.div
                key={game.route}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <GlowingCard
                  className="group relative h-full cursor-pointer overflow-hidden p-8 transition-all hover:scale-105"
                  glowColor={game.glow}
                  onClick={() => navigate(game.route)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 transition-opacity duration-500 group-hover:opacity-20`} />

                  <div className="relative z-10">
                    <motion.div
                      className={`mb-6 inline-flex rounded-2xl bg-gradient-to-br ${game.color} p-4`}
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    >
                      <Icon className="h-12 w-12 text-white" />
                    </motion.div>

                    <h3 className="mb-3 text-3xl font-bold text-white">{game.title}</h3>
                    <p className="mb-6 text-slate-300">{game.description}</p>

                    <motion.div
                      className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${game.color} px-6 py-3 font-semibold text-white shadow-lg`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Play Now
                      <Zap className="h-4 w-4" />
                    </motion.div>
                  </div>
                </GlowingCard>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
