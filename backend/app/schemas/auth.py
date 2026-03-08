from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    username: str = Field(min_length=3, max_length=50)
    password: str = Field(min_length=8, max_length=128)
    role: Literal['student', 'teacher', 'admin'] = 'student'


class LoginRequest(BaseModel):
    identifier: str = Field(min_length=3, max_length=120)
    password: str = Field(min_length=8, max_length=128)


class GoogleAuthRequest(BaseModel):
    id_token: str | None = None
    redirect_to: str | None = None
    role: Literal['student', 'teacher', 'admin'] | None = None


class GoogleExchangeRequest(BaseModel):
    code: str | None = None
    access_token: str | None = None
    redirect_to: str | None = None
    role: Literal['student', 'teacher', 'admin'] | None = None


class ProfileUpdateRequest(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=120)
    username: str | None = Field(default=None, min_length=3, max_length=50)


class PasswordResetRequest(BaseModel):
    email: EmailStr
    redirect_to: str | None = None


class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    username: str
    role: str
    created_at: datetime | None = None
    last_login: datetime | None = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'
    expires_in: int


class AuthResponse(BaseModel):
    user: UserResponse
    token: TokenResponse
    message: str


class OAuthResponse(BaseModel):
    oauth_url: str
    message: str


class MessageResponse(BaseModel):
    message: str
