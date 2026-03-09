from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


GOAL_PATTERN = (
    '^(school_learning|college_courses|competitive_exams|language_learning|skill_learning|general_knowledge)$'
)
LEVEL_PATTERN = '^(beginner|intermediate|advanced)$'


class OnboardingOption(BaseModel):
    value: str
    label: str
    description: str


class OnboardingOptionsResponse(BaseModel):
    goals: list[OnboardingOption]
    competitive_exams: list[str]
    school_subjects: list[str]
    college_majors: list[str]
    skill_tracks: list[str]
    languages: list[str]
    skill_levels: list[str]


class LearningProfileUpsertRequest(BaseModel):
    goal_type: str = Field(pattern=GOAL_PATTERN)
    exam_name: str | None = Field(default=None, max_length=120)
    school_grade: int | None = Field(default=None, ge=6, le=12)
    degree_type: str | None = Field(default=None, max_length=120)
    major_subject: str | None = Field(default=None, max_length=120)
    subjects: list[str] = Field(default_factory=list, max_length=12)
    language: str | None = Field(default=None, max_length=120)
    skill_track: str | None = Field(default=None, max_length=120)
    skill_level: str | None = Field(default=None, pattern=LEVEL_PATTERN)
    study_hours: float = Field(ge=0.5, le=16)
    preferences: dict[str, Any] = Field(default_factory=dict)


class LearningProfileResponse(BaseModel):
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
    preferences: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime | None = None
    updated_at: datetime | None = None


class DashboardModuleResponse(BaseModel):
    id: str
    title: str
    description: str
    route: str
    accent: str
    category: str


class LearningDashboardResponse(BaseModel):
    profile: LearningProfileResponse
    hero_title: str
    hero_subtitle: str
    focus_tracks: list[str]
    modules: list[DashboardModuleResponse]


class LearningResourceResponse(BaseModel):
    source: str
    title: str
    description: str
    url: str
    category: str


class LearningResourcesResult(BaseModel):
    query: str
    source_strategy: str
    resources: list[LearningResourceResponse]
    generated_notes: str | None = None


class LanguageLessonResponse(BaseModel):
    id: str
    lesson_type: str
    title: str
    description: str
    duration_minutes: int
    difficulty: str


class LanguageRoadmapStepResponse(BaseModel):
    day: str
    title: str
    objective: str


class LanguageResourceLinkResponse(BaseModel):
    source: str
    title: str
    description: str
    url: str


class LanguagePathResponse(BaseModel):
    language: str
    skill_level: str
    speech_stack: dict[str, bool]
    lessons: list[LanguageLessonResponse]
    roadmap: list[LanguageRoadmapStepResponse] = Field(default_factory=list)
    survival_pack: list[str] = Field(default_factory=list)
    resource_links: list[LanguageResourceLinkResponse] = Field(default_factory=list)
