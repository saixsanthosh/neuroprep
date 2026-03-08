import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Trophy, Target, AlertCircle, CheckCircle, XCircle, Sparkles, Award, TrendingUp, Zap } from 'lucide-react'
import { useState } from 'react'

import { Button } from '../components/ui/button'
import { CardDescription, CardTitle } from '../components/ui/card'
import { AnimatedGradientOrb } from '../components/ui/animated-gradient-orb'
import { FloatingShapes } from '../components/ui/floating-shapes'
import { GlowingCard } from '../components/ui/glowing-card'
import { GradientText } from '../components/ui/gradient-text'
import { PulseDot } from '../components/ui/pulse-dot'
import { AnimatedCounter } from '../components/ui/animated-counter'

const exams = [
  {
    id: 'jee-full',
    title: 'JEE Full-Length Mock',
    duration: '180 min',
    questions: 90,
    negativeMarking: true,
    difficulty: 'Hard',
    color: 'from-cyan-400 to-blue-500',
  },
  {
    id: 'neet-bio',
    title: 'NEET Biology Intensive',
    duration: '90 min',
    questions: 45,
    negativeMarking: true,
    difficulty: 'Medium',
    color: 'from-violet-400 to-purple-500',
  },
  {
    id: 'upsc-gs',
    title: 'UPSC GS Mini Sim',
    duration: '120 min',
    questions: 60,
    negativeMarking: false,
    difficulty: 'Hard',
    color: 'from-pink-400 to-rose-500',
  },
]

const recentResults = [
  { exam: 'JEE Full-Length', score: 184, total: 300, rank: 321, accuracy: 72, date: '2 days ago' },
  { exam: 'NEET Biology Intensive', score: 521, total: 720, rank: 188, accuracy: 85, date: '5 days ago' },
  { exam: 'College Midterm Sim', score: 78, total: 100, rank: 42, accuracy: 78, date: '1 week ago' },
]

