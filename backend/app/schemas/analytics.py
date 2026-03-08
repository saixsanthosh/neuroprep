from pydantic import BaseModel


class StudyHoursPoint(BaseModel):
    date: str
    hours: float


class StudyHoursResponse(BaseModel):
    daily: list[StudyHoursPoint]
    weekly_total: float


class PerformanceSeries(BaseModel):
    label: str
    value: float


class PerformanceResponse(BaseModel):
    subject_performance: list[PerformanceSeries]
    accuracy_trend: list[PerformanceSeries]
    mock_performance: list[PerformanceSeries]


class WeakTopicResponse(BaseModel):
    subject: str
    topic: str
    weakness_score: float


class WeeklyReportResponse(BaseModel):
    summary: str
    generated_at: str
    focus_subjects: list[str]
