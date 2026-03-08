from __future__ import annotations

from pydantic import BaseModel


class SkillProgressNodeResponse(BaseModel):
    label: str
    mastery: int
    momentum: str


class CompanionBriefResponse(BaseModel):
    greeting: str
    mentor_message: str
    strategy_tip: str
    mistake_pattern: str
    readiness_score: int
    motivation_message: str
    next_focus: str
    daily_brief: list[str]
    smart_suggestions: list[str]
    revision_alerts: list[str]
    roadmap: list[str]
    skill_progress_map: list[SkillProgressNodeResponse]
    voice_tools: dict[str, bool]
