from __future__ import annotations

from datetime import timedelta
from uuid import uuid4

from fastapi import HTTPException, status

from app.core.config import get_settings
from app.core.security import create_access_token, hash_password, verify_password
from app.database.supabase_client import get_supabase_admin_client
from app.schemas.auth import (
    AuthResponse,
    GoogleAuthRequest,
    LoginRequest,
    OAuthResponse,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)
from app.services.helpers import utc_now_iso


class AuthService:
    def __init__(self):
        self.client = get_supabase_admin_client()
        self.settings = get_settings()

    def _to_user_response(self, row: dict) -> UserResponse:
        return UserResponse(
            id=row['id'],
            name=row['name'],
            email=row['email'],
            username=row['username'],
            role=row['role'],
            created_at=row.get('created_at'),
            last_login=row.get('last_login'),
        )

    def _resolve_email(self, identifier: str) -> str:
        if '@' in identifier:
            return identifier.lower()

        lookup = (
            self.client.table('users')
            .select('email')
            .eq('username', identifier.lower())
            .limit(1)
            .execute()
        )
        if not lookup.data:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid credentials')
        return lookup.data[0]['email']

    def register(self, payload: RegisterRequest) -> AuthResponse:
        email = payload.email.lower()
        username = payload.username.lower()

        email_exists = self.client.table('users').select('id').eq('email', email).limit(1).execute()
        if email_exists.data:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='Email already registered')

        username_exists = (
            self.client.table('users').select('id').eq('username', username).limit(1).execute()
        )
        if username_exists.data:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='Username already in use')

        auth_user_id = str(uuid4())
        try:
            auth_response = self.client.auth.sign_up({'email': email, 'password': payload.password})
            auth_user = getattr(auth_response, 'user', None)
            if auth_user and getattr(auth_user, 'id', None):
                auth_user_id = str(auth_user.id)
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f'Unable to register with Supabase Auth: {exc}',
            ) from exc

        row = {
            'id': auth_user_id,
            'name': payload.name,
            'email': email,
            'username': username,
            'role': payload.role,
            'created_at': utc_now_iso(),
            'last_login': utc_now_iso(),
            'password_hash': hash_password(payload.password),
        }

        inserted = self.client.table('users').insert(row).execute()
        if not inserted.data:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='Failed to create user')

        access_token = create_access_token(
            subject=auth_user_id,
            role=payload.role,
            expires_delta=timedelta(minutes=self.settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        )

        return AuthResponse(
            user=self._to_user_response(inserted.data[0]),
            token=TokenResponse(
                access_token=access_token,
                expires_in=self.settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            ),
            message='Registration successful. Verify your email in Supabase Auth to activate full login.',
        )

    def login(self, payload: LoginRequest) -> AuthResponse:
        email = self._resolve_email(payload.identifier)
        user_response = self.client.table('users').select('*').eq('email', email).limit(1).execute()
        if not user_response.data:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid credentials')

        user_row = user_response.data[0]
        if not verify_password(payload.password, user_row.get('password_hash')):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid credentials')

        try:
            self.client.auth.sign_in_with_password({'email': email, 'password': payload.password})
        except Exception:
            # Local hash verification already succeeded; keep API login resilient.
            pass

        now_iso = utc_now_iso()
        self.client.table('users').update({'last_login': now_iso}).eq('id', user_row['id']).execute()
        user_row['last_login'] = now_iso

        access_token = create_access_token(
            subject=user_row['id'],
            role=user_row.get('role', 'student'),
            expires_delta=timedelta(minutes=self.settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        )

        return AuthResponse(
            user=self._to_user_response(user_row),
            token=TokenResponse(
                access_token=access_token,
                expires_in=self.settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            ),
            message='Login successful',
        )

    def google_auth(self, payload: GoogleAuthRequest) -> AuthResponse | OAuthResponse:
        if payload.id_token:
            try:
                auth_response = self.client.auth.sign_in_with_id_token(
                    {'provider': 'google', 'token': payload.id_token}
                )
                auth_user = getattr(auth_response, 'user', None)
                if not auth_user:
                    raise ValueError('No user returned from Google auth')
            except Exception as exc:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f'Google auth failed: {exc}',
                ) from exc

            email = str(getattr(auth_user, 'email', '')).lower()
            lookup = self.client.table('users').select('*').eq('email', email).limit(1).execute()
            if lookup.data:
                user_row = lookup.data[0]
            else:
                user_row = {
                    'id': str(getattr(auth_user, 'id', uuid4())),
                    'name': getattr(auth_user, 'user_metadata', {}).get('full_name', 'Google User'),
                    'email': email,
                    'username': email.split('@')[0],
                    'role': 'student',
                    'created_at': utc_now_iso(),
                    'last_login': utc_now_iso(),
                    'password_hash': None,
                }
                self.client.table('users').insert(user_row).execute()

            access_token = create_access_token(
                subject=user_row['id'],
                role=user_row.get('role', 'student'),
                expires_delta=timedelta(minutes=self.settings.ACCESS_TOKEN_EXPIRE_MINUTES),
            )

            return AuthResponse(
                user=self._to_user_response(user_row),
                token=TokenResponse(
                    access_token=access_token,
                    expires_in=self.settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
                ),
                message='Google login successful',
            )

        redirect_to = payload.redirect_to or 'http://localhost:5173/auth/callback'
        try:
            oauth_response = self.client.auth.sign_in_with_oauth(
                {'provider': 'google', 'options': {'redirect_to': redirect_to}}
            )
            oauth_data = (
                oauth_response
                if isinstance(oauth_response, dict)
                else getattr(oauth_response, 'data', {})
            )
            oauth_url = (
                getattr(oauth_response, 'url', None)
                or (oauth_data.get('url') if isinstance(oauth_data, dict) else None)
            )
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f'Unable to generate Google OAuth URL: {exc}',
            ) from exc

        if not oauth_url:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail='Google OAuth URL was not returned by Supabase',
            )

        return OAuthResponse(oauth_url=oauth_url, message='Open the URL to continue Google sign-in')
