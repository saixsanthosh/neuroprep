import { AnimatePresence, motion } from 'framer-motion'
import { Bot, SendHorizontal, Sparkles, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '../components/ui/button'
import { Card, CardDescription, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const seedReplies = [
  'Great question. Start by splitting this topic into definitions, derivation, and 3 solved examples.',
  'For exams, focus on high-frequency concepts first and then move to mixed-practice sets.',
  'I can generate a mini revision sheet and 5 practice questions if you want.',
]

export function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      role: 'assistant',
      content: 'Hi, I am your NeuroPrep tutor. Ask me any concept, formula, or mock-test doubt.',
    },
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)

  const feedRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, thinking])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed || thinking) {
      return
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setThinking(true)

    const reply = seedReplies[Math.floor(Math.random() * seedReplies.length)]
    const assistantId = crypto.randomUUID()
    let index = 0

    setTimeout(() => {
      setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }])

      const interval = setInterval(() => {
        index += 1
        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantId
              ? { ...message, content: reply.slice(0, index) }
              : message,
          ),
        )

        if (index >= reply.length) {
          clearInterval(interval)
          setThinking(false)
        }
      }, 22)
    }, 650)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">AI Tutor</h1>
        <p className="mt-1 text-muted">Concept explanations, step-by-step solutions, and exam-focused help.</p>
      </div>

      <Card className="flex h-[72vh] flex-col">
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <CardTitle>NeuroPrep Tutor</CardTitle>
            <CardDescription>Streaming responses with thinking indicator.</CardDescription>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-muted">
            <Sparkles className="h-3.5 w-3.5 text-accent-cyan" />
            Gemini Ready
          </div>
        </div>

        <div ref={feedRef} className="flex-1 space-y-4 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex max-w-[85%] items-start gap-3 rounded-2xl px-4 py-3 text-sm sm:max-w-[75%] ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                      : 'border border-white/15 bg-white/5 text-[var(--text-main)]'
                  }`}
                >
                  <div className="mt-0.5">
                    {message.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4 text-accent-cyan" />
                    )}
                  </div>
                  <p className="leading-relaxed">{message.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {thinking && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs text-muted"
            >
              <span>AI thinking</span>
              <span className="flex gap-1">
                {[0, 1, 2].map((dot) => (
                  <motion.span
                    key={dot}
                    className="h-1.5 w-1.5 rounded-full bg-accent-cyan"
                    animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                    transition={{ repeat: Infinity, delay: dot * 0.12, duration: 0.8 }}
                  />
                ))}
              </span>
            </motion.div>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row">
          <Input
            placeholder="Ask a concept, formula, or question..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleSend()
              }
            }}
          />
          <Button onClick={handleSend} className="sm:w-auto" disabled={thinking}>
            Send
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  )
}
