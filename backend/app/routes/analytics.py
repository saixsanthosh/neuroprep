from fastapi import APIRouter, Depends

from app.auth.dependencies import get_current_user
from app.schemas.analytics import PerformanceResponse, StudyHoursResponse, WeakTopicResponse
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix='/analytics', tags=['Analytics'])
analytics_service = AnalyticsService()


@router.get('/study-hours', response_model=StudyHoursResponse)
def get_study_hours(current_user: dict = Depends(get_current_user)) -> StudyHoursResponse:
    return StudyHoursResponse(**analytics_service.study_hours(current_user['id']))


@router.get('/performance', response_model=PerformanceResponse)
def get_performance(current_user: dict = Depends(get_current_user)) -> PerformanceResponse:
    return PerformanceResponse(**analytics_service.performance(current_user['id']))


@router.get('/weak-topics', response_model=list[WeakTopicResponse])
def get_weak_topics(current_user: dict = Depends(get_current_user)) -> list[WeakTopicResponse]:
    data = analytics_service.weak_topics(current_user['id'])
    return [WeakTopicResponse(**item) for item in data]
