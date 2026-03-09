import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Languages, Sparkles, Volume2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useLearningProfile } from '../../contexts/learning-profile-context'
import { getLearningResources, type LearningResource } from '../../lib/api'
import { Badge } from '../ui/badge'
import { Card, CardDescription, CardTitle } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

const resourceCategoryStyles: Record<string, string> = {
  lesson: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-200',
  courseware: 'border-violet-400/20 bg-violet-400/10 text-violet-200',
  textbook: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200',
  reference: 'border-amber-400/20 bg-amber-400/10 text-amber-200',
  web: 'border-sky-400/20 bg-sky-400/10 text-sky-200',
}

export function PersonalizedStudyPanels() {
  const navigate = useNavigate()
  const { profile, dashboard, companionBrief, languagePath } = useLearningProfile()
  const [resources, setResources] = useState<LearningResource[]>([])
  const [resourceQuery, setResourceQuery] = useState('')
  const [resourceStrategy, setResourceStrategy] = useState('curated_open_resources')
  const [generatedNotes, setGeneratedNotes] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let active = true
    const topic =
      dashboard?.focus_tracks?.[0] ??
      profile?.subjects?.[0] ??
      profile?.exam_name ??
      profile?.language ??
      undefined

    const loadResources = async () => {
      if (!topic) {
        setResources([])
        setResourceQuery('')
        setGeneratedNotes(null)
        return
      }

      setIsLoading(true)
      try {
        const response = await getLearningResources(topic)
        if (!active) return
        setResources(response.resources)
        setResourceQuery(response.query)
        setResourceStrategy(response.source_strategy)
        setGeneratedNotes(response.generated_notes ?? null)
      } catch {
        if (!active) return
        setResources([])
        setResourceQuery(topic)
        setResourceStrategy('temporary_fallback')
        setGeneratedNotes('Open educational resources are unavailable right now. Use the AI tutor for a direct explanation while this refreshes.')
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void loadResources()
    return () => {
      active = false
    }
  }, [dashboard?.focus_tracks, profile?.exam_name, profile?.language, profile?.subjects])

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <Card className="glass-panel h-full p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-xl text-white">Personalized Module Stack</CardTitle>
              <CardDescription className="mt-1 text-slate-400">
                These modules now reflect your onboarding goal and learning path.
              </CardDescription>
            </div>
            <Badge className="gap-2 border-white/15 bg-white/10 text-white">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              Dynamic
            </Badge>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {(dashboard?.modules ?? []).map((module, index) => (
              <motion.button
                key={module.id}
                type="button"
                onClick={() => navigate(module.route)}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                whileHover={{ y: -4 }}
                className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5 text-left transition-all duration-300 hover:border-white/20 hover:bg-white/10"
              >
                <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                  {module.category}
                </div>
                <p className="mt-4 text-lg font-semibold text-white">{module.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{module.description}</p>
                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-cyan-200">
                  Open module
                  <ArrowRight className="h-4 w-4" />
                </div>
              </motion.button>
            ))}
          </div>
        </Card>

        <Card className="glass-panel h-full p-6">
          <CardTitle className="text-xl text-white">Open Learning Resources</CardTitle>
          <CardDescription className="mt-1 text-slate-400">
            Auto-fetched from Khan Academy, MIT OpenCourseWare, OpenStax, Wikipedia, and fallback AI notes.
          </CardDescription>
          <div className="mt-5 space-y-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Current query</p>
              <p className="mt-2 text-base font-semibold text-white">{resourceQuery || 'Waiting for a personalized topic'}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                Strategy: {resourceStrategy.replaceAll('_', ' ')}
              </p>
            </div>

            {isLoading ? (
              <Skeleton className="h-48 w-full rounded-[1.6rem] bg-white/5" />
            ) : resources.length > 0 ? (
              resources.slice(0, profile?.goal_type === 'language_learning' ? 6 : 4).map((resource) => (
                <a
                  key={`${resource.source}-${resource.url}`}
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-[1.4rem] border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                        resourceCategoryStyles[resource.category] ?? 'border-white/15 bg-white/10 text-white'
                      }`}
                    >
                      {resource.source}
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-white">{resource.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{resource.description}</p>
                </a>
              ))
            ) : generatedNotes ? (
              <div className="rounded-[1.6rem] border border-violet-400/20 bg-violet-500/10 p-5 text-sm leading-7 text-violet-100">
                {generatedNotes}
              </div>
            ) : (
              <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5 text-sm text-slate-400">
                No resource focus has been derived yet.
              </div>
            )}
          </div>
        </Card>
      </div>

      {profile?.goal_type === 'language_learning' && languagePath && (
        <Card className="glass-panel p-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle className="text-xl text-white">Language Learning Path</CardTitle>
              <CardDescription className="mt-1 text-slate-400">
                Vocabulary, speaking, grammar, and listening lessons staged from your onboarding profile.
              </CardDescription>
            </div>
            <Badge className="gap-2 border-white/15 bg-white/10 text-white">
              <Languages className="h-3.5 w-3.5 text-cyan-300" />
              {languagePath.language} | {languagePath.skill_level}
            </Badge>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-3 md:grid-cols-2">
              {languagePath.lessons.map((lesson) => (
                <div key={lesson.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{lesson.lesson_type}</p>
                  <p className="mt-3 text-lg font-semibold text-white">{lesson.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{lesson.description}</p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
                    <span>{lesson.duration_minutes} min</span>
                    <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1">{lesson.difficulty}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Voice learning stack</p>
              <div className="mt-4 space-y-3">
                {Object.entries(languagePath.speech_stack).map(([tool, enabled]) => (
                  <div key={tool} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="rounded-xl border border-white/10 bg-white/5 p-2 text-cyan-200">
                        <Volume2 className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">{tool.replaceAll('_', ' ')}</p>
                        <p className="text-xs text-slate-400">{enabled ? 'Configured' : 'Ready for configuration'}</p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                        enabled
                          ? 'border border-emerald-400/20 bg-emerald-400/10 text-emerald-200'
                          : 'border border-amber-300/20 bg-amber-300/10 text-amber-200'
                      }`}
                    >
                      {enabled ? 'On' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {languagePath.survival_pack.length ? (
            <div className="mt-4 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Beginner survival pack</p>
                <div className="mt-4 space-y-2">
                  {languagePath.survival_pack.map((phrase) => (
                    <div key={phrase} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-200">
                      {phrase}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">7-day roadmap</p>
                <div className="mt-4 space-y-3">
                  {languagePath.roadmap.map((step) => (
                    <div key={step.day} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-white">{step.day}</p>
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-cyan-200">
                          {step.title}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{step.objective}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {languagePath.resource_links.length ? (
            <div className="mt-4 rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Beginner resource stack</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {languagePath.resource_links.map((resource) => (
                  <a
                    key={resource.url}
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-[1.3rem] border border-white/10 bg-black/20 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">{resource.source}</p>
                    <p className="mt-3 text-sm font-semibold text-white">{resource.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{resource.description}</p>
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </Card>
      )}

      {companionBrief?.smart_suggestions?.length ? (
        <Card className="glass-panel p-6">
          <CardTitle className="text-xl text-white">Study Companion Recommendations</CardTitle>
          <CardDescription className="mt-1 text-slate-400">
            Suggestions generated from your recent performance, study time, and selected goal.
          </CardDescription>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {companionBrief.smart_suggestions.slice(0, 3).map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  )
}

