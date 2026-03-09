import { Chess, type Move, type Square } from 'chess.js'

export type ChessDifficulty = 'beginner' | 'intermediate' | 'advanced'

const pieceValues: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20_000,
}

const pawnTable = [
  0, 0, 0, 0, 0, 0, 0, 0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
  5, 5, 10, 25, 25, 10, 5, 5,
  0, 0, 0, 20, 20, 0, 0, 0,
  5, -5, -10, 0, 0, -10, -5, 5,
  5, 10, 10, -20, -20, 10, 10, 5,
  0, 0, 0, 0, 0, 0, 0, 0,
]

const knightTable = [
  -50, -40, -30, -30, -30, -30, -40, -50,
  -40, -20, 0, 5, 5, 0, -20, -40,
  -30, 5, 10, 15, 15, 10, 5, -30,
  -30, 0, 15, 20, 20, 15, 0, -30,
  -30, 5, 15, 20, 20, 15, 5, -30,
  -30, 0, 10, 15, 15, 10, 0, -30,
  -40, -20, 0, 0, 0, 0, -20, -40,
  -50, -40, -30, -30, -30, -30, -40, -50,
]

const bishopTable = [
  -20, -10, -10, -10, -10, -10, -10, -20,
  -10, 5, 0, 0, 0, 0, 5, -10,
  -10, 10, 10, 10, 10, 10, 10, -10,
  -10, 0, 10, 10, 10, 10, 0, -10,
  -10, 5, 5, 10, 10, 5, 5, -10,
  -10, 0, 5, 10, 10, 5, 0, -10,
  -10, 0, 0, 0, 0, 0, 0, -10,
  -20, -10, -10, -10, -10, -10, -10, -20,
]

const rookTable = [
  0, 0, 0, 5, 5, 0, 0, 0,
  -5, 0, 0, 0, 0, 0, 0, -5,
  -5, 0, 0, 0, 0, 0, 0, -5,
  -5, 0, 0, 0, 0, 0, 0, -5,
  -5, 0, 0, 0, 0, 0, 0, -5,
  -5, 0, 0, 0, 0, 0, 0, -5,
  5, 10, 10, 10, 10, 10, 10, 5,
  0, 0, 0, 0, 0, 0, 0, 0,
]

const queenTable = [
  -20, -10, -10, -5, -5, -10, -10, -20,
  -10, 0, 0, 0, 0, 0, 0, -10,
  -10, 0, 5, 5, 5, 5, 0, -10,
  -5, 0, 5, 5, 5, 5, 0, -5,
  0, 0, 5, 5, 5, 5, 0, -5,
  -10, 5, 5, 5, 5, 5, 0, -10,
  -10, 0, 5, 0, 0, 0, 0, -10,
  -20, -10, -10, -5, -5, -10, -10, -20,
]

const kingTable = [
  -30, -40, -40, -50, -50, -40, -40, -30,
  -30, -40, -40, -50, -50, -40, -40, -30,
  -30, -40, -40, -50, -50, -40, -40, -30,
  -30, -40, -40, -50, -50, -40, -40, -30,
  -20, -30, -30, -40, -40, -30, -30, -20,
  -10, -20, -20, -20, -20, -20, -20, -10,
  20, 20, 0, 0, 0, 0, 20, 20,
  20, 30, 10, 0, 0, 10, 30, 20,
]

const positionTables: Record<string, number[]> = {
  p: pawnTable,
  n: knightTable,
  b: bishopTable,
  r: rookTable,
  q: queenTable,
  k: kingTable,
}

function squareIndex(square: Square, color: 'w' | 'b') {
  const file = square.charCodeAt(0) - 97
  const rank = Number(square[1]) - 1
  const index = (7 - rank) * 8 + file
  return color === 'w' ? index : 63 - index
}

function evaluateBoard(game: Chess) {
  if (game.isCheckmate()) {
    return game.turn() === 'w' ? -100_000 : 100_000
  }
  if (game.isDraw()) {
    return 0
  }

  let score = 0
  for (const row of game.board()) {
    for (const piece of row) {
      if (!piece) continue
      const table = positionTables[piece.type] ?? pawnTable
      const positional = table[squareIndex(piece.square as Square, piece.color)]
      const material = pieceValues[piece.type]
      const signed = piece.color === 'w' ? 1 : -1
      score += signed * (material + positional)
    }
  }

  if (game.isCheck()) {
    score += game.turn() === 'w' ? -35 : 35
  }

  return score
}

function orderMoves(moves: Move[]) {
  return [...moves].sort((left, right) => {
    const leftScore =
      (left.captured ? 10 * (pieceValues[left.captured] ?? 0) : 0) +
      (left.promotion ? pieceValues[left.promotion] ?? 0 : 0) +
      (left.san.includes('+') ? 25 : 0) +
      (left.san.includes('#') ? 1000 : 0)
    const rightScore =
      (right.captured ? 10 * (pieceValues[right.captured] ?? 0) : 0) +
      (right.promotion ? pieceValues[right.promotion] ?? 0 : 0) +
      (right.san.includes('+') ? 25 : 0) +
      (right.san.includes('#') ? 1000 : 0)
    return rightScore - leftScore
  })
}

function minimax(game: Chess, depth: number, alpha: number, beta: number, maximizing: boolean): number {
  if (depth === 0 || game.isGameOver()) {
    return evaluateBoard(game)
  }

  const orderedMoves = orderMoves(game.moves({ verbose: true }) as Move[])

  if (maximizing) {
    let bestValue = -Infinity
    for (const move of orderedMoves) {
      game.move(move)
      bestValue = Math.max(bestValue, minimax(game, depth - 1, alpha, beta, false))
      game.undo()
      alpha = Math.max(alpha, bestValue)
      if (beta <= alpha) break
    }
    return bestValue
  }

  let bestValue = Infinity
  for (const move of orderedMoves) {
    game.move(move)
    bestValue = Math.min(bestValue, minimax(game, depth - 1, alpha, beta, true))
    game.undo()
    beta = Math.min(beta, bestValue)
    if (beta <= alpha) break
  }
  return bestValue
}

function searchDepthForDifficulty(difficulty: ChessDifficulty) {
  if (difficulty === 'beginner') return 2
  if (difficulty === 'intermediate') return 3
  return 4
}

export function getBestMove(game: Chess, difficulty: ChessDifficulty): Move | null {
  const legalMoves = game.moves({ verbose: true }) as Move[]
  if (!legalMoves.length) {
    return null
  }

  if (difficulty === 'beginner') {
    const randomCut = legalMoves.filter((move) => move.captured || move.san.includes('+'))
    const pool = randomCut.length ? randomCut : legalMoves
    if (Math.random() < 0.55) {
      return pool[Math.floor(Math.random() * pool.length)]
    }
  }

  const maximizing = game.turn() === 'w'
  const depth = searchDepthForDifficulty(difficulty)
  let bestMove: Move | null = null
  let bestScore = maximizing ? -Infinity : Infinity

  for (const move of orderMoves(legalMoves)) {
    game.move(move)
    const score = minimax(game, depth - 1, -Infinity, Infinity, !maximizing)
    game.undo()

    if (maximizing ? score > bestScore : score < bestScore) {
      bestScore = score
      bestMove = move
    }
  }

  return bestMove ?? legalMoves[0]
}

export function getHintMove(game: Chess, difficulty: ChessDifficulty) {
  const cloned = new Chess(game.fen())
  return getBestMove(cloned, difficulty)
}

