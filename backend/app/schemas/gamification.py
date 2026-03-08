from __future__ import annotations

from datetime import date, datetime
from typing import Any

from pydantic import BaseModel, Field


class GamificationEventRequest(BaseModel):
    event_type: str = Field(min_length=2, max_length=80)
    count: int = Field(default=1, ge=1, le=500)
    subject: str | None = Field(default=None, max_length=120)
    topic: str | None = Field(default=None, max_length=120)
    metadata: dict[str, Any] = Field(default_factory=dict)


class GamificationProfileResponse(BaseModel):
    user_id: str
    xp: int
    level: int
    level_title: str
    xp_to_next_level: int
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


class DailyChallengeResponse(BaseModel):
    id: str
    challenge_date: date
    challenge_type: str
    title: str
    description: str
    target_count: int
    progress_count: int
    reward_xp: int
    reward_claimed: bool
    completed_at: datetime | None = None


class StudyMissionResponse(BaseModel):
    id: str
    mission_type: str
    title: str
    description: str
    target_count: int
    progress_count: int
    reward_xp: int
    badge_name: str | None = None
    status: str
    completed_at: datetime | None = None


class AchievementResponse(BaseModel):
    id: str
    badge_name: str
    unlocked_at: datetime


class LeaderboardEntryResponse(BaseModel):
    rank: int
    user_id: str
    username: str
    xp: int
    level: int
    streak: int


class MasteryTrackResponse(BaseModel):
    label: str
    progress: int


class GamificationSummaryResponse(BaseModel):
    profile: GamificationProfileResponse
    reminder_message: str
    encouragement_message: str
    active_challenges: list[DailyChallengeResponse]
    active_mission: StudyMissionResponse | None = None
    achievements: list[AchievementResponse]
    leaderboard_preview: list[LeaderboardEntryResponse]
    mastery_tracks: list[MasteryTrackResponse]

