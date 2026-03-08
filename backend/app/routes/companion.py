from fastapi import APIRouter, Depends

from app.auth.dependencies import get_current_user
from app.schemas.companion import CompanionBriefResponse
from app.services.companion_service import CompanionService

router = APIRouter(prefix='/companion', tags=['AI Study Companion'])
companion_service = CompanionService()


@router.get('/daily-brief', response_model=CompanionBriefResponse)
def get_daily_brief(current_user: dict = Depends(get_current_user)) -> CompanionBriefResponse:
    return CompanionBriefResponse(**companion_service.daily_brief(current_user))
