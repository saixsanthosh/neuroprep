from collections import defaultdict
from datetime import date, datetime, timedelta

from app.core.config import get_settings
from app.database.supabase_client import get_supabase_admin_client
from app.schemas.study import StudySessionCreate, StudyStatsResponse
from app.services.demo_store import insert_row, list_rows
from app.services.helpers import to_iso_date


class StudyService:
    def __init__(self):
        self.demo_mode = get_settings().DEMO_MODE
        self.client = None if self.demo_mode else get_supabase_admin_client()

    def create_session(self, user_id: str, payload: StudySessionCreate) -> dict:
        row = {
            'user_id': user_id,
            'subject': payload.subject,
            'duration': payload.duration,
            'session_type': payload.session_type,
            'date': to_iso_date(payload.date),
        }
        if self.demo_mode:
            return insert_row('study_sessions', row)
        response = self.client.table('study_sessions').insert(row).execute()
        return response.data[0]

    def get_history(self, user_id: str, limit: int = 200) -> list[dict]:
        if self.demo_mode:
            return list_rows(
                'study_sessions',
                predicate=lambda row: row['user_id'] == user_id,
                order_by='date',
                desc=True,
                limit=limit,
            )
        response = (
            self.client.table('study_sessions')
            .select('*')
            .eq('user_id', user_id)
            .order('date', desc=True)
            .limit(limit)
            .execute()
        )
        return response.data or []

    def get_stats(self, user_id: str) -> StudyStatsResponse:
        sessions = self.get_history(user_id=user_id, limit=1000)

        if not sessions:
            return StudyStatsResponse(today_hours=0.0, weekly_hours=0.0, study_streak=0, productivity_score=0)

        today = date.today()
        week_start = today - timedelta(days=6)

        today_minutes = 0
        weekly_minutes = 0
        study_days = defaultdict(int)
        study_minutes = 0
        break_minutes = 0

        for session in sessions:
            session_date = date.fromisoformat(str(session['date']))
            duration = int(session['duration'])
            session_type = session.get('session_type', 'study')

            if session_date == today and session_type == 'study':
                today_minutes += duration

            if session_date >= week_start and session_type == 'study':
                weekly_minutes += duration

            if session_type == 'study':
                study_days[session_date] += duration
                study_minutes += duration
            elif session_type == 'break':
                break_minutes += duration

        streak = 0
        cursor = today
        while cursor in study_days:
            streak += 1
            cursor -= timedelta(days=1)

        productivity = 0
        if study_minutes > 0:
            ratio = study_minutes / max(study_minutes + break_minutes, 1)
            productivity = min(100, int(ratio * 100))

        return StudyStatsResponse(
            today_hours=round(today_minutes / 60, 2),
            weekly_hours=round(weekly_minutes / 60, 2),
            study_streak=streak,
            productivity_score=productivity,
        )
