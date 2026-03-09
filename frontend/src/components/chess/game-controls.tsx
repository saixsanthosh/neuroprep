import { Lightbulb, RotateCcw, Flag } from 'lucide-react'
import { Button } from '../ui/button'
import { GlowingCard } from '../ui/glowing-card'

interface GameControlsProps {
  onHint: () => void
  onUndo: () => void
  onResign: () => void
}

export function GameControls({ onHint, onUndo, onResign }: GameControlsProps) {
  return (
    <GlowingCard className="p-4" glowColor="rgba(167, 139, 250, 0.3)">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
        Game Controls
      </h3>
      <div className="space-y-2">
        <Button
          variant="secondary"
          className="w-full justify-start gap-3"
          onClick={onHint}
        >
          <Lightbulb className="h-4 w-4" />
          Show Hint
        </Button>
        <Button
          variant="secondary"
          className="w-full justify-start gap-3"
          onClick={onUndo}
        >
          <RotateCcw className="h-4 w-4" />
          Undo Move
        </Button>
        <Button
          variant="secondary"
          className="w-full justify-start gap-3 text-red-300 hover:bg-red-500/20"
          onClick={onResign}
        >
          <Flag className="h-4 w-4" />
          Resign Game
        </Button>
      </div>
    </GlowingCard>
  )
}
