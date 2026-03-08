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


class LearningProfileModel(BaseModel):
    user_id: str
    goal_type: str
    exam_name: str | None = None
    school_grade: int | None = None
    degree_type: str | None = None
    major_subject: str | None = None
    subjects: list[str]
    language: str | None = None
    skill_track: str | None = None
    skill_level: str | None = None
    study_hours: float
    onboarding_completed: bool = True
    focus_modules: list[str]
    preferences: dict
    created_at: datetime
    updated_at: datetime


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


class GamificationProfileModel(BaseModel):
    user_id: str
    xp: int
    level: int
    level_title: str
    current_streak: int
    longest_streak: int
    streak_freezes: int
    last_activity_date: date | None = None
    lessons_completed: int
    flashcards_reviewed: int
    quizzes_completed: int
    mock_tests_completed: int
    questions_solved: int
    last_reward_message: str | None = None
    created_at: datetime
    updated_at: datetime


class DailyChallengeModel(BaseModel):
    id: str
    user_id: str
    challenge_date: date
    challenge_type: str
    title: str
    description: str
    target_count: int
    progress_count: int
    reward_xp: int
    reward_claimed: bool
    completed_at: datetime | None = None
    created_at: datetime


class StudyMissionModel(BaseModel):
    id: str
    user_id: str
    mission_type: str
    title: str
    description: str
    target_count: int
    progress_count: int
    reward_xp: int
    badge_name: str | None = None
    status: str
    created_at: datetime
    completed_at: datetime | None = None
