from fastapi import APIRouter, Depends, Query

from app.auth.dependencies import get_current_user
from app.schemas.games import GameScoreCreate, GameScoreResponse, LeaderboardEntry
from app.services.games_service import GamesService

router = APIRouter(prefix='/games', tags=['Games'])
games_service = GamesService()


@router.post('/score', response_model=GameScoreResponse)
def submit_game_score(
    payload: GameScoreCreate,
    current_user: dict = Depends(get_current_user),
) -> GameScoreResponse:
    return GameScoreResponse(**games_service.submit_score(current_user['id'], payload))


@router.get('/leaderboard', response_model=list[LeaderboardEntry])
def get_leaderboard(limit: int = Query(default=20, ge=5, le=100)) -> list[LeaderboardEntry]:
    data = games_service.leaderboard(limit=limit)
    return [LeaderboardEntry(**item) for item in data]
