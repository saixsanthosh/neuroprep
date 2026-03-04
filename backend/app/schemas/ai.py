from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    context: str | None = Field(default=None, max_length=6000)


class GenerateNotesRequest(BaseModel):
    topic: str = Field(min_length=2, max_length=160)
    level: str = Field(default='intermediate', pattern='^(beginner|intermediate|advanced)$')


class GenerateQuizRequest(BaseModel):
    topic: str = Field(min_length=2, max_length=160)
    subject: str = Field(min_length=2, max_length=120)
    difficulty: str = Field(default='medium', pattern='^(easy|medium|hard)$')
    count: int = Field(default=5, ge=3, le=20)


class AnalyzeWeaknessRequest(BaseModel):
    subject: str = Field(min_length=2, max_length=120)
    topic: str = Field(min_length=2, max_length=160)
    quiz_scores: list[float] = Field(default_factory=list)
    mock_scores: list[float] = Field(default_factory=list)
    time_per_question: list[float] = Field(default_factory=list)


class AIResponse(BaseModel):
    content: str
    sources: list[str] = Field(default_factory=list)


class WeaknessAnalysisResponse(BaseModel):
    weakness_score: float
    recommendation: str
    focus_areas: list[str]
