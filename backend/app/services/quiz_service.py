from uuid import uuid4

from app.database.supabase_client import get_supabase_admin_client
from app.schemas.quiz import QuizStartRequest, QuizSubmitRequest
from app.services.ai_service import AIService


class QuizService:
    def __init__(self):
        self.client = get_supabase_admin_client()
        self.ai_service = AIService()

    def start_quiz(self, payload: QuizStartRequest) -> dict:
        questions = self.ai_service.generate_quiz_questions(
            topic=payload.topic,
            subject=payload.subject,
            difficulty=payload.difficulty,
            count=payload.question_count,
        )

        return {
            'quiz_id': str(uuid4()),
            'subject': payload.subject,
            'topic': payload.topic,
            'questions': questions,
        }

    def submit_quiz(self, user_id: str, payload: QuizSubmitRequest) -> dict:
        accuracy = round((payload.score / payload.total_questions) * 100, 2)
        row = {
            'user_id': user_id,
            'subject': payload.subject,
            'score': payload.score,
            'total_questions': payload.total_questions,
            'accuracy': accuracy,
            'time_taken': payload.time_taken,
        }
        response = self.client.table('quiz_results').insert(row).execute()
        return response.data[0]

    def history(self, user_id: str, limit: int = 100) -> list[dict]:
        response = (
            self.client.table('quiz_results')
            .select('*')
            .eq('user_id', user_id)
            .order('created_at', desc=True)
            .limit(limit)
            .execute()
        )
        return response.data or []
