from fastapi import APIRouter, Depends, Query

from app.auth.dependencies import get_current_user
from app.schemas.games import GameScoreCreate, GameScoreResponse, LeaderboardEntry
from app.services.gamification_service import GamificationService
from app.services.games_service import GamesService

router = APIRouter(prefix='/games', tags=['Games'])
games_service = GamesService()
gamification_service = GamificationService()


@router.post('/score', response_model=GameScoreResponse)
def submit_game_score(
    payload: GameScoreCreate,
    current_user: dict = Depends(get_current_user),
) -> GameScoreResponse:
    score = games_service.submit_score(current_user['id'], current_user['username'], payload)
    gamification_service.record_event(
        current_user['id'],
        current_user['username'],
        'game_score_submitted',
        metadata={'subject': payload.game_name, 'score': payload.score},
    )
    return GameScoreResponse(**score)


@router.get('/leaderboard', response_model=list[LeaderboardEntry])
def get_leaderboard(limit: int = Query(default=20, ge=5, le=100)) -> list[LeaderboardEntry]:
    data = games_service.leaderboard(limit=limit)
    return [LeaderboardEntry(**item) for item in data]
