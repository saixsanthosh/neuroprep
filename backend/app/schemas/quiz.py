from datetime import datetime
from pydantic import BaseModel, Field


class QuizStartRequest(BaseModel):
    subject: str = Field(min_length=2, max_length=100)
    topic: str = Field(min_length=2, max_length=120)
    difficulty: str = Field(default='medium', pattern='^(easy|medium|hard)$')
    question_count: int = Field(default=5, ge=3, le=20)


class QuizStartResponse(BaseModel):
    quiz_id: str
    subject: str
    topic: str
    questions: list[str]


class QuizSubmitRequest(BaseModel):
    subject: str = Field(min_length=2, max_length=100)
    score: float = Field(ge=0)
    total_questions: int = Field(ge=1)
    time_taken: int = Field(gt=0)


class QuizResultResponse(BaseModel):
    id: str
    user_id: str
    subject: str
    score: float
    total_questions: int
    accuracy: float
    time_taken: int
    created_at: datetime
