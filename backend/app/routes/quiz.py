from fastapi import APIRouter, Depends, Query

from app.auth.dependencies import get_current_user
from app.schemas.quiz import QuizResultResponse, QuizStartRequest, QuizStartResponse, QuizSubmitRequest
from app.services.gamification_service import GamificationService
from app.services.quiz_service import QuizService

router = APIRouter(prefix='/quiz', tags=['Quizzes'])
quiz_service = QuizService()
gamification_service = GamificationService()


@router.post('/start', response_model=QuizStartResponse)
def start_quiz(payload: QuizStartRequest, current_user: dict = Depends(get_current_user)) -> QuizStartResponse:
    del current_user
    return QuizStartResponse(**quiz_service.start_quiz(payload))


@router.post('/submit', response_model=QuizResultResponse)
def submit_quiz(payload: QuizSubmitRequest, current_user: dict = Depends(get_current_user)) -> QuizResultResponse:
    result = quiz_service.submit_quiz(current_user['id'], payload)
    gamification_service.record_event(
        current_user['id'],
        current_user['username'],
        'quiz_submitted',
        metadata={
            'subject': payload.subject,
            'total_questions': payload.total_questions,
            'accuracy': result['accuracy'],
        },
    )
    return QuizResultResponse(**result)


@router.get('/history', response_model=list[QuizResultResponse])
def quiz_history(
    limit: int = Query(default=100, ge=1, le=500),
    current_user: dict = Depends(get_current_user),
) -> list[QuizResultResponse]:
    data = quiz_service.history(current_user['id'], limit=limit)
    return [QuizResultResponse(**item) for item in data]
