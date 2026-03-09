from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded

from app.core.config import get_settings
from app.core.rate_limit import limiter, rate_limit_handler
from app.routes.ai import router as ai_router
from app.routes.analytics import router as analytics_router
from app.routes.auth import router as auth_router
from app.routes.community import router as community_router
from app.routes.companion import router as companion_router
from app.routes.gamification import router as gamification_router
from app.routes.games import router as games_router
from app.routes.learning import router as learning_router
from app.routes.library import router as library_router
from app.routes.mock import router as mock_router
from app.routes.quiz import router as quiz_router
from app.routes.study import router as study_router
from app.routes.tasks import router as tasks_router

settings = get_settings()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version='1.0.0',
    description='Modular FastAPI backend for NeuroPrep AI Study Companion Platform.',
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(auth_router, prefix=settings.API_V1_PREFIX)
app.include_router(learning_router, prefix=settings.API_V1_PREFIX)
app.include_router(companion_router, prefix=settings.API_V1_PREFIX)
app.include_router(library_router, prefix=settings.API_V1_PREFIX)
app.include_router(community_router, prefix=settings.API_V1_PREFIX)
app.include_router(gamification_router, prefix=settings.API_V1_PREFIX)
app.include_router(study_router, prefix=settings.API_V1_PREFIX)
app.include_router(tasks_router, prefix=settings.API_V1_PREFIX)
app.include_router(quiz_router, prefix=settings.API_V1_PREFIX)
app.include_router(mock_router, prefix=settings.API_V1_PREFIX)
app.include_router(ai_router, prefix=settings.API_V1_PREFIX)
app.include_router(games_router, prefix=settings.API_V1_PREFIX)
app.include_router(analytics_router, prefix=settings.API_V1_PREFIX)


@app.get('/health')
def health() -> dict[str, str]:
    return {'status': 'ok', 'service': settings.PROJECT_NAME}
