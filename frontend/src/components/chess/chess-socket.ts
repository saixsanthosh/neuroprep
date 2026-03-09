export type ChessRoomEvent =
  | { type: 'join'; roomCode: string }
  | { type: 'leave'; roomCode: string }
  | { type: 'move'; roomCode: string; payload: { from: string; to: string; promotion?: string | null } }
  | { type: 'sync'; roomCode: string; payload: { pgn: string; whiteTime: number; blackTime: number } }
  | { type: 'reset'; roomCode: string }

export function createChessSocket(roomCode: string, onMessage: (event: ChessRoomEvent) => void) {
  if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') {
    return {
      send: () => undefined,
      close: () => undefined,
    }
  }

  const channel = new BroadcastChannel(`neuroprep-chess-${roomCode}`)
  channel.onmessage = (event: MessageEvent<ChessRoomEvent>) => onMessage(event.data)

  return {
    send: (event: ChessRoomEvent) => channel.postMessage(event),
    close: () => channel.close(),
  }
}
