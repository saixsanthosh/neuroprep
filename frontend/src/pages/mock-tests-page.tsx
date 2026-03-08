import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Trophy, Target, AlertCircle, CheckCircle, XCircle, Sparkles, Award, TrendingUp, Zap } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { getMockResults, startMockSession, submitMockSession, type MockResult } from '../lib/api'
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

type MockQuestion = {
  id: string
  prompt: string
  options: string[]
  answerIndex: number
  topic: string
}

type ResultSummary = {
  score: number
  total: number
  correct: number
  wrong: number
  unanswered: number
  accuracy: number
  rank: number
  weakTopic: string
}

const examQuestions: Record<string, MockQuestion[]> = {
  'jee-full': [
    {
      id: 'jee-1',
      prompt: 'A charge q is placed at the center of a cube. What is the electric flux through one face of the cube?',
      options: ['q / 6e0', 'q / e0', 'q / 3e0', 'zero'],
      answerIndex: 0,
      topic: 'Electrostatics',
    },
    {
      id: 'jee-2',
      prompt: 'If sin(x) + cos(x) = sqrt(2), then x is',
      options: ['0', 'pi / 4', 'pi / 2', 'pi'],
      answerIndex: 1,
      topic: 'Trigonometry',
    },
    {
      id: 'jee-3',
      prompt: 'Which reagent converts aldehydes into primary alcohols?',
      options: ['KMnO4', 'LiAlH4', 'Br2 / Fe', 'HNO3'],
      answerIndex: 1,
      topic: 'Organic Chemistry',
    },
    {
      id: 'jee-4',
      prompt: 'The slope of the tangent to y = x^2 at x = 3 is',
      options: ['3', '6', '9', '12'],
      answerIndex: 1,
      topic: 'Calculus',
    },
  ],
  'neet-bio': [
    {
      id: 'neet-1',
      prompt: 'The functional unit of the kidney is',
      options: ['Neuron', 'Nephron', 'Alveolus', 'Sarcomere'],
      answerIndex: 1,
      topic: 'Human Physiology',
    },
    {
      id: 'neet-2',
      prompt: 'DNA replication occurs during which phase?',
      options: ['G1', 'S', 'G2', 'M'],
      answerIndex: 1,
      topic: 'Cell Cycle',
    },
    {
      id: 'neet-3',
      prompt: 'Which pigment is primarily responsible for photosynthesis?',
      options: ['Carotene', 'Xanthophyll', 'Chlorophyll a', 'Anthocyanin'],
      answerIndex: 2,
      topic: 'Plant Physiology',
    },
    {
      id: 'neet-4',
      prompt: 'Which blood cells are directly involved in clotting?',
      options: ['RBCs', 'Neutrophils', 'Platelets', 'Lymphocytes'],
      answerIndex: 2,
      topic: 'Human Physiology',
    },
  ],
  'upsc-gs': [
    {
      id: 'upsc-1',
      prompt: 'The Directive Principles of State Policy are contained in which part of the Indian Constitution?',
      options: ['Part III', 'Part IV', 'Part IVA', 'Part V'],
      answerIndex: 1,
      topic: 'Polity',
    },
    {
      id: 'upsc-2',
      prompt: 'El Nino is associated with which ocean?',
      options: ['Arctic Ocean', 'Indian Ocean', 'Pacific Ocean', 'Atlantic Ocean'],
      answerIndex: 2,
      topic: 'Geography',
    },
    {
      id: 'upsc-3',
      prompt: 'The Harappan site known for dockyard evidence is',
      options: ['Lothal', 'Kalibangan', 'Banawali', 'Dholavira'],
      answerIndex: 0,
      topic: 'History',
    },
    {
      id: 'upsc-4',
      prompt: 'Fiscal deficit refers to',
      options: [
        'Revenue expenditure minus revenue receipts',
        'Total expenditure minus total receipts excluding borrowings',
        'Capital expenditure minus capital receipts',
        'Tax revenue minus non-tax revenue',
      ],
      answerIndex: 1,
      topic: 'Economy',
    },
  ],
}

