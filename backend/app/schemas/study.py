from datetime import date as date_type
from pydantic import BaseModel, Field


class StudySessionCreate(BaseModel):
    subject: str = Field(min_length=2, max_length=100)
    duration: int = Field(gt=0, le=720)
    session_type: str = Field(pattern='^(study|break)$')
    date: date_type | None = None


class StudySessionResponse(BaseModel):
    id: str
    user_id: str
    subject: str
    duration: int
    session_type: str
    date: date_type


class StudyStatsResponse(BaseModel):
    today_hours: float
    weekly_hours: float
    study_streak: int
    productivity_score: int
