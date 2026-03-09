from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class NoteCreateRequest(BaseModel):
    title: str = Field(min_length=2, max_length=180)
    content: str = Field(min_length=5)


class NoteUpdateRequest(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=180)
    content: str | None = Field(default=None, min_length=5)


class NoteResponse(BaseModel):
    id: str
    user_id: str
    title: str
    content: str
    created_at: datetime
    updated_at: datetime


class FlashcardCreateRequest(BaseModel):
    question: str = Field(min_length=2, max_length=240)
    answer: str = Field(min_length=1, max_length=400)
    subject: str = Field(min_length=2, max_length=100)
    difficulty: str = Field(default='medium', pattern='^(easy|medium|hard)$')


class FlashcardBulkCreateRequest(BaseModel):
    cards: list[FlashcardCreateRequest] = Field(min_length=1, max_length=100)


class FlashcardResponse(BaseModel):
    id: str
    user_id: str
    question: str
    answer: str
    subject: str
    difficulty: str


class RevisionActionResponse(BaseModel):
    title: str
    description: str
    route: str


class RevisionDigestResponse(BaseModel):
    weak_topics: list[dict]
    flashcards: list[FlashcardResponse]
    recent_notes: list[NoteResponse]
    action_plan: list[RevisionActionResponse]


class DocumentInsightRequest(BaseModel):
    title: str = Field(min_length=2, max_length=180)
    text: str = Field(min_length=20)
    subject: str | None = Field(default=None, max_length=100)
    save_note: bool = False


class DocumentInsightResponse(BaseModel):
    summary: str
    key_points: list[str]
    quiz_prompts: list[str]
    study_actions: list[str]
    saved_note: NoteResponse | None = None
