from __future__ import annotations

from datetime import timedelta
from uuid import NAMESPACE_URL, uuid4, uuid5

from fastapi import HTTPException, status

from app.core.config import get_settings
from app.core.security import create_access_token, hash_password, verify_password
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
    TokenResponse,
    UserResponse,
)
from app.services.helpers import utc_now_iso

_demo_users: dict[str, dict] = {}


def get_demo_user(user_id: str) -> dict | None:
    return _demo_users.get(user_id)


def list_demo_users() -> list[dict]:
    return [dict(user) for user in _demo_users.values()]


def _get_client():
    from app.database.supabase_client import get_supabase_admin_client

    return get_supabase_admin_client()


class AuthService:
    def __init__(self):
        self.settings = get_settings()
        self.demo_mode = getattr(self.settings, 'DEMO_MODE', False)
        self.client = None if self.demo_mode else _get_client()

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

    def _issue_auth_response(self, row: dict, message: str) -> AuthResponse:
        token_claims = None
        if self.demo_mode:
            token_claims = {
                'name': row['name'],
                'email': row['email'],
                'username': row['username'],
                'created_at': row.get('created_at'),
                'last_login': row.get('last_login'),
            }
        access_token = create_access_token(
            subject=row['id'],
            role=row.get('role', 'student'),
            expires_delta=timedelta(minutes=self.settings.ACCESS_TOKEN_EXPIRE_MINUTES),
            claims=token_claims,
        )
        return AuthResponse(
            user=self._to_user_response(row),
            token=TokenResponse(
                access_token=access_token,
                expires_in=self.settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            ),
            message=message,
        )

    def _resolve_email(self, identifier: str) -> str:
        if self.demo_mode:
            ident_lower = identifier.lower()
            for user in _demo_users.values():
                if user.get('email', '').lower() == ident_lower or user.get('username', '').lower() == ident_lower:
                    return user['email']
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid credentials')

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

    def _normalize_username(self, email: str, fallback: str = 'google_user') -> str:
        raw = (email.split('@')[0] if email and '@' in email else fallback).strip().lower()
        normalized = ''.join(char if char.isalnum() or char == '_' else '_' for char in raw).strip('_')
        return normalized or fallback

    def _build_demo_user_row(
        self,
        *,
        email: str,
        username: str,
        name: str,
        role: str = 'student',
        created_at: str | None = None,
    ) -> dict:
        now_iso = utc_now_iso()
        return {
            'id': str(uuid5(NAMESPACE_URL, f'neuroprep-demo:{email.lower()}:{role}')),
            'name': name,
            'email': email.lower(),
            'username': username.lower(),
            'role': role,
            'created_at': created_at or now_iso,
            'last_login': now_iso,
            'password_hash': None,
        }

    def _build_google_user_row(self, auth_user: object, role: str = 'student') -> dict:
        email = str(getattr(auth_user, 'email', '')).lower()
        metadata = getattr(auth_user, 'user_metadata', {}) or {}
        return {
            'id': str(getattr(auth_user, 'id', uuid4())),
            'name': metadata.get('full_name') or metadata.get('name') or 'Google User',
            'email': email,
            'username': self._normalize_username(email),
            'role': role,
            'created_at': utc_now_iso(),
            'last_login': utc_now_iso(),
            'password_hash': None,
        }

    def _resolve_google_user(self, auth_user: object, role: str = 'student') -> dict:
        email = str(getattr(auth_user, 'email', '')).lower()
        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='Google authentication did not return an email address',
            )

        lookup = self.client.table('users').select('*').eq('email', email).limit(1).execute()
        if lookup.data:
            user_row = lookup.data[0]
            now_iso = utc_now_iso()
            self.client.table('users').update({'last_login': now_iso}).eq('id', user_row['id']).execute()
            user_row['last_login'] = now_iso
            return user_row

        user_row = self._build_google_user_row(auth_user, role=role)
        inserted = self.client.table('users').insert(user_row).execute()
        if not inserted.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail='Failed to create Google user record',
            )
        return inserted.data[0]

    def _demo_register(self, payload: RegisterRequest) -> AuthResponse:
        row = self._build_demo_user_row(
            email=payload.email.lower(),
            username=payload.username.lower(),
            name=payload.name,
            role=payload.role,
        )
        return self._issue_auth_response(row, 'Registration successful.')

    def _demo_login(self, payload: LoginRequest) -> AuthResponse:
        identifier = payload.identifier.strip().lower()
        if not identifier:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid credentials')

        if '@' in identifier:
            email = identifier
            username = self._normalize_username(identifier)
        else:
            username = identifier
            email = f'{identifier}@demo.neuroprep.app'

        row = self._build_demo_user_row(
            email=email,
            username=username,
            name=username.replace('_', ' ').title(),
            role='student',
        )
        return self._issue_auth_response(row, 'Login successful')

    def _demo_google_auth(self, role: str = 'student') -> AuthResponse:
        normalized_role = role if role in {'student', 'teacher', 'admin'} else 'student'
        row = self._build_demo_user_row(
            email=f'google.{normalized_role}@demo.neuroprep.app',
            username=f'google_{normalized_role}',
            name=f'Google Demo {normalized_role.title()}',
            role=normalized_role,
        )
        return self._issue_auth_response(row, 'Google login successful')

    def register(self, payload: RegisterRequest) -> AuthResponse:
        if self.demo_mode:
            return self._demo_register(payload)

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

        return self._issue_auth_response(
            inserted.data[0],
            'Registration successful. Verify your email in Supabase Auth to activate full login.',
        )

    def login(self, payload: LoginRequest) -> AuthResponse:
        if self.demo_mode:
            return self._demo_login(payload)

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
            pass

        now_iso = utc_now_iso()
        self.client.table('users').update({'last_login': now_iso}).eq('id', user_row['id']).execute()
        user_row['last_login'] = now_iso

        return self._issue_auth_response(user_row, 'Login successful')

    def me(self, current_user: dict) -> UserResponse:
        return self._to_user_response(current_user)

    def update_profile(self, current_user: dict, payload: ProfileUpdateRequest) -> UserResponse:
        updates: dict[str, str] = {}
        if payload.name is not None:
            updates['name'] = payload.name.strip()
        if payload.username is not None:
            updates['username'] = payload.username.strip().lower()

        if not updates:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='Provide at least one field to update',
            )

        if 'username' in updates:
            next_username = updates['username']
            if self.demo_mode:
                duplicate = next(
                    (
                        user
                        for user in _demo_users.values()
                        if user['id'] != current_user['id'] and user.get('username') == next_username
                    ),
                    None,
                )
            else:
                duplicate_response = (
                    self.client.table('users').select('id').eq('username', next_username).limit(1).execute()
                )
                duplicate = (
                    duplicate_response.data[0]
                    if duplicate_response.data and duplicate_response.data[0]['id'] != current_user['id']
                    else None
                )
            if duplicate:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='Username already in use')

        if self.demo_mode:
            user_row = {**current_user, **updates}
            return self._to_user_response(user_row)

        updated_response = self.client.table('users').update(updates).eq('id', current_user['id']).execute()
        user_row = updated_response.data[0] if updated_response.data else {**current_user, **updates}
        return self._to_user_response(user_row)

    def request_password_reset(self, payload: PasswordResetRequest) -> MessageResponse:
        email = payload.email.lower()
        if self.demo_mode:
            return MessageResponse(
                message=f'Password reset instructions have been generated for {email} in demo mode.'
            )

        try:
            self.client.auth.reset_password_email(
                email,
                {'redirect_to': payload.redirect_to or 'http://127.0.0.1:5173/login'},
            )
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f'Unable to send password reset email: {exc}',
            ) from exc

        return MessageResponse(message=f'Password reset instructions sent to {email}.')

    def google_auth(self, payload: GoogleAuthRequest) -> AuthResponse | OAuthResponse:
        if self.demo_mode:
            return self._demo_google_auth(payload.role or 'student')

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

            user_row = self._resolve_google_user(auth_user, role=payload.role or 'student')
            return self._issue_auth_response(user_row, 'Google login successful')

        redirect_to = payload.redirect_to or 'http://127.0.0.1:5173/auth/callback'
        try:
            oauth_response = self.client.auth.sign_in_with_oauth(
                {
                    'provider': 'google',
                    'options': {
                        'redirect_to': redirect_to,
                        'query_params': {'access_type': 'offline', 'prompt': 'consent'},
                    },
                }
            )
            oauth_data = (
                oauth_response if isinstance(oauth_response, dict) else getattr(oauth_response, 'data', {})
            )
            oauth_url = getattr(oauth_response, 'url', None) or (
                oauth_data.get('url') if isinstance(oauth_data, dict) else None
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

    def google_exchange(self, payload: GoogleExchangeRequest) -> AuthResponse:
        if self.demo_mode:
            return self._demo_google_auth(payload.role or 'student')

        access_token = payload.access_token
        if payload.code:
            try:
                response = self.client.auth.exchange_code_for_session(
                    {
                        'auth_code': payload.code,
                        'redirect_to': payload.redirect_to or 'http://127.0.0.1:5173/auth/callback',
                    }
                )
                session = getattr(response, 'session', None)
                access_token = getattr(session, 'access_token', None) or access_token
            except Exception as exc:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f'Unable to exchange Google auth code: {exc}',
                ) from exc

        if not access_token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='Google exchange requires either an auth code or access token',
            )

        try:
            auth_user_response = self.client.auth.get_user(access_token)
            auth_user = getattr(auth_user_response, 'user', None) or auth_user_response
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f'Unable to fetch Google user session: {exc}',
            ) from exc

        user_row = self._resolve_google_user(auth_user, role=payload.role or 'student')
        return self._issue_auth_response(user_row, 'Google login successful')
