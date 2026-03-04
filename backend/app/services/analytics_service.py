from collections import defaultdict
from datetime import date, timedelta

from app.database.supabase_client import get_supabase_admin_client


class AnalyticsService:
    def __init__(self):
        self.client = get_supabase_admin_client()

    def study_hours(self, user_id: str) -> dict:
        response = (
            self.client.table('study_sessions')
            .select('date, duration, session_type')
            .eq('user_id', user_id)
            .order('date', desc=False)
            .limit(1000)
            .execute()
        )

        daily_minutes = defaultdict(int)
        for row in response.data or []:
            if row.get('session_type') != 'study':
                continue
            daily_minutes[row['date']] += int(row['duration'])

        last_7_days = [date.today() - timedelta(days=index) for index in range(6, -1, -1)]
        daily = []
        weekly_total = 0.0

        for day in last_7_days:
            hours = round(daily_minutes.get(day.isoformat(), 0) / 60, 2)
            daily.append({'date': day.isoformat(), 'hours': hours})
            weekly_total += hours

        return {'daily': daily, 'weekly_total': round(weekly_total, 2)}

    def performance(self, user_id: str) -> dict:
        quiz_response = (
            self.client.table('quiz_results')
            .select('subject, accuracy, created_at')
            .eq('user_id', user_id)
            .order('created_at', desc=False)
            .limit(300)
            .execute()
        )

        mock_response = (
            self.client.table('mock_test_results')
            .select('exam_type, score')
            .eq('user_id', user_id)
            .order('created_at', desc=False)
            .limit(100)
            .execute()
        )

        subject_buckets = defaultdict(list)
        accuracy_trend = []

        for row in quiz_response.data or []:
            subject_buckets[row['subject']].append(float(row['accuracy']))
            accuracy_trend.append(
                {
                    'label': row['created_at'][:10],
                    'value': float(row['accuracy']),
                }
            )

        subject_performance = [
            {'label': subject, 'value': round(sum(values) / len(values), 2)}
            for subject, values in subject_buckets.items()
        ]

        mock_performance = [
            {'label': row['exam_type'], 'value': float(row['score'])}
            for row in (mock_response.data or [])
        ]

        return {
            'subject_performance': subject_performance,
            'accuracy_trend': accuracy_trend[-12:],
            'mock_performance': mock_performance[-12:],
        }

    def weak_topics(self, user_id: str, limit: int = 20) -> list[dict]:
        response = (
            self.client.table('weak_topics')
            .select('subject, topic, weakness_score')
            .eq('user_id', user_id)
            .order('weakness_score', desc=True)
            .limit(limit)
            .execute()
        )

        return response.data or []
