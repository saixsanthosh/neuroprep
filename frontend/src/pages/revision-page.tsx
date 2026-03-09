import { useEffect, useState } from 'react'
import { BrainCircuit, ChevronRight, RotateCcw, ShieldAlert } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { ModulePageShell } from '../components/dashboard/module-page-shell'
import { Button } from '../components/ui/button'
import { CardDescription, CardTitle } from '../components/ui/card'
import { GlowingCard } from '../components/ui/glowing-card'
import { getRevisionDigest, startQuiz, type QuizSessionStart, type RevisionDigest } from '../lib/api'

export function RevisionPage() {
  const navigate = useNavigate()
  const [digest, setDigest] = useState<RevisionDigest | null>(null)
  const [quickQuiz, setQuickQuiz] = useState<QuizSessionStart | null>(null)
  const [statusMessage, setStatusMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false)

  const loadDigest = async () => {
    setIsLoading(true)
    try {
      const data = await getRevisionDigest()
      setDigest(data)
      setStatusMessage('Revision digest refreshed from weak topics, flashcards, and recent notes.')
    } catch {
      setDigest(null)
      setStatusMessage('Revision digest is not available yet.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadDigest()
  }, [])

  const handleQuickQuiz = async () => {
    const weakest = digest?.weak_topics?.[0]
    if (!weakest || isGeneratingQuiz) return
    setIsGeneratingQuiz(true)
    try {
      const quiz = await startQuiz({
        subject: weakest.subject,
        topic: weakest.topic,
        difficulty: 'medium',
        question_count: 5,
      })
      setQuickQuiz(quiz)
      setStatusMessage(`Generated a short ${weakest.subject} quiz on ${weakest.topic}.`)
    } catch {
      setStatusMessage('Quick quiz generation failed.')
    } finally {
      setIsGeneratingQuiz(false)
    }
  }

  return (
    <ModulePageShell
      badge="Revision engine"
      title="Convert weak spots into"
      highlight="next actions"
      description="This page consolidates your weakest topics, saved flashcards, and recent notes into a single recovery lane so you know exactly what to revise next."
      actions={
        <>
          <Button variant="secondary" onClick={() => void loadDigest()} disabled={isLoading}>
            <RotateCcw className="h-4 w-4" />
            {isLoading ? 'Refreshing...' : 'Refresh digest'}
          </Button>
          <Button onClick={handleQuickQuiz} disabled={!digest?.weak_topics.length || isGeneratingQuiz}>
            <BrainCircuit className="h-4 w-4" />
            {isGeneratingQuiz ? 'Building quiz...' : 'Generate quick quiz'}
          </Button>
        </>
      }
    >
      {statusMessage ? (
        <div className="rounded-[1.4rem] border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
          {statusMessage}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <GlowingCard className="p-0" glowColor="rgba(236, 72, 153, 0.28)">
            <div className="space-y-5 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-white">Weakness queue</CardTitle>
                  <CardDescription className="mt-1 text-slate-400">
                    Highest-impact repair topics ranked by current weakness score.
                  </CardDescription>
                </div>
                <ShieldAlert className="h-5 w-5 text-pink-300" />
              </div>

              <div className="space-y-3">
                {digest?.weak_topics.length ? (
                  digest.weak_topics.map((topic) => (
                    <div key={`${topic.subject}-${topic.topic}`} className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-pink-300">{topic.subject}</p>
                          <p className="mt-2 text-lg font-semibold text-white">{topic.topic}</p>
                          <p className="mt-3 text-sm text-slate-400">Weakness score {Math.round(topic.weakness_score)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate('/dashboard/analytics')}
                          className="rounded-2xl border border-white/10 bg-black/20 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[1.35rem] border border-dashed border-white/10 bg-white/5 px-4 py-10 text-center text-sm text-slate-400">
                    No weak topics recorded yet. Submit quizzes or mock tests to activate the revision queue.
                  </div>
                )}
              </div>
            </div>
          </GlowingCard>

          <GlowingCard className="p-0" glowColor="rgba(34, 211, 238, 0.28)">
            <div className="space-y-5 p-6">
              <CardTitle className="text-white">Action plan</CardTitle>
              <CardDescription className="mt-1 text-slate-400">
                Sequenced next moves across analytics, flashcards, and tutoring.
              </CardDescription>
              <div className="space-y-3">
                {digest?.action_plan.map((action) => (
                  <div key={action.title} className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-semibold text-white">{action.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{action.description}</p>
                    <Button variant="secondary" size="sm" className="mt-4" onClick={() => navigate(action.route)}>
                      Open lane
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </GlowingCard>
        </div>

        <div className="space-y-6">
          <GlowingCard className="p-0" glowColor="rgba(16, 185, 129, 0.28)">
            <div className="space-y-5 p-6">
              <CardTitle className="text-white">Flashcard recall set</CardTitle>
              <CardDescription className="mt-1 text-slate-400">
                Saved cards pulled into the revision lane for immediate active recall.
              </CardDescription>
              <div className="space-y-3">
                {digest?.flashcards.length ? (
                  digest.flashcards.map((card) => (
                    <div key={card.id} className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                      <p className="text-sm font-semibold text-white">{card.question}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{card.answer}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[1.3rem] border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                    No flashcards saved yet. Use the flashcards module to build a recall deck.
                  </div>
                )}
              </div>
            </div>
          </GlowingCard>

          <GlowingCard className="p-0" glowColor="rgba(124, 58, 237, 0.28)">
            <div className="space-y-5 p-6">
              <CardTitle className="text-white">Quick quiz preview</CardTitle>
              <CardDescription className="mt-1 text-slate-400">
                Generate a short verification set from the top weak topic.
              </CardDescription>

              {quickQuiz ? (
                <div className="space-y-3">
                  {quickQuiz.questions.map((question, index) => (
                    <div key={question} className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                      <span className="text-cyan-300">Q{index + 1}.</span> {question}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-[1.3rem] border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                  Generate a quick quiz to validate the current repair plan.
                </div>
              )}
            </div>
          </GlowingCard>
        </div>
      </div>
    </ModulePageShell>
  )
}
