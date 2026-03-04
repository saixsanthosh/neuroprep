from fastapi import APIRouter, Depends, Request

from app.auth.dependencies import get_current_user
from app.core.rate_limit import limiter
from app.database.supabase_client import get_supabase_admin_client
from app.schemas.ai import (
    AIResponse,
    AnalyzeWeaknessRequest,
    ChatRequest,
    GenerateNotesRequest,
    GenerateQuizRequest,
    WeaknessAnalysisResponse,
)
from app.services.ai_service import AIService

router = APIRouter(prefix='/ai', tags=['AI Features'])
ai_service = AIService()
client = get_supabase_admin_client()


@router.post('/chat', response_model=AIResponse)
@limiter.limit('30/minute')
def ai_chat(
    request: Request,
    payload: ChatRequest,
    current_user: dict = Depends(get_current_user),
) -> AIResponse:
    del request, current_user
    content = ai_service.tutor_chat(payload.message, payload.context)
    return AIResponse(content=content)


@router.post('/generate-notes', response_model=AIResponse)
@limiter.limit('20/minute')
def generate_notes(
    request: Request,
    payload: GenerateNotesRequest,
    current_user: dict = Depends(get_current_user),
) -> AIResponse:
    del request, current_user
    content = ai_service.generate_notes(payload.topic, payload.level)
    return AIResponse(content=content)


@router.post('/generate-quiz')
@limiter.limit('20/minute')
def generate_quiz(
    request: Request,
    payload: GenerateQuizRequest,
    current_user: dict = Depends(get_current_user),
) -> dict:
    del request, current_user
    questions = ai_service.generate_quiz_questions(
        topic=payload.topic,
        subject=payload.subject,
        difficulty=payload.difficulty,
        count=payload.count,
    )
    return {
        'topic': payload.topic,
        'subject': payload.subject,
        'difficulty': payload.difficulty,
        'questions': questions,
    }


@router.post('/analyze-weakness', response_model=WeaknessAnalysisResponse)
@limiter.limit('20/minute')
def analyze_weakness(
    request: Request,
    payload: AnalyzeWeaknessRequest,
    current_user: dict = Depends(get_current_user),
) -> WeaknessAnalysisResponse:
    del request
    analysis = ai_service.analyze_weakness(
        subject=payload.subject,
        topic=payload.topic,
        quiz_scores=payload.quiz_scores,
        mock_scores=payload.mock_scores,
        time_per_question=payload.time_per_question,
    )

    client.table('weak_topics').insert(
        {
            'user_id': current_user['id'],
            'subject': payload.subject,
            'topic': payload.topic,
            'weakness_score': analysis['weakness_score'],
        }
    ).execute()

    return WeaknessAnalysisResponse(**analysis)
