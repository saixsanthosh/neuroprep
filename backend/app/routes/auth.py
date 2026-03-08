from fastapi import APIRouter, Depends, Request

from app.auth.dependencies import get_current_user
from app.core.rate_limit import limiter
from app.schemas.auth import (
    AuthResponse,
    GoogleAuthRequest,
    GoogleExchangeRequest,
    LoginRequest,
    MessageResponse,
    OAuthResponse,
    PasswordResetRequest,
    ProfileUpdateRequest,
    RegisterRequest,
    UserResponse,
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


@router.post('/google/exchange', response_model=AuthResponse)
@limiter.limit('10/minute')
def google_exchange(request: Request, payload: GoogleExchangeRequest) -> AuthResponse:
    return auth_service.google_exchange(payload)


@router.get('/me', response_model=UserResponse)
@limiter.limit('30/minute')
def me(request: Request, current_user: dict = Depends(get_current_user)) -> UserResponse:
    del request
    return auth_service.me(current_user)


@router.put('/profile', response_model=UserResponse)
@limiter.limit('15/minute')
def update_profile(
    request: Request,
    payload: ProfileUpdateRequest,
    current_user: dict = Depends(get_current_user),
) -> UserResponse:
    del request
    return auth_service.update_profile(current_user, payload)


@router.post('/password-reset', response_model=MessageResponse)
@limiter.limit('10/minute')
def password_reset(request: Request, payload: PasswordResetRequest) -> MessageResponse:
    return auth_service.request_password_reset(payload)
