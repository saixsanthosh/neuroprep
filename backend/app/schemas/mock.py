from datetime import datetime

from pydantic import BaseModel, Field


class MockStartRequest(BaseModel):
    exam_type: str = Field(min_length=2, max_length=80)
    total_questions: int = Field(default=90, ge=10, le=300)
    duration_minutes: int = Field(default=180, ge=15, le=360)


class MockStartResponse(BaseModel):
    session_id: str
    exam_type: str
    total_questions: int
    duration_minutes: int
    message: str


class MockSubmitRequest(BaseModel):
    exam_type: str = Field(min_length=2, max_length=80)
    score: float = Field(ge=0)
    rank: int = Field(ge=1)
    time_taken: int = Field(gt=0)
    total_questions: int = Field(ge=1)
    correct_answers: int = Field(ge=0)


class MockResultResponse(BaseModel):
    id: str
    user_id: str
    exam_type: str
    score: float
    rank: int
    time_taken: int
    accuracy: float
    created_at: datetime
