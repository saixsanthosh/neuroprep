from datetime import datetime

from pydantic import BaseModel, Field


class TaskCreate(BaseModel):
    title: str = Field(min_length=2, max_length=150)
    subject: str = Field(min_length=2, max_length=100)
    deadline: datetime
    status: str = Field(default='pending', pattern='^(pending|completed)$')


class TaskUpdate(BaseModel):
    id: str
    title: str | None = Field(default=None, min_length=2, max_length=150)
    subject: str | None = Field(default=None, min_length=2, max_length=100)
    deadline: datetime | None = None
    status: str | None = Field(default=None, pattern='^(pending|completed)$')


class TaskResponse(BaseModel):
    id: str
    user_id: str
    title: str
    subject: str
    deadline: datetime
    status: str
