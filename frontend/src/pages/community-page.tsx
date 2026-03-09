import { useEffect, useState } from 'react'
import { MessageSquareText, Send, ThumbsUp, Users2 } from 'lucide-react'

import { ModulePageShell } from '../components/dashboard/module-page-shell'
import { Button } from '../components/ui/button'
import { CardDescription, CardTitle } from '../components/ui/card'
import { GlowingCard } from '../components/ui/glowing-card'
import { Input } from '../components/ui/input'
import {
  createCommunityPost,
  getCommunityPosts,
  replyToCommunityPost,
  upvoteCommunityPost,
  type CommunityPost,
} from '../lib/api'

export function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [title, setTitle] = useState('')
  const [topic, setTopic] = useState('Study Strategy')
  const [body, setBody] = useState('')
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({})
  const [statusMessage, setStatusMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const loadPosts = async () => {
    setIsLoading(true)
    try {
      const data = await getCommunityPosts(24)
      setPosts(data)
      setStatusMessage('Community feed refreshed.')
    } catch {
      setStatusMessage('Community feed could not be loaded.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadPosts()
  }, [])

  const handleCreatePost = async () => {
    const tags = topic
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean)
      .slice(0, 4)

    if (!title.trim() || !body.trim() || !tags.length) {
      setStatusMessage('Enter a title, body, and at least one topic/tag.')
      return
    }

    try {
      const created = await createCommunityPost({
        title: title.trim(),
        body: body.trim(),
        topic: tags[0],
        tags,
      })
      setPosts((current) => [created, ...current])
      setTitle('')
      setBody('')
      setStatusMessage('Community post published.')
    } catch {
      setStatusMessage('Publishing the post failed.')
    }
  }

  const handleUpvote = async (postId: string) => {
    try {
      const updated = await upvoteCommunityPost(postId)
      setPosts((current) => current.map((post) => (post.id === updated.id ? { ...post, upvotes: updated.upvotes } : post)))
    } catch {
      setStatusMessage('Upvoting the post failed.')
    }
  }

  const handleReply = async (postId: string) => {
    const body = replyDrafts[postId]?.trim()
    if (!body) return
    try {
      const reply = await replyToCommunityPost(postId, body)
      setPosts((current) =>
        current.map((post) =>
          post.id === postId ? { ...post, replies: [...post.replies, reply] } : post,
        ),
      )
      setReplyDrafts((current) => ({ ...current, [postId]: '' }))
    } catch {
      setStatusMessage('Replying to the post failed.')
    }
  }

  return (
    <ModulePageShell
      badge="Community"
      title="Discuss strategy, doubts, and"
      highlight="study systems"
      description="A focused discussion feed for student questions, study-group prompts, revision tactics, and peer support threads."
      actions={
        <Button variant="secondary" onClick={() => void loadPosts()} disabled={isLoading}>
          <Users2 className="h-4 w-4" />
          {isLoading ? 'Refreshing...' : 'Refresh feed'}
        </Button>
      }
    >
      {statusMessage ? (
        <div className="rounded-[1.4rem] border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
          {statusMessage}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <GlowingCard className="p-0" glowColor="rgba(124, 58, 237, 0.28)">
          <div className="space-y-5 p-6">
            <div>
              <CardTitle className="text-white">Start a discussion</CardTitle>
              <CardDescription className="mt-1 text-slate-400">Ask a question, share a tactic, or post a revision thread.</CardDescription>
            </div>
            <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Post title" className="border-white/10 bg-white/5 text-white placeholder:text-slate-500" />
            <Input value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="Topic tags, comma separated" className="border-white/10 bg-white/5 text-white placeholder:text-slate-500" />
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="What do you want to discuss?"
              className="min-h-[16rem] w-full rounded-[1.5rem] border border-white/10 bg-black/15 p-4 text-sm leading-7 text-slate-200 outline-none transition focus:border-cyan-300/30"
            />
            <Button onClick={handleCreatePost}>
              <Send className="h-4 w-4" />
              Publish post
            </Button>
          </div>
        </GlowingCard>

        <div className="space-y-6">
          {posts.length ? (
            posts.map((post) => (
              <GlowingCard key={post.id} className="p-0" glowColor="rgba(34, 211, 238, 0.24)">
                <div className="space-y-5 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">{post.topic}</p>
                      <p className="mt-2 text-xl font-bold text-white">{post.title}</p>
                      <p className="mt-2 text-sm text-slate-400">by {post.author_name}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void handleUpvote(post.id)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      {post.upvotes}
                    </button>
                  </div>

                  <p className="text-sm leading-7 text-slate-300">{post.body}</p>

                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-3 rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <MessageSquareText className="h-4 w-4 text-cyan-300" />
                      Replies ({post.replies.length})
                    </div>
                    <div className="space-y-3">
                      {post.replies.map((reply) => (
                        <div key={reply.id} className="rounded-[1.2rem] border border-white/10 bg-black/20 p-3">
                          <p className="text-sm font-semibold text-white">{reply.author_name}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-400">{reply.body}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Input
                        value={replyDrafts[post.id] ?? ''}
                        onChange={(event) => setReplyDrafts((current) => ({ ...current, [post.id]: event.target.value }))}
                        placeholder="Write a reply"
                        className="border-white/10 bg-black/20 text-white placeholder:text-slate-500"
                      />
                      <Button variant="secondary" onClick={() => void handleReply(post.id)}>
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </GlowingCard>
            ))
          ) : (
            <GlowingCard className="p-0" glowColor="rgba(34, 211, 238, 0.24)">
              <div className="p-6">
                <CardTitle className="text-white">No posts yet</CardTitle>
                <CardDescription className="mt-2 text-slate-400">Start the first study thread and turn this into the shared discussion board.</CardDescription>
              </div>
            </GlowingCard>
          )}
        </div>
      </div>
    </ModulePageShell>
  )
}
