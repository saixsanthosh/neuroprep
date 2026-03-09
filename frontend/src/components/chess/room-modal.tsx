import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, LogIn } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

interface RoomModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateRoom: () => void
  onJoinRoom: (code: string) => void
}

export function RoomModal({ isOpen, onClose, onCreateRoom, onJoinRoom }: RoomModalProps) {
  const [mode, setMode] = useState<'select' | 'join'>('select')
  const [roomCode, setRoomCode] = useState('')

  const handleJoin = () => {
    if (roomCode.length === 5) {
      onJoinRoom(roomCode)
      setRoomCode('')
      setMode('select')
    }
  }

  const handleClose = () => {
    setMode('select')
    setRoomCode('')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={handleClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <h2 className="mb-6 text-2xl font-bold text-white">Online Room</h2>

              {mode === 'select' ? (
                <div className="space-y-4">
                  <button
                    onClick={onCreateRoom}
                    className="group flex w-full items-center gap-4 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-6 transition hover:bg-cyan-400/20"
                  >
                    <div className="rounded-xl bg-cyan-500/20 p-3">
                      <Plus className="h-6 w-6 text-cyan-300" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-white">Create Room</h3>
                      <p className="text-sm text-cyan-200">
                        Generate a room code to share with friends
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setMode('join')}
                    className="group flex w-full items-center gap-4 rounded-2xl border border-violet-300/20 bg-violet-400/10 p-6 transition hover:bg-violet-400/20"
                  >
                    <div className="rounded-xl bg-violet-500/20 p-3">
                      <LogIn className="h-6 w-6 text-violet-300" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-white">Join Room</h3>
                      <p className="text-sm text-violet-200">
                        Enter a room code to join a friend's game
                      </p>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Enter Room Code
                    </label>
                    <Input
                      type="text"
                      maxLength={5}
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                      placeholder="12345"
                      className="text-center text-2xl font-mono tracking-widest"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={() => setMode('select')}
                    >
                      Back
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleJoin}
                      disabled={roomCode.length !== 5}
                    >
                      Join Room
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
