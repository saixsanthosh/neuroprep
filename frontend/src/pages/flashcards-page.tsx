import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpenCheck, BrainCircuit, PlusCircle, RefreshCw, Trash2 } from 'lucide-react'

import { ModulePageShell } from '../components/dashboard/module-page-shell'
import { Button } from '../components/ui/button'
import { CardDescription, CardTitle } from '../components/ui/card'
import { GlowingCard } from '../components/ui/glowing-card'
import { Input } from '../components/ui/input'
import { createFlashcards, deleteFlashcard, getFlashcards, recordGamificationEvent, type LibraryFlashcard } from '../lib/api'

function parseCards(block: string, subject: string) {
  return block
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [question, answer] = line.split('|').map((item) => item.trim())
      if (!question || !answer) return null
      return { question, answer, subject, difficulty: 'medium' as const }
    })
    .filter((item): item is { question: string; answer: string; subject: string; difficulty: 'medium' } => Boolean(item))
}

export function FlashcardsPage() {
  const [subject, setSubject] = useState('General')
  const [composer, setComposer] = useState('Question | Answer')
  const [cards, setCards] = useState<LibraryFlashcard[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let active = true
    const loadCards = async () => {
      setIsLoading(true)
      try {
        const result = await getFlashcards(undefined, 200)
        if (active) setCards(result)
      } catch {
        if (active) setCards([])
      } finally {
        if (active) setIsLoading(false)
      }
    }
    void loadCards()
    return () => {
      active = false
    }
  }, [])

  const visibleCards = useMemo(() => {
    const currentSubject = subject.trim().toLowerCase()
    return currentSubject && currentSubject !== 'general'
      ? cards.filter((card) => card.subject.toLowerCase() === currentSubject)
      : cards
  }, [cards, subject])

  const activeCard = visibleCards[activeIndex] ?? null

  useEffect(() => {
    if (activeIndex >= visibleCards.length) {
      setActiveIndex(0)
      setShowAnswer(false)
    }
  }, [activeIndex, visibleCards.length])

  const handleCreate = async () => {
    const parsed = parseCards(composer, subject.trim() || 'General')
    if (!parsed.length || isSaving) {
      setStatusMessage('Add one card per line using the format Question | Answer.')
      return
    }

    setIsSaving(true)
    try {
      const created = await createFlashcards({ cards: parsed })
      setCards((current) => [...created, ...current])
      setComposer('Question | Answer')
      setStatusMessage(`${created.length} flashcard${created.length > 1 ? 's' : ''} saved.`)
    } catch {
      setStatusMessage('Saving flashcards failed.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleReview = async () => {
    if (!activeCard) return
    setShowAnswer((current) => !current)
    if (!showAnswer) {
      try {
        await recordGamificationEvent({
          event_type: 'flashcards_reviewed',
          count: 1,
          subject: activeCard.subject,
          metadata: { flashcard_id: activeCard.id },
        })
      } catch {
        // No blocking UI change needed here.
      }
    }
  }

  const handleDelete = async (flashcardId: string) => {
    try {
      await deleteFlashcard(flashcardId)
      setCards((current) => current.filter((card) => card.id !== flashcardId))
      setStatusMessage('Flashcard deleted.')
    } catch {
      setStatusMessage('Deleting the flashcard failed.')
    }
  }

  return (
    <ModulePageShell
      badge="Flashcards"
      title="Run faster recall with"
      highlight="saved decks"
      description="Build subject decks, review them in active-recall mode, and feed the habit loop every time you complete a card cycle."
      actions={
        <>
          <Input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Filter by subject"
            className="h-12 min-w-[16rem] border-white/10 bg-white/5 text-white placeholder:text-slate-500"
          />
          <Button variant="secondary" onClick={() => void getFlashcards(undefined, 200).then(setCards).catch(() => setCards([]))}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <GlowingCard className="p-0" glowColor="rgba(124, 58, 237, 0.28)">
          <div className="space-y-5 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-white">Create deck</CardTitle>
                <CardDescription className="mt-1 text-slate-400">
                  Add one flashcard per line using the format Question | Answer.
                </CardDescription>
              </div>
              <PlusCircle className="h-5 w-5 text-violet-300" />
            </div>

            <textarea
              value={composer}
              onChange={(event) => setComposer(event.target.value)}
              className="min-h-[18rem] w-full rounded-[1.5rem] border border-white/10 bg-black/15 p-4 text-sm leading-7 text-slate-200 outline-none transition focus:border-cyan-300/30"
            />

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleCreate} disabled={isSaving}>
                <BookOpenCheck className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save flashcards'}
              </Button>
              <Button variant="secondary" onClick={() => setComposer('Question | Answer')}>
                <RefreshCw className="h-4 w-4" />
                Reset composer
              </Button>
            </div>

            {statusMessage ? (
              <div className="rounded-[1.25rem] border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
                {statusMessage}
              </div>
            ) : null}
          </div>
        </GlowingCard>

        <div className="space-y-6">
          <GlowingCard className="p-0" glowColor="rgba(34, 211, 238, 0.28)">
            <div className="space-y-5 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-white">Review mode</CardTitle>
                  <CardDescription className="mt-1 text-slate-400">
                    Flip the active card, then advance through the saved deck.
                  </CardDescription>
                </div>
                <BrainCircuit className="h-5 w-5 text-cyan-300" />
              </div>

              <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
                {activeCard ? (
                  <>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      {activeCard.subject} | {activeCard.difficulty}
                    </p>
                    <motion.div
                      key={`${activeCard.id}-${showAnswer}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 min-h-[11rem] rounded-[1.4rem] border border-white/10 bg-black/20 p-5"
                    >
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                        {showAnswer ? 'Answer' : 'Question'}
                      </p>
                      <p className="mt-4 text-lg font-semibold leading-8 text-white">
                        {showAnswer ? activeCard.answer : activeCard.question}
                      </p>
                    </motion.div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button onClick={handleReview}>{showAnswer ? 'Hide answer' : 'Reveal answer'}</Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setActiveIndex((current) => (visibleCards.length ? (current + 1) % visibleCards.length : 0))
                          setShowAnswer(false)
                        }}
                      >
                        Next card
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-black/20 px-4 py-10 text-center text-sm text-slate-400">
                    {isLoading ? 'Loading flashcards...' : 'No flashcards available for the current filter.'}
                  </div>
                )}
              </div>
            </div>
          </GlowingCard>

          <GlowingCard className="p-0" glowColor="rgba(16, 185, 129, 0.28)">
            <div className="space-y-4 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-white">Deck library</CardTitle>
                  <CardDescription className="mt-1 text-slate-400">
                    Saved cards in the current subject lane.
                  </CardDescription>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                  {visibleCards.length} cards
                </span>
              </div>

              <div className="space-y-3">
                {visibleCards.slice(0, 12).map((card) => (
                  <div key={card.id} className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">{card.question}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-400">{card.answer}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void handleDelete(card.id)}
                        className="rounded-2xl border border-white/10 bg-black/20 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlowingCard>
        </div>
      </div>
    </ModulePageShell>
  )
}