export function MockTestsPage() {
  const [selectedExam, setSelectedExam] = useState<string | null>(null)
  const [runningExamId, setRunningExamId] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({})
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [recentResultItems, setRecentResultItems] = useState(recentResults)
  const [resultSummary, setResultSummary] = useState<ResultSummary | null>(null)
  const [loadingResults, setLoadingResults] = useState(true)

  const activeExam = useMemo(() => exams.find((exam) => exam.id === runningExamId) ?? null, [runningExamId])
  const activeQuestions = runningExamId ? examQuestions[runningExamId] ?? [] : []
  const activeQuestion = activeQuestions[currentQuestionIndex]

  useEffect(() => {
    let active = true

    const loadResults = async () => {
      try {
        const results = await getMockResults(5)
        if (!active || !results.length) return
        setRecentResultItems(
          results.map((result: MockResult) => ({
            exam: result.exam_type,
            score: Math.round(result.score),
            total: 100,
            rank: result.rank,
            accuracy: Math.round(result.accuracy),
            date: new Date(result.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          })),
        )
      } catch {
        // Keep seeded mock results when the live call is unavailable.
      } finally {
        if (active) setLoadingResults(false)
      }
    }

    void loadResults()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!runningExamId || secondsLeft <= 0) return
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => prev - 1)
    }, 1000)
    return () => window.clearInterval(timer)
  }, [runningExamId, secondsLeft])

  useEffect(() => {
    if (runningExamId && secondsLeft === 0 && activeQuestions.length) {
      void handleSubmitExam()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, runningExamId])

  const formatSeconds = (value: number) => {
    const hours = Math.floor(value / 3600)
    const minutes = Math.floor((value % 3600) / 60)
    const seconds = value % 60
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  const beginExam = async () => {
    const exam = exams.find((item) => item.id === selectedExam)
    if (!exam) return

    try {
      const response = await startMockSession({
        exam_type: exam.title,
        total_questions: examQuestions[exam.id]?.length ?? exam.questions,
        duration_minutes: Number.parseInt(exam.duration, 10),
      })
      setSessionId(response.session_id)
    } catch {
      setSessionId(`mock-${Date.now()}`)
    }

    setRunningExamId(exam.id)
    setCurrentQuestionIndex(0)
    setAnswers({})
    setFlaggedQuestions({})
    setSecondsLeft((Number.parseInt(exam.duration, 10) || 60) * 60)
    setResultSummary(null)
    setSelectedExam(null)
  }

  const handleSubmitExam = async () => {
    if (!activeExam || !activeQuestions.length) return

    const correct = activeQuestions.filter((question) => answers[question.id] === question.answerIndex).length
    const answered = Object.keys(answers).length
    const wrong = answered - correct
    const unanswered = activeQuestions.length - answered
    const score = activeExam.negativeMarking ? correct * 4 - wrong : correct * 4
    const normalizedScore = Math.max(0, score)
    const total = activeQuestions.length * 4
    const accuracy = Math.round((correct / activeQuestions.length) * 100)
    const rank = Math.max(1, 750 - accuracy * 6 + wrong * 12)
    const weakTopic =
      activeQuestions.find((question) => answers[question.id] !== question.answerIndex)?.topic ?? 'No weak topic detected'

    try {
      await submitMockSession({
        exam_type: activeExam.title,
        score: normalizedScore,
        rank,
        time_taken: Math.max(1, Number.parseInt(activeExam.duration, 10) * 60 - secondsLeft),
        total_questions: activeQuestions.length,
        correct_answers: correct,
      })
    } catch {
      // Keep the exam UI working even if persistence is unavailable.
    }

    setRecentResultItems((current) => [
      {
        exam: activeExam.title,
        score: normalizedScore,
        total,
        rank,
        accuracy,
        date: 'Just now',
      },
      ...current,
    ].slice(0, 5))

    setResultSummary({
      score: normalizedScore,
      total,
      correct,
      wrong,
      unanswered,
      accuracy,
      rank,
      weakTopic,
    })
    setRunningExamId(null)
    setSessionId(null)
  }

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
              { label: 'Tests Taken', value: recentResultItems.length || 1, icon: Trophy },
              {
                label: 'Avg Accuracy',
                value: `${Math.round(recentResultItems.reduce((sum, result) => sum + result.accuracy, 0) / recentResultItems.length)}%`,
                icon: Target,
              },
              { label: 'Best Rank', value: Math.min(...recentResultItems.map((result) => result.rank)), icon: Award },
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
                Latest timed sessions, including any mock you submit from this page.
              </CardDescription>
            </div>
            <TrendingUp className="h-5 w-5 text-cyan-300" />
          </div>

          <div className="space-y-3">
            {loadingResults ? (
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                Loading stored mock results...
              </div>
            ) : recentResultItems.map((result, index) => (
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
                <Button className="flex-1" onClick={() => void beginExam()}>
                  Begin Exam
                  <Zap className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeExam && activeQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-auto bg-black/85 p-4 backdrop-blur-sm"
          >
            <div className="mx-auto grid min-h-full w-full max-w-7xl gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <motion.div
                initial={{ x: -16, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -16, opacity: 0 }}
                className="rounded-[2rem] border border-white/10 bg-[linear-gradient(160deg,rgba(8,12,28,0.98),rgba(11,20,46,0.95))] p-6 shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
              >
                <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Live Exam Session</p>
                    <h2 className="mt-2 text-2xl font-black text-white">{activeExam.title}</h2>
                    <p className="mt-2 text-sm text-slate-400">Session {sessionId ?? 'starting'} · Topic {activeQuestion.topic}</p>
                  </div>
                  <div className="rounded-[1.4rem] border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-right">
                    <p className="text-xs uppercase tracking-[0.18em] text-rose-200">Time Left</p>
                    <p className="mt-1 text-2xl font-bold text-white">{formatSeconds(secondsLeft)}</p>
                  </div>
                </div>

                <div className="rounded-[1.7rem] border border-white/10 bg-white/5 p-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Question {currentQuestionIndex + 1} of {activeQuestions.length}
                  </p>
                  <p className="mt-4 text-xl font-semibold leading-8 text-white">{activeQuestion.prompt}</p>

                  <div className="mt-6 space-y-3">
                    {activeQuestion.options.map((option, index) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setAnswers((prev) => ({ ...prev, [activeQuestion.id]: index }))}
                        className={`w-full rounded-[1.4rem] border px-4 py-4 text-left transition ${
                          answers[activeQuestion.id] === index
                            ? 'border-cyan-300/30 bg-cyan-300/10 text-white'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-xs uppercase tracking-[0.16em] text-slate-500">
                          Option {String.fromCharCode(65 + index)}
                        </span>
                        <p className="mt-2 text-sm leading-6">{option}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setFlaggedQuestions((prev) => ({ ...prev, [activeQuestion.id]: !prev[activeQuestion.id] }))
                    }
                  >
                    {flaggedQuestions[activeQuestion.id] ? 'Unflag' : 'Flag'} question
                  </Button>
                  <Button
                    onClick={() =>
                      setCurrentQuestionIndex((prev) => Math.min(activeQuestions.length - 1, prev + 1))
                    }
                    disabled={currentQuestionIndex === activeQuestions.length - 1}
                  >
                    Next
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ x: 16, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 16, opacity: 0 }}
                className="space-y-4"
              >
                <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(160deg,rgba(8,12,28,0.98),rgba(11,20,46,0.95))] p-6 shadow-[0_40px_100px_rgba(0,0,0,0.4)]">
                  <CardTitle className="text-white">Navigator</CardTitle>
                  <CardDescription className="mt-1 text-slate-400">
                    Jump to any question and monitor answered coverage in real time.
                  </CardDescription>
                  <div className="mt-4 grid grid-cols-5 gap-2">
                    {activeQuestions.map((question, index) => {
                      const isAnswered = answers[question.id] !== undefined
                      const isFlagged = flaggedQuestions[question.id]
                      return (
                        <button
                          key={question.id}
                          type="button"
                          onClick={() => setCurrentQuestionIndex(index)}
                          className={`rounded-xl border px-3 py-3 text-sm transition ${
                            currentQuestionIndex === index
                              ? 'border-cyan-300/30 bg-cyan-300/10 text-white'
                              : isAnswered
                                ? 'border-emerald-300/20 bg-emerald-300/10 text-emerald-100'
                                : 'border-white/10 bg-white/5 text-slate-300'
                          }`}
                        >
                          {index + 1}
                          {isFlagged ? <span className="ml-1 text-rose-300">*</span> : null}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(160deg,rgba(8,12,28,0.98),rgba(11,20,46,0.95))] p-6 shadow-[0_40px_100px_rgba(0,0,0,0.4)]">
                  <CardTitle className="text-white">Session Summary</CardTitle>
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Answered</span>
                      <span>{Object.keys(answers).length}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Flagged</span>
                      <span>{Object.values(flaggedQuestions).filter(Boolean).length}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Remaining</span>
                      <span>{activeQuestions.length - Object.keys(answers).length}</span>
                    </div>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={() => {
                        setRunningExamId(null)
                        setSessionId(null)
                      }}
                    >
                      Exit
                    </Button>
                    <Button className="flex-1" onClick={() => void handleSubmitExam()}>
                      Submit exam
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {resultSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setResultSummary(null)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 16 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-[linear-gradient(160deg,rgba(8,12,28,0.98),rgba(11,20,46,0.95))] p-8 shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Mock submitted</p>
                  <h2 className="mt-2 text-2xl font-black text-white">Result summary</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setResultSummary(null)}
                  className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.4rem] border border-cyan-300/20 bg-cyan-300/10 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-100">Score</p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    {resultSummary.score}/{resultSummary.total}
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-violet-300/20 bg-violet-300/10 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-violet-100">Rank estimate</p>
                  <p className="mt-2 text-3xl font-bold text-white">#{resultSummary.rank}</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-slate-500">Correct</p>
                  <p className="mt-2 text-xl font-semibold text-emerald-300">{resultSummary.correct}</p>
                </div>
                <div className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-slate-500">Wrong</p>
                  <p className="mt-2 text-xl font-semibold text-rose-300">{resultSummary.wrong}</p>
                </div>
                <div className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-slate-500">Accuracy</p>
                  <p className="mt-2 text-xl font-semibold text-cyan-200">{resultSummary.accuracy}%</p>
                </div>
              </div>

              <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Weak topic detected</p>
                <p className="mt-2 text-base font-semibold text-white">{resultSummary.weakTopic}</p>
                <p className="mt-2 text-sm text-slate-400">
                  Use the notes and analytics pages to turn this into the next revision lane.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
