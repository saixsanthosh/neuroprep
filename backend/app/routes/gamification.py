from fastapi import APIRouter, Depends, Query

from app.auth.dependencies import get_current_user
from app.schemas.gamification import (
    DailyChallengeResponse,
    GamificationEventRequest,
    GamificationSummaryResponse,
    LeaderboardEntryResponse,
    StudyMissionResponse,
)
from app.services.gamification_service import GamificationService

router = APIRouter(prefix='/gamification', tags=['Habit Loop'])
gamification_service = GamificationService()


@router.get('/summary', response_model=GamificationSummaryResponse)
def get_summary(current_user: dict = Depends(get_current_user)) -> GamificationSummaryResponse:
    return GamificationSummaryResponse(**gamification_service.summary(current_user['id']))


@router.get('/challenges', response_model=list[DailyChallengeResponse])
def get_challenges(current_user: dict = Depends(get_current_user)) -> list[DailyChallengeResponse]:
    return [DailyChallengeResponse(**item) for item in gamification_service.list_challenges(current_user['id'])]


@router.get('/missions', response_model=list[StudyMissionResponse])
def get_missions(current_user: dict = Depends(get_current_user)) -> list[StudyMissionResponse]:
    return [StudyMissionResponse(**item) for item in gamification_service.list_missions(current_user['id'])]


@router.get('/leaderboard', response_model=list[LeaderboardEntryResponse])
def get_leaderboard(
    scope: str = Query(default='weekly', pattern='^(weekly|global)$'),
    limit: int = Query(default=10, ge=3, le=50),
) -> list[LeaderboardEntryResponse]:
    data = gamification_service.leaderboard(scope=scope, limit=limit)
    return [LeaderboardEntryResponse(**item) for item in data]


@router.post('/event', response_model=GamificationSummaryResponse)
def record_event(
    payload: GamificationEventRequest,
    current_user: dict = Depends(get_current_user),
) -> GamificationSummaryResponse:
    data = gamification_service.record_event(
        current_user['id'],
        current_user['username'],
        payload.event_type,
        count=payload.count,
        metadata={
            **payload.metadata,
            'subject': payload.subject,
            'topic': payload.topic,
        },
    )
    return GamificationSummaryResponse(**data)
