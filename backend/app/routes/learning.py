from fastapi import APIRouter, Depends, Query

from app.auth.dependencies import get_current_user
from app.core.config import get_settings
from app.schemas.learning import (
    LanguagePathResponse,
    LearningDashboardResponse,
    LearningProfileResponse,
    LearningProfileUpsertRequest,
    LearningResourcesResult,
    OnboardingOptionsResponse,
)
from app.services.learning_profile_service import LearningProfileService
from app.services.resource_service import ResourceService

router = APIRouter(prefix='/learning', tags=['Learning Profile'])
learning_profile_service = LearningProfileService()
resource_service = ResourceService()
settings = get_settings()


@router.get('/options', response_model=OnboardingOptionsResponse)
def get_onboarding_options() -> OnboardingOptionsResponse:
    return OnboardingOptionsResponse(**learning_profile_service.get_onboarding_options())


@router.get('/profile', response_model=LearningProfileResponse)
def get_learning_profile(current_user: dict = Depends(get_current_user)) -> LearningProfileResponse:
    profile = learning_profile_service.require_profile(current_user['id'])
    return LearningProfileResponse(**profile)


@router.put('/profile', response_model=LearningProfileResponse)
def upsert_learning_profile(
    payload: LearningProfileUpsertRequest,
    current_user: dict = Depends(get_current_user),
) -> LearningProfileResponse:
    profile = learning_profile_service.upsert_profile(current_user['id'], payload)
    return LearningProfileResponse(**profile)


@router.get('/dashboard', response_model=LearningDashboardResponse)
def get_learning_dashboard(current_user: dict = Depends(get_current_user)) -> LearningDashboardResponse:
    profile = learning_profile_service.require_profile(current_user['id'])
    return LearningDashboardResponse(**learning_profile_service.build_dashboard(profile))


@router.get('/resources', response_model=LearningResourcesResult)
def get_learning_resources(
    topic: str | None = Query(default=None, max_length=160),
    current_user: dict = Depends(get_current_user),
) -> LearningResourcesResult:
    profile = learning_profile_service.require_profile(current_user['id'])
    return LearningResourcesResult(**resource_service.recommended_resources(profile, topic=topic))


@router.get('/language-path', response_model=LanguagePathResponse)
def get_language_path(current_user: dict = Depends(get_current_user)) -> LanguagePathResponse:
    profile = learning_profile_service.require_profile(current_user['id'])
    path = learning_profile_service.build_language_path(profile)
    path['speech_stack'] = {
        'whisper': bool(settings.WHISPER_MODEL),
        'coqui_tts': bool(settings.COQUI_TTS_MODEL),
        'libretranslate': bool(settings.LIBRETRANSLATE_URL),
    }
    return LanguagePathResponse(**path)
