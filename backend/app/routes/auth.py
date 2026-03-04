from fastapi import APIRouter, Request

from app.core.rate_limit import limiter
from app.schemas.auth import (
    AuthResponse,
    GoogleAuthRequest,
    LoginRequest,
    OAuthResponse,
    RegisterRequest,
)
from app.services.auth_service import AuthService

router = APIRouter(prefix='/auth', tags=['Auth'])
auth_service = AuthService()


@router.post('/register', response_model=AuthResponse)
@limiter.limit('10/minute')
def register(request: Request, payload: RegisterRequest) -> AuthResponse:
    return auth_service.register(payload)


@router.post('/login', response_model=AuthResponse)
@limiter.limit('15/minute')
def login(request: Request, payload: LoginRequest) -> AuthResponse:
    return auth_service.login(payload)


@router.post('/google', response_model=AuthResponse | OAuthResponse)
@limiter.limit('10/minute')
def google_auth(request: Request, payload: GoogleAuthRequest) -> AuthResponse | OAuthResponse:
    return auth_service.google_auth(payload)
