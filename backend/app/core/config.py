import json
from functools import lru_cache
from pathlib import Path
from typing import Annotated, List

from pydantic import field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=BASE_DIR / '.env', env_file_encoding='utf-8', extra='ignore')

    PROJECT_NAME: str = 'NeuroPrep API'
    API_V1_PREFIX: str = ''
    ENVIRONMENT: str = 'development'
    DEMO_MODE: bool = False

    SUPABASE_URL: str = 'https://placeholder.supabase.co'
    SUPABASE_ANON_KEY: str = 'placeholder'
    SUPABASE_SERVICE_ROLE_KEY: str = 'placeholder'

    JWT_SECRET_KEY: str = 'neuroprep-demo-secret-change-in-production'
    JWT_ALGORITHM: str = 'HS256'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    GEMINI_API_KEY: str | None = None
    CORS_ORIGINS: Annotated[List[str], NoDecode] = [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:4173',
        'http://127.0.0.1:4173',
    ]

    @field_validator('CORS_ORIGINS', mode='before')
    @classmethod
    def parse_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, str):
            value = value.strip()
            if value.startswith('['):
                try:
                    parsed = json.loads(value)
                except json.JSONDecodeError:
                    parsed = None
                if isinstance(parsed, list):
                    return [str(origin).strip() for origin in parsed if str(origin).strip()]
            return [origin.strip() for origin in value.split(',') if origin.strip()]
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()
