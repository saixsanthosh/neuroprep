from uuid import uuid4

from app.core.config import get_settings
from app.database.supabase_client import get_supabase_admin_client
from app.schemas.mock import MockStartRequest, MockSubmitRequest
from app.services.demo_store import insert_row, list_rows


class MockService:
    def __init__(self):
        self.demo_mode = get_settings().DEMO_MODE
        self.client = None if self.demo_mode else get_supabase_admin_client()

    def start_mock(self, payload: MockStartRequest) -> dict:
        return {
            'session_id': str(uuid4()),
            'exam_type': payload.exam_type,
            'total_questions': payload.total_questions,
            'duration_minutes': payload.duration_minutes,
            'message': 'Mock test session started',
        }

    def submit_mock(self, user_id: str, payload: MockSubmitRequest) -> dict:
        accuracy = round((payload.correct_answers / payload.total_questions) * 100, 2)
        row = {
            'user_id': user_id,
            'exam_type': payload.exam_type,
            'score': payload.score,
            'rank': payload.rank,
            'time_taken': payload.time_taken,
            'accuracy': accuracy,
        }
        if self.demo_mode:
            return insert_row('mock_test_results', row, with_created_at=True)
        response = self.client.table('mock_test_results').insert(row).execute()
        return response.data[0]

    def results(self, user_id: str, limit: int = 100) -> list[dict]:
        if self.demo_mode:
            return list_rows(
                'mock_test_results',
                predicate=lambda row: row['user_id'] == user_id,
                order_by='created_at',
                desc=True,
                limit=limit,
            )
        response = (
            self.client.table('mock_test_results')
            .select('*')
            .eq('user_id', user_id)
            .order('created_at', desc=True)
            .limit(limit)
            .execute()
        )
        return response.data or []
