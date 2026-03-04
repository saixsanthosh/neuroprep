from datetime import datetime

from pydantic import BaseModel, Field


class GameScoreCreate(BaseModel):
    game_name: str = Field(min_length=2, max_length=80)
    score: int = Field(ge=0)


class GameScoreResponse(BaseModel):
    id: str
    user_id: str
    game_name: str
    score: int
    created_at: datetime


class LeaderboardEntry(BaseModel):
    user_id: str
    username: str
    score: int
