import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpenText, Download, FileText, FolderKanban, Save, Search, Sparkles, Wand2 } from 'lucide-react'

import { api } from '../lib/api'
import { Button } from '../components/ui/button'
import { CardDescription, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { AnimatedGradientOrb } from '../components/ui/animated-gradient-orb'
import { FloatingShapes } from '../components/ui/floating-shapes'
import { GlowingCard } from '../components/ui/glowing-card'
import { GradientText } from '../components/ui/gradient-text'
import { PulseDot } from '../components/ui/pulse-dot'

type NoteRecord = {
  id: string
  title: string
  subject: string
  updatedAt: string
  content: string
}

const starterNotes: NoteRecord[] = [
  {
    id: 'electrostatics-core',
    title: 'Electrostatics Revision Grid',
    subject: 'Physics',
    updatedAt: '10 min ago',
    content:
      'Potential, electric field, Coulomb force, and equipotential surfaces. Focus on sign conventions and quick derivations.',
  },
  {
    id: 'organic-mechanisms',
    title: 'Organic Mechanism Traps',
    subject: 'Chemistry',
    updatedAt: '1 hour ago',
    content:
      'SN1 vs SN2, carbocation stability, directing effects, and common reagent exceptions with fast examples.',
  },
  {
    id: 'probability-fast',
    title: 'Probability Sprint Notes',
    subject: 'Math',
    updatedAt: 'Yesterday',
    content:
      'Conditional probability, Bayes theorem, and permutation edge cases with 6 short worked examples.',
  },
]

export function NotesPage() {
  const [topic, setTopic] = useState('Electrostatics for JEE revision')
  const [search, setSearch] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedNotes, setGeneratedNotes] = useState<string>(starterNotes[0].content)
  const [savedNotes, setSavedNotes] = useState<NoteRecord[]>(starterNotes)
  const [activeNoteId, setActiveNoteId] = useState<string>(starterNotes[0].id)

  const activeNote = savedNotes.find((note) => note.id === activeNoteId) ?? savedNotes[0]

  const visibleNotes = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) {
      return savedNotes
    }

    return savedNotes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.subject.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query),
    )
  }, [savedNotes, search])

  const handleGenerate = async () => {
    const cleanedTopic = topic.trim()
    if (!cleanedTopic || isGenerating) {
      return
    }

    setIsGenerating(true)
    try {
      const { data } = await api.post<{ content: string }>('/ai/generate-notes', {
        topic: cleanedTopic,
        level: 'intermediate',
      })
      setGeneratedNotes(data.content)
    } catch {
      setGeneratedNotes(
        `Structured notes for ${cleanedTopic}\n\n1. Core idea\n2. Key formulas\n3. Common mistakes\n4. Short revision checklist\n5. Practice prompts`,
      )
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = () => {
    const title = topic.trim() || 'Untitled AI Notes'
    const newNote: NoteRecord = {
      id: `${Date.now()}`,
      title,
      subject: title.includes('Physics') ? 'Physics' : title.includes('Chemistry') ? 'Chemistry' : 'General',
      updatedAt: 'Just now',
      content: generatedNotes,
    }

    setSavedNotes((current) => [newNote, ...current])
    setActiveNoteId(newNote.id)
  }

  return (
    <div className="relative space-y-6 pb-6">
      <FloatingShapes />
      <AnimatedGradientOrb
        className="-right-16 top-10"
        colors={['rgba(34, 211, 238, 0.14)', 'rgba(56, 189, 248, 0.1)']}
        size="lg"
        delay={0}
      />
      <AnimatedGradientOrb
        className="bottom-16 left-6"
        colors={['rgba(124, 58, 237, 0.14)', 'rgba(167, 139, 250, 0.1)']}
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
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-cyan-200">
            <PulseDot size="sm" color="bg-cyan-400" />
            <Sparkles className="h-3.5 w-3.5" />
            AI notes workspace
          </div>

          <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            Build revision packs with a <GradientText>real notes workflow</GradientText>.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Generate topic notes, save them into a focused library, search quickly, and keep the
            page usable as a real study workspace instead of a placeholder.
          </p>

          <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
            <Input
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="Enter a topic for AI notes"
              className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-500"
            />
            <Button className="h-12 px-5" onClick={handleGenerate} disabled={isGenerating}>
              <Wand2 className="h-4 w-4" />
              {isGenerating ? 'Generating...' : 'Generate Notes'}
            </Button>
            <Button variant="secondary" className="h-12 px-5" onClick={handleSave}>
              <Save className="h-4 w-4" />
              Save to Library
            </Button>
          </div>
        </div>
      </motion.section>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlowingCard className="p-5" glowColor="rgba(34, 211, 238, 0.25)">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Notes Library</CardTitle>
                <CardDescription className="mt-1 text-slate-400">
                  Search and reopen saved study packs
                </CardDescription>
              </div>
              <FolderKanban className="h-5 w-5 text-cyan-300" />
            </div>

            <div className="mt-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search notes"
                  className="border-white/10 bg-white/5 pl-9 text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {visibleNotes.map((note) => (
                <button
                  key={note.id}
                  type="button"
                  onClick={() => {
                    setActiveNoteId(note.id)
                    setGeneratedNotes(note.content)
                    setTopic(note.title)
                  }}
                  className={`w-full rounded-[1.25rem] border p-4 text-left transition ${
                    activeNoteId === note.id
                      ? 'border-cyan-300/30 bg-cyan-300/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{note.title}</p>
                      <p className="mt-1 text-xs text-slate-400">{note.subject}</p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-300">
                      {note.updatedAt}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </GlowingCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.18 }}
        >
          <GlowingCard className="p-6" glowColor="rgba(124, 58, 237, 0.3)">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <CardTitle className="text-white">{activeNote?.title ?? 'Generated AI Notes'}</CardTitle>
                <CardDescription className="mt-1 text-slate-400">
                  Rich study content area with quick actions and minimal distractions
                </CardDescription>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Summarize
                </Button>
                <Button variant="secondary" className="gap-2">
                  <BookOpenText className="h-4 w-4" />
                  Flashcards
                </Button>
                <Button className="gap-2">
                  <Download className="h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </div>

            <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5">
              <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-cyan-300">
                <Sparkles className="h-3.5 w-3.5" />
                AI output
              </div>
              <div className="max-h-[32rem] overflow-auto whitespace-pre-wrap text-sm leading-7 text-slate-200">
                {generatedNotes}
              </div>
            </div>
          </GlowingCard>
        </motion.div>
      </div>
    </div>
  )
}
