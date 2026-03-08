from fastapi import APIRouter, Depends, Query

from app.auth.dependencies import get_current_user
from app.schemas.study import StudySessionCreate, StudySessionResponse, StudyStatsResponse
from app.services.gamification_service import GamificationService
from app.services.study_service import StudyService

router = APIRouter(prefix='/study', tags=['Study Tracking'])
study_service = StudyService()
gamification_service = GamificationService()


@router.post('/session', response_model=StudySessionResponse)
def create_study_session(
    payload: StudySessionCreate,
    current_user: dict = Depends(get_current_user),
) -> StudySessionResponse:
    session = study_service.create_session(current_user['id'], payload)
    if payload.session_type == 'study':
        gamification_service.record_event(
            current_user['id'],
            current_user['username'],
            'study_session_completed',
            metadata={
                'duration': payload.duration,
                'session_type': payload.session_type,
                'activity_date': str(payload.date),
                'subject': payload.subject,
            },
        )
    return StudySessionResponse(**session)


@router.get('/history', response_model=list[StudySessionResponse])
def get_study_history(
    limit: int = Query(default=200, ge=1, le=1000),
    current_user: dict = Depends(get_current_user),
) -> list[StudySessionResponse]:
    data = study_service.get_history(current_user['id'], limit=limit)
    return [StudySessionResponse(**item) for item in data]


@router.get('/stats', response_model=StudyStatsResponse)
def get_study_stats(current_user: dict = Depends(get_current_user)) -> StudyStatsResponse:
    return study_service.get_stats(current_user['id'])
