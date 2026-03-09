import { useState } from 'react'
import { AudioLines, BookMarked, Languages, Mic2, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { ModulePageShell } from '../components/dashboard/module-page-shell'
import { Button } from '../components/ui/button'
import { CardDescription, CardTitle } from '../components/ui/card'
import { GlowingCard } from '../components/ui/glowing-card'
import { useLearningProfile } from '../contexts/learning-profile-context'
import { createFlashcards, recordGamificationEvent } from '../lib/api'

export function LanguageLabPage() {
  const navigate = useNavigate()
  const { profile, languagePath } = useLearningProfile()
  const [statusMessage, setStatusMessage] = useState('')
  const isLanguageMode = profile?.goal_type === 'language_learning' && languagePath

  const handleSaveStarterDeck = async () => {
    if (!languagePath?.survival_pack.length) return
    try {
      await createFlashcards({
        cards: languagePath.survival_pack.map((phrase) => {
          const [question, answer] = phrase.split(' - ')
          return {
            question: question || phrase,
            answer: answer || phrase,
            subject: languagePath.language,
            difficulty: 'easy' as const,
          }
        }),
      })
      setStatusMessage('Starter survival-pack flashcards saved to your flashcard deck.')
    } catch {
      setStatusMessage('Saving the starter flashcards failed.')
    }
  }

  const handleLessonComplete = async () => {
    try {
      await recordGamificationEvent({
        event_type: 'lesson_completed',
        count: 1,
        subject: languagePath?.language,
        metadata: { lesson_type: languagePath?.lessons[0]?.lesson_type ?? 'language' },
      })
      setStatusMessage('Lesson completion recorded in the habit loop.')
    } catch {
      setStatusMessage('Lesson completion could not be recorded right now.')
    }
  }

  return (
    <ModulePageShell
      badge="Language lab"
      title="Practice vocabulary, listening, and"
      highlight="speaking in one lane"
      description="This is the dedicated language-learning workspace for lessons, pronunciation drills, resources, and spaced starter decks."
      actions={
        isLanguageMode ? (
          <>
            <Button onClick={handleSaveStarterDeck}>
              <BookMarked className="h-4 w-4" />
              Save starter deck
            </Button>
            <Button variant="secondary" onClick={handleLessonComplete}>
              <Sparkles className="h-4 w-4" />
              Mark lesson complete
            </Button>
          </>
        ) : (
          <Button onClick={() => navigate('/onboarding')}>
            <Languages className="h-4 w-4" />
            Switch to language mode
          </Button>
        )
      }
    >
      {statusMessage ? (
        <div className="rounded-[1.4rem] border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
          {statusMessage}
        </div>
      ) : null}

      {isLanguageMode ? (
        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-6">
            <GlowingCard className="p-0" glowColor="rgba(236, 72, 153, 0.28)">
              <div className="space-y-5 p-6">
                <CardTitle className="text-white">Lesson runway</CardTitle>
                <CardDescription className="mt-1 text-slate-400">
                  {languagePath.language} | {languagePath.skill_level}
                </CardDescription>
                <div className="space-y-3">
                  {languagePath.lessons.map((lesson) => (
                    <div key={lesson.id} className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-pink-300">{lesson.lesson_type}</p>
                      <p className="mt-2 text-base font-semibold text-white">{lesson.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{lesson.description}</p>
                      <p className="mt-2 text-xs text-slate-500">{lesson.duration_minutes} min | {lesson.difficulty}</p>
                    </div>
                  ))}
                </div>
              </div>
            </GlowingCard>

            <GlowingCard className="p-0" glowColor="rgba(34, 211, 238, 0.28)">
              <div className="space-y-5 p-6">
                <CardTitle className="text-white">Seven-day roadmap</CardTitle>
                <CardDescription className="mt-1 text-slate-400">A staged path built from the onboarding profile.</CardDescription>
                <div className="space-y-3">
                  {languagePath.roadmap.map((step) => (
                    <div key={step.day} className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">{step.day}</p>
                      <p className="mt-2 text-base font-semibold text-white">{step.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{step.objective}</p>
                    </div>
                  ))}
                </div>
              </div>
            </GlowingCard>
          </div>

          <div className="space-y-6">
            <GlowingCard className="p-0" glowColor="rgba(16, 185, 129, 0.28)">
              <div className="space-y-5 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-white">Voice stack</CardTitle>
                    <CardDescription className="mt-1 text-slate-400">Current readiness for speaking, listening, and translation flows.</CardDescription>
                  </div>
                  <Mic2 className="h-5 w-5 text-emerald-300" />
                </div>
                <div className="grid gap-3">
                  {Object.entries(languagePath.speech_stack).map(([tool, enabled]) => (
                    <div key={tool} className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                      <p className="text-sm font-semibold capitalize text-white">{tool.replace('_', ' ')}</p>
                      <p className="mt-2 text-sm text-slate-400">{enabled ? 'Configured and ready for voice workflows.' : 'Not configured yet in the current deployment.'}</p>
                    </div>
                  ))}
                </div>
              </div>
            </GlowingCard>

            <GlowingCard className="p-0" glowColor="rgba(124, 58, 237, 0.28)">
              <div className="space-y-5 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-white">Survival pack</CardTitle>
                    <CardDescription className="mt-1 text-slate-400">High-frequency phrases to move into memory quickly.</CardDescription>
                  </div>
                  <AudioLines className="h-5 w-5 text-violet-300" />
                </div>
                <div className="space-y-3">
                  {languagePath.survival_pack.map((phrase) => (
                    <div key={phrase} className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                      {phrase}
                    </div>
                  ))}
                </div>
              </div>
            </GlowingCard>

            <GlowingCard className="p-0" glowColor="rgba(245, 158, 11, 0.28)">
              <div className="space-y-5 p-6">
                <CardTitle className="text-white">Open resources</CardTitle>
                <CardDescription className="mt-1 text-slate-400">Curated external references for guided self-study.</CardDescription>
                <div className="space-y-3">
                  {languagePath.resource_links.map((resource) => (
                    <a
                      key={resource.url}
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-[1.3rem] border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10"
                    >
                      <p className="text-sm font-semibold text-white">{resource.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{resource.description}</p>
                    </a>
                  ))}
                </div>
              </div>
            </GlowingCard>
          </div>
        </div>
      ) : (
        <GlowingCard className="p-0" glowColor="rgba(34, 211, 238, 0.28)">
          <div className="space-y-5 p-6">
            <CardTitle className="text-white">Language mode is not active</CardTitle>
            <CardDescription className="mt-1 text-slate-400">
              Switch your onboarding goal to language learning to unlock the dedicated fluency workspace, lesson path, and voice-stack panels.
            </CardDescription>
            <Button onClick={() => navigate('/onboarding')}>
              <Languages className="h-4 w-4" />
              Update onboarding
            </Button>
          </div>
        </GlowingCard>
      )}
    </ModulePageShell>
  )
}
