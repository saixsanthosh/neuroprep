import { motion } from 'framer-motion'
import {
  ArrowRight,
  Brain,
  ChartSpline,
  CirclePlay,
  Sparkles,
  Target,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { ThemeToggle } from '../components/ui/theme-toggle'

const featureList = [
  {
    title: 'AI Tutor Studio',
    description: 'Concept explanations, step-by-step solutions, follow-up prompts, and exam-specific help in one thread.',
    icon: Brain,
  },
  {
    title: 'Adaptive Study Engine',
    description: 'Weak-topic detection, revision recommendations, and dynamic quiz difficulty that adjusts with performance.',
    icon: Target,
  },
  {
    title: 'Planner + Analytics Grid',
    description: 'Calendar scheduling, productivity telemetry, heatmaps, and streak systems designed like a premium SaaS cockpit.',
    icon: ChartSpline,
  },
]

const examCategories = ['School Exams', 'College Courses', 'JEE', 'NEET', 'UPSC', 'SSC / Banking']

const productShots = [
  {
    label: 'Dashboard shell',
    title: 'A cinematic command center for focus, analytics, and quick actions.',
    stat: '87%',
  },
  {
    label: 'AI workflows',
    title: 'Tutor chat, note generation, and revision support with stronger visual hierarchy.',
    stat: '24/7',
  },
  {
    label: 'Study planning',
    title: 'Timeline-based planning with heatmaps, reminders, and revision windows.',
    stat: '12d',
  },
]

const testimonials = [
  {
    name: 'Aarav Sharma',
    role: 'JEE Aspirant',
    content: 'The UI feels like a serious study product, not a template. I know exactly what to do when I open it.',
  },
  {
    name: 'Maya Nair',
    role: 'NEET Student',
    content: 'The planner, tutor, and streak system work together. It makes revision feel structured instead of chaotic.',
  },
  {
    name: 'Ritvik Das',
    role: 'College Student',
    content: 'The dashboard is dense in a good way. It shows a lot without looking messy or cheap.',
  },
]

const faqs = [
  {
    q: 'Can I log in with email or username?',
    a: 'Yes. The local auth flow supports both email and username-based sign-in, and the dashboard route is protected.',
  },
  {
    q: 'Does NeuroPrep support competitive exams?',
    a: 'Yes. The system is designed for school, college, and competitive exam preparation including JEE, NEET, UPSC, and more.',
  },
  {
    q: 'Is the design responsive?',
    a: 'Yes. The layout is built for mobile, tablet, and desktop with stronger visual density on larger screens.',
  },
  {
    q: 'Will the platform support AI-heavy features later?',
    a: 'Yes. The backend structure already includes AI tutor, notes, quizzes, weakness detection, and analytics endpoints.',
  },
]

const navLinks = [
  { id: 'features', label: 'Features' },
  { id: 'categories', label: 'Exams' },
  { id: 'screens', label: 'Screens' },
  { id: 'testimonials', label: 'Voices' },
  { id: 'faq', label: 'FAQ' },
]

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-hero-gradient">
      <div className="premium-grid absolute inset-0 opacity-20" />
      <motion.div
        className="pointer-events-none absolute -left-12 top-16 h-96 w-96 rounded-full bg-cyan-400/12 blur-3xl"
        animate={{ y: [0, -18, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="pointer-events-none absolute right-0 top-0 h-[32rem] w-[32rem] rounded-full bg-violet-500/12 blur-3xl"
        animate={{ y: [0, 22, 0], x: [0, -18, 0] }}
        transition={{ duration: 9, repeat: Infinity }}
      />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#040915]/70 backdrop-blur-xl">
        <div className="section-wrap flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(56,189,248,0.95),rgba(124,58,237,0.95))] text-xl font-bold text-white">
              N
            </div>
            <div>
              <p className="font-heading text-lg font-semibold text-white">NeuroPrep</p>
              <p className="text-xs text-slate-400">Massive AI study platform</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-sm text-slate-400 transition-colors hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="secondary" size="sm">
                Log in
              </Button>
            </Link>
            <Link to="/register" className="hidden sm:block">
              <Button size="sm">Start free</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="section-wrap relative py-20 sm:py-24 xl:py-28">
          <div className="grid items-center gap-8 xl:grid-cols-[1.08fr_0.92fr]">
            <div className="relative">
              <Badge className="gap-2">
                <Sparkles className="h-3.5 w-3.5" />
                Premium SaaS interface for serious students
              </Badge>
              <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl xl:text-7xl">
                The AI study platform with a <span className="text-gradient">massive visual system</span>.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                NeuroPrep combines AI tutoring, revision engines, planner systems, analytics, timers,
                mock exams, and premium dashboard design into one cohesive workspace.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link to="/register">
                  <Button className="group">
                    Enter the platform
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Button variant="secondary">
                  <CirclePlay className="h-4 w-4" />
                  Watch product story
                </Button>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="premium-panel p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Features</p>
                  <p className="mt-3 text-3xl font-bold text-white">140+</p>
                  <p className="mt-2 text-sm text-slate-400">Across AI, analytics, planning, mocks, and games</p>
                </div>
                <div className="premium-panel p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Design</p>
                  <p className="mt-3 text-3xl font-bold text-white">Premium</p>
                  <p className="mt-2 text-sm text-slate-400">Heavy motion, layered glass, and rich visual depth</p>
                </div>
                <div className="premium-panel p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Flow</p>
                  <p className="mt-3 text-3xl font-bold text-white">All-in-one</p>
                  <p className="mt-2 text-sm text-slate-400">From login to dashboard, everything feels connected</p>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="glass-panel rounded-[2rem] p-5">
                <div className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(160deg,rgba(8,12,28,0.96),rgba(11,20,46,0.84))] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">NeuroPrep cockpit</p>
                      <p className="mt-2 text-xl font-semibold text-white">Performance and focus at a glance</p>
                    </div>
                    <span className="premium-pill">Live analytics</span>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                      <p className="text-xs text-slate-500">Productivity score</p>
                      <p className="mt-3 text-4xl font-black text-white">87%</p>
                    </div>
                    <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                      <p className="text-xs text-slate-500">Study streak</p>
                      <p className="mt-3 text-4xl font-black text-white">12d</p>
                    </div>
                    <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4 sm:col-span-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-500">Weekly focus rail</p>
                        <span className="text-xs text-cyan-300">3h 45m today</span>
                      </div>
                      <div className="mt-4 h-2 rounded-full bg-white/10">
                        <div className="h-full w-[72%] rounded-full bg-[linear-gradient(90deg,rgba(56,189,248,1),rgba(124,58,237,1))]" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_0.9fr]">
                    <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">AI tutor</p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        Explain Maxwell&apos;s equations in exam language and give 3 solved examples.
                      </p>
                    </div>
                    <div className="rounded-[1.4rem] border border-cyan-300/15 bg-cyan-300/10 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">System status</p>
                      <p className="mt-2 text-sm leading-6 text-cyan-50">
                        Planner synced, streak active, dashboard auth ready on localhost.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="section-wrap py-16 sm:py-20">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Platform system</p>
              <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">Built like a premium startup product</h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-400">
              The UI is not a thin wrapper around features. It is designed as a heavy visual system with richer cards,
              stronger dashboards, and layered motion across the product.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {featureList.map(({ title, description, icon: Icon }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.08 }}
              >
                <Card className="interactive-card h-full p-6">
                  <span className="inline-flex rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-3 text-cyan-200">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="categories" className="section-wrap py-16 sm:py-20">
          <div className="glass-panel p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Exam scope</p>
                <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">One platform, multiple exam tracks</h2>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-slate-400">
                School preparation, college coursework, and competitive exams all fit into the same planner,
                tutor, analytics, and revision infrastructure.
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {examCategories.map((category, index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5 text-center text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/20 hover:bg-white/10"
                >
                  {category}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="screens" className="section-wrap py-16 sm:py-20">
          <div className="grid gap-5 xl:grid-cols-3">
            {productShots.map((shot, index) => (
              <motion.div
                key={shot.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Card className="interactive-card flex h-full flex-col justify-between p-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{shot.label}</p>
                    <p className="mt-4 text-xl font-semibold leading-8 text-white">{shot.title}</p>
                  </div>
                  <div className="mt-8 flex items-end justify-between">
                    <span className="text-4xl font-black text-white">{shot.stat}</span>
                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-slate-300">
                      Visual depth
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="testimonials" className="section-wrap py-16 sm:py-20">
          <div className="mb-10">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Student voice</p>
            <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">What the experience should feel like</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {testimonials.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Card className="h-full p-6">
                  <p className="text-sm leading-7 text-slate-300">“{item.content}”</p>
                  <div className="mt-6 border-t border-white/10 pt-4">
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.role}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="faq" className="section-wrap py-16 sm:py-20">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Frequently asked</p>
              <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">Answers before you even ask support</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((item, index) => (
                <motion.div
                  key={item.q}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="glass-panel p-5"
                >
                  <p className="text-base font-semibold text-white">{item.q}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{item.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-wrap pb-20 pt-8 sm:pb-24">
          <div className="glass-panel overflow-hidden p-8 text-center sm:p-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_22%),radial-gradient(circle_at_bottom,rgba(124,58,237,0.16),transparent_24%)]" />
            <div className="relative">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Call to action</p>
              <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
                Launch the massive NeuroPrep experience on localhost.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                Auth pages, protected routing, dashboard shell, premium motion, and richer landing visuals are designed
                to feel production-grade from the first click.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link to="/register">
                  <Button>Start with an account</Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary">Open login</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8">
        <div className="section-wrap flex flex-col items-center justify-between gap-3 text-sm text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} NeuroPrep. Built for high-performance study systems.</p>
          <div className="flex items-center gap-5">
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#faq" className="transition hover:text-white">FAQ</a>
            <Link to="/login" className="transition hover:text-white">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
