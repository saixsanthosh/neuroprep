import { motion } from 'framer-motion'
import { ArrowRight, Play, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { ThemeToggle } from '../components/ui/theme-toggle'

const featureList = [
  {
    title: 'AI Tutor Conversations',
    description: 'Ask concepts, solve problems step-by-step, and get exam-focused explanations instantly.',
  },
  {
    title: 'Adaptive Practice Engine',
    description: 'Auto-adjusted quiz difficulty based on your weak topics, speed, and accuracy trends.',
  },
  {
    title: 'Study Planner + Timer',
    description: 'Build practical schedules and track focused sessions with Pomodoro-ready flow.',
  },
]

const examCategories = ['School Exams', 'College Courses', 'JEE', 'NEET', 'UPSC', 'SSC/Banking']

const productShots = [
  'Unified student dashboard with performance trends and goals.',
  'Interactive AI tutor with instant explanations and streaming responses.',
  'Calendar planner with daily task priorities and revision reminders.',
]

const testimonials = [
  {
    name: 'Aarav Sharma',
    role: 'JEE Aspirant',
    content: 'The weakness detection flow told me exactly what to revise. My mock accuracy jumped in 3 weeks.',
  },
  {
    name: 'Maya Nair',
    role: 'Medical Entrance Student',
    content: 'Pomodoro + AI notes made my routine predictable. I can revise faster before weekly tests.',
  },
  {
    name: 'Ritvik Das',
    role: 'College Student',
    content: 'Feels like having a personal mentor dashboard. I track classes, tasks, and quizzes in one place.',
  },
]

const navLinks = [
  { id: 'features', label: 'Features' },
  { id: 'categories', label: 'Exams' },
  { id: 'screenshots', label: 'Product' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'cta', label: 'Get Started' },
]

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-hero-gradient">
      <motion.div
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary-500/30 blur-3xl"
        animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-16 right-4 h-40 w-40 rounded-full bg-accent-cyan/20 blur-3xl md:right-20 md:h-64 md:w-64"
        animate={{ y: [0, -16, 0], x: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#060b1bcc] backdrop-blur-xl">
        <div className="section-wrap flex h-20 items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-cyan text-xl font-bold text-white">
              N
            </div>
            <div>
              <p className="font-heading text-lg font-semibold">NeuroPrep</p>
              <p className="text-xs text-muted">AI Study Companion</p>
            </div>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-sm text-muted transition-colors hover:text-[var(--text-main)]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/dashboard">
              <Button size="sm">Open App</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="section-wrap relative py-24 sm:py-28 lg:py-32">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <Badge className="mb-5 gap-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  Startup-grade AI study platform
                </Badge>
                <h1 className="max-w-xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                  Study smarter with <span className="bg-gradient-to-r from-primary-400 to-accent-cyan bg-clip-text text-transparent">AI-powered</span> momentum.
                </h1>
                <p className="mt-6 max-w-2xl text-base text-muted sm:text-lg">
                  From daily planning and focus sessions to adaptive quizzes and weak-topic detection, NeuroPrep gives
                  students a complete exam prep operating system.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mt-8 flex flex-wrap items-center gap-4"
              >
                <Link to="/dashboard">
                  <Button className="group">
                    Launch Dashboard
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Button variant="secondary">
                  <Play className="h-4 w-4" />
                  Watch demo
                </Button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.12 }}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                className="glass relative rounded-[2rem] p-6"
              >
                <div className="rounded-3xl bg-animated p-6">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[88, 43, 7, 92].map((score, i) => (
                      <div key={score} className="rounded-2xl bg-black/25 p-4">
                        <p className="text-xs text-slate-300">Metric {i + 1}</p>
                        <p className="mt-1 text-2xl font-semibold text-white">{score}%</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-2xl border border-white/20 bg-black/25 p-4">
                    <p className="text-sm text-slate-300">Today&apos;s Focus</p>
                    <p className="mt-2 text-2xl font-bold text-white">3h 45m</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="section-wrap py-16 sm:py-20">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Built for modern exam workflows</h2>
            <p className="mt-3 text-muted">Everything you need from planning to performance analysis.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featureList.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="interactive-card h-full">
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-3 text-sm text-muted">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="categories" className="section-wrap py-16 sm:py-20">
          <div className="glass rounded-3xl p-8">
            <h2 className="text-3xl font-bold sm:text-4xl">Exam preparation categories</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {examCategories.map((category, index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-2xl border border-white/15 bg-white/5 p-4 text-center font-medium transition hover:-translate-y-1 hover:border-accent-cyan/60"
                >
                  {category}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="screenshots" className="section-wrap py-16 sm:py-20">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">Product snapshots</h2>
              <p className="mt-3 text-muted">Polished dashboard experience across devices.</p>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {productShots.map((shot, index) => (
              <motion.div
                key={shot}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="glass interactive-card flex h-64 flex-col justify-between rounded-3xl bg-gradient-to-br from-primary-500/20 to-accent-cyan/10 p-6">
                  <p className="text-sm text-muted">Screenshot {index + 1}</p>
                  <p className="font-heading text-xl font-semibold">{shot}</p>
                  <div className="h-2 rounded-full bg-white/15">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-cyan" style={{ width: `${75 - index * 10}%` }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="testimonials" className="section-wrap py-16 sm:py-20">
          <div className="grid gap-5 lg:grid-cols-3">
            {testimonials.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <p className="text-sm leading-relaxed text-muted">&ldquo;{item.content}&rdquo;</p>
                  <div className="mt-5 border-t border-white/10 pt-4">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-muted">{item.role}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="cta" className="section-wrap pb-20 pt-8 sm:pb-24">
          <div className="glass rounded-[2rem] bg-gradient-to-r from-primary-500/20 via-primary-600/10 to-accent-cyan/20 p-10 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Ready to upgrade your prep stack?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted">
              Start with the dashboard, track every session, and let AI handle personalized guidance.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
              <Link to="/dashboard">
                <Button>Start Free</Button>
              </Link>
              <Button variant="secondary">Schedule a Demo</Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8">
        <div className="section-wrap flex flex-col items-center justify-between gap-3 text-sm text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} NeuroPrep. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
