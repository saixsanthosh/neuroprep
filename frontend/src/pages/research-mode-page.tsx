import { useMemo, useState } from 'react'
import { ExternalLink, Globe2, LibraryBig, Search, Sparkles } from 'lucide-react'

import { ModulePageShell } from '../components/dashboard/module-page-shell'
import { Button } from '../components/ui/button'
import { CardDescription, CardTitle } from '../components/ui/card'
import { GlowingCard } from '../components/ui/glowing-card'
import { Input } from '../components/ui/input'
import { api, getLearningResources, type LearningResourcesResult } from '../lib/api'

export function ResearchModePage() {
  const [query, setQuery] = useState('Japanese beginner grammar')
  const [result, setResult] = useState<LearningResourcesResult | null>(null)
  const [generatedNotes, setGeneratedNotes] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const topSources = useMemo(() => result?.resources ?? [], [result])

  const handleSearch = async () => {
    const cleaned = query.trim()
    if (!cleaned || isLoading) return
    setIsLoading(true)
    try {
      const resources = await getLearningResources(cleaned)
      setResult(resources)
      setGeneratedNotes(resources.generated_notes ?? '')
      setStatusMessage(`Fetched ${resources.resources.length} open-resource results using ${resources.source_strategy}.`)
    } catch {
      setStatusMessage('Research mode could not load sources right now.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateNotes = async () => {
    const cleaned = query.trim()
    if (!cleaned || isGenerating) return
    setIsGenerating(true)
    try {
      const { data } = await api.post<{ content: string }>('/ai/generate-notes', {
        topic: cleaned,
        level: 'intermediate',
      })
      setGeneratedNotes(data.content)
      setStatusMessage('Structured notes generated for the current research topic.')
    } catch {
      setStatusMessage('AI note generation is unavailable for this topic right now.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <ModulePageShell
      badge="Internet research mode"
      title="Blend open sources with"
      highlight="structured AI notes"
      description="Search across open educational resources, bring the strongest references into one pane, and generate a concise briefing when the source list is not enough."
      actions={
        <>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a topic"
            className="h-12 min-w-[18rem] border-white/10 bg-white/5 text-white placeholder:text-slate-500"
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            <Search className="h-4 w-4" />
            {isLoading ? 'Searching...' : 'Search sources'}
          </Button>
          <Button variant="secondary" onClick={handleGenerateNotes} disabled={isGenerating}>
            <Sparkles className="h-4 w-4" />
            {isGenerating ? 'Generating...' : 'Generate notes'}
          </Button>
        </>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <GlowingCard className="p-0" glowColor="rgba(34, 211, 238, 0.28)">
          <div className="space-y-5 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-white">Source radar</CardTitle>
                <CardDescription className="mt-1 text-slate-400">
                  Khan Academy, MIT OCW, OpenStax, Wikipedia, and Tavily-backed web results when available.
                </CardDescription>
              </div>
              <Globe2 className="h-5 w-5 text-cyan-300" />
            </div>

            {statusMessage ? (
              <div className="rounded-[1.25rem] border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
                {statusMessage}
              </div>
            ) : null}

            <div className="space-y-3">
              {topSources.length ? (
                topSources.map((resource) => (
                  <div key={`${resource.source}-${resource.url}`} className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">{resource.source}</p>
                        <p className="mt-2 text-base font-semibold text-white">{resource.title}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-400">{resource.description}</p>
                      </div>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-2xl border border-white/10 bg-black/20 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.35rem] border border-dashed border-white/10 bg-white/5 px-4 py-12 text-center text-sm text-slate-400">
                  Search a topic to load the research stack.
                </div>
              )}
            </div>
          </div>
        </GlowingCard>

        <div className="space-y-6">
          <GlowingCard className="p-0" glowColor="rgba(124, 58, 237, 0.28)">
            <div className="space-y-5 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-white">AI synthesis</CardTitle>
                  <CardDescription className="mt-1 text-slate-400">
                    Structured notes generated from the current source set or directly from Gemini.
                  </CardDescription>
                </div>
                <Sparkles className="h-5 w-5 text-violet-300" />
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-300">
                {generatedNotes || 'No generated notes yet. Search a topic or trigger AI synthesis to build the brief.'}
              </div>
            </div>
          </GlowingCard>

          <GlowingCard className="p-0" glowColor="rgba(16, 185, 129, 0.28)">
            <div className="space-y-5 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-white">Research workflow</CardTitle>
                  <CardDescription className="mt-1 text-slate-400">
                    The fastest way to turn internet search into actual study output.
                  </CardDescription>
                </div>
                <LibraryBig className="h-5 w-5 text-emerald-300" />
              </div>

              <div className="space-y-3 text-sm text-slate-300">
                <div className="rounded-[1.25rem] border border-white/10 bg-black/20 px-4 py-3">1. Search the topic and open the strongest references first.</div>
                <div className="rounded-[1.25rem] border border-white/10 bg-black/20 px-4 py-3">2. Use the AI synthesis panel to compress the source set into revision notes.</div>
                <div className="rounded-[1.25rem] border border-white/10 bg-black/20 px-4 py-3">3. Move the resulting concepts into notes, flashcards, or planner tasks.</div>
              </div>
            </div>
          </GlowingCard>
        </div>
      </div>
    </ModulePageShell>
  )
}