export function MockTestsPage() {
  const [selectedExam, setSelectedExam] = useState<string | null>(null)

  return (
    <div className="relative space-y-6 pb-6">
      <FloatingShapes />
      <AnimatedGradientOrb
        className="-right-20 top-10"
        colors={['rgba(34, 211, 238, 0.15)', 'rgba(56, 189, 248, 0.1)']}
        size="lg"
        delay={0}
      />
      <AnimatedGradientOrb
        className="bottom-20 left-10"
        colors={['rgba(124, 58, 237, 0.15)', 'rgba(167, 139, 250, 0.1)']}
        size="md"
        delay={1}
      />

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_24%),radial-gradient(circle_at_78%_16%,rgba(124,58,237,0.2),transparent_28%),linear-gradient(150deg,rgba(7,11,26,0.95),rgba(11,20,46,0.9))] p-6 shadow-[0_30px_80px_rgba(4,8,24,0.45)] backdrop-blur-2xl sm:p-8"
      >
        <div className="premium-grid absolute inset-0 opacity-20" />
        <div className="pointer-events-none absolute -left-8 top-10 h-40 w-40 rounded-full bg-cyan-400/12 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 rounded-full bg-violet-500/12 blur-3xl" />

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-cyan-200">
              <PulseDot size="sm" color="bg-cyan-400" />
              <Sparkles className="h-3.5 w-3.5" />
              Mock exam engine
            </div>
          </motion.div>
          
          <motion.h1
            className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Exam simulation with <GradientText>real-time scoring</GradientText> and rank prediction.
          </motion.h1>
          
          <motion.p
            className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Full-length timed exams with negative marking, question navigator, performance analysis,
            and AI-powered rank estimation.
          </motion.p>

          <motion.div
            className="mt-6 grid gap-4 sm:grid-cols-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {[
              { label: 'Tests Taken', value: 24, icon: Trophy },
              { label: 'Avg Accuracy', value: '78%', icon: Target },
              { label: 'Best Rank', value: 42, icon: Award },
              { label: 'Study Hours', value: 156, icon: Clock },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
                  <stat.icon className="h-4 w-4 text-cyan-300" />
                </div>
                <p className="mt-3 text-2xl font-bold text-white">
                  {typeof stat.value === 'number' ? <AnimatedCounter value={stat.value} /> : stat.value}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <div className="grid gap-4 lg:grid-cols-3">
        {exams.map((exam, index) => (
          <motion.div
            key={exam.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.08 }}
          >
            <GlowingCard className="h-full p-6" glowColor={`rgba(${exam.color === 'from-cyan-400 to-blue-500' ? '34, 211, 238' : exam.color === 'from-violet-400 to-purple-500' ? '124, 58, 237' : '236, 72, 153'}, 0.3)`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white">{exam.title}</CardTitle>
                  <CardDescription className="mt-2 text-slate-400">
                    {exam.questions} questions • {exam.duration}
                  </CardDescription>
                </div>
                <span className={`rounded-full bg-gradient-to-br ${exam.color} px-3 py-1 text-xs font-medium text-white`}>
                  {exam.difficulty}
                </span>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Clock className="h-4 w-4 text-cyan-300" />
                  <span>Duration: {exam.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Target className="h-4 w-4 text-violet-300" />
                  <span>{exam.questions} Questions</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  {exam.negativeMarking ? (
                    <AlertCircle className="h-4 w-4 text-rose-300" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-emerald-300" />
                  )}
                  <span>Negative marking: {exam.negativeMarking ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  className="mt-6 w-full group" 
                  onClick={() => setSelectedExam(exam.id)}
                >
                  Start Mock Exam
                  <Zap className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </GlowingCard>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GlowingCard className="p-6" glowColor="rgba(124, 58, 237, 0.3)">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Recent Mock Results</CardTitle>
              <CardDescription className="mt-1 text-slate-400">
                Last three test outcomes and analysis snapshots.
              </CardDescription>
            </div>
            <TrendingUp className="h-5 w-5 text-cyan-300" />
          </div>

          <div className="space-y-3">
            {recentResults.map((result, index) => (
              <motion.div
                key={result.exam}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + index * 0.05 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="group flex flex-col gap-3 rounded-[1.5rem] border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-white/20 hover:bg-white/10 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1">
                  <p className="font-semibold text-white">{result.exam}</p>
                  <p className="text-xs text-slate-400">{result.date}</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5">
                    <p className="text-xs text-slate-400">Score</p>
                    <p className="text-sm font-bold text-cyan-200">{result.score}/{result.total}</p>
                  </div>
                  
                  <div className="rounded-xl border border-violet-300/20 bg-violet-300/10 px-3 py-1.5">
                    <p className="text-xs text-slate-400">Rank</p>
                    <p className="text-sm font-bold text-violet-200">#{result.rank}</p>
                  </div>
                  
                  <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5">
                    <p className="text-xs text-slate-400">Accuracy</p>
                    <p className="text-sm font-bold text-emerald-200">{result.accuracy}%</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlowingCard>
      </motion.div>

      <AnimatePresence>
        {selectedExam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedExam(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-[linear-gradient(160deg,rgba(8,12,28,0.98),rgba(11,20,46,0.95))] p-8 shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-white">Ready to Start?</h2>
                  <p className="text-sm text-slate-400 mt-1">
                    {exams.find(e => e.id === selectedExam)?.title}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedExam(null)}
                  className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-4">
                  <p className="text-sm text-cyan-100">
                    This is a full-length timed exam. Make sure you have a quiet environment and stable internet connection.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <Clock className="h-5 w-5 text-cyan-300 mb-2" />
                    <p className="text-xs text-slate-400">Duration</p>
                    <p className="text-lg font-bold text-white">{exams.find(e => e.id === selectedExam)?.duration}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <Target className="h-5 w-5 text-violet-300 mb-2" />
                    <p className="text-xs text-slate-400">Questions</p>
                    <p className="text-lg font-bold text-white">{exams.find(e => e.id === selectedExam)?.questions}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setSelectedExam(null)}>
                  Cancel
                </Button>
                <Button className="flex-1">
                  Begin Exam
                  <Zap className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
