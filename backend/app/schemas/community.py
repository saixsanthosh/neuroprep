from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class CommunityReplyCreateRequest(BaseModel):
    body: str = Field(min_length=2, max_length=1200)


class CommunityPostCreateRequest(BaseModel):
    title: str = Field(min_length=4, max_length=180)
    body: str = Field(min_length=4, max_length=2400)
    topic: str = Field(min_length=2, max_length=100)
    tags: list[str] = Field(default_factory=list, max_length=6)


class CommunityReplyResponse(BaseModel):
    id: str
    user_id: str
    author_name: str
    body: str
    created_at: datetime


class CommunityPostResponse(BaseModel):
    id: str
    user_id: str
    title: str
    body: str
    topic: str
    tags: list[str]
    upvotes: int
    author_name: str
    created_at: datetime
    replies: list[CommunityReplyResponse]
