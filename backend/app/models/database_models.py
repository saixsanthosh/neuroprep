"""Pydantic table models used for typed service responses.

Supabase remains the persistence layer; SQL migrations define the source-of-truth schema.
"""

from datetime import date, datetime

from pydantic import BaseModel


class UserModel(BaseModel):
    id: str
    name: str
    email: str
    username: str
    created_at: datetime
    last_login: datetime | None = None


class StudySessionModel(BaseModel):
    id: str
    user_id: str
    subject: str
    duration: int
    session_type: str
    date: date


class StudyTaskModel(BaseModel):
    id: str
    user_id: str
    title: str
    subject: str
    deadline: datetime
    status: str


class QuizResultModel(BaseModel):
    id: str
    user_id: str
    subject: str
    score: float
    total_questions: int
    accuracy: float
    time_taken: int
    created_at: datetime


class MockTestResultModel(BaseModel):
    id: str
    user_id: str
    exam_type: str
    score: float
    rank: int
    time_taken: int
    accuracy: float
    created_at: datetime


class FlashcardModel(BaseModel):
    id: str
    user_id: str
    question: str
    answer: str
    subject: str
    difficulty: str


class NoteModel(BaseModel):
    id: str
    user_id: str
    title: str
    content: str
    created_at: datetime
    updated_at: datetime


class WeakTopicModel(BaseModel):
    id: str
    user_id: str
    subject: str
    topic: str
    weakness_score: float


class StudyPlanModel(BaseModel):
    id: str
    user_id: str
    exam_name: str
    daily_hours: float
    exam_date: date


class AchievementModel(BaseModel):
    id: str
    user_id: str
    badge_name: str
    unlocked_at: datetime


class GameScoreModel(BaseModel):
    id: str
    user_id: str
    game_name: str
    score: int
    created_at: datetime
