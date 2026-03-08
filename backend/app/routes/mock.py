from fastapi import APIRouter, Depends, Query

from app.auth.dependencies import get_current_user
from app.schemas.mock import MockResultResponse, MockStartRequest, MockStartResponse, MockSubmitRequest
from app.services.gamification_service import GamificationService
from app.services.mock_service import MockService

router = APIRouter(prefix='/mock', tags=['Mock Tests'])
mock_service = MockService()
gamification_service = GamificationService()


@router.post('/start', response_model=MockStartResponse)
def start_mock(payload: MockStartRequest, current_user: dict = Depends(get_current_user)) -> MockStartResponse:
    del current_user
    return MockStartResponse(**mock_service.start_mock(payload))


@router.post('/submit', response_model=MockResultResponse)
def submit_mock(payload: MockSubmitRequest, current_user: dict = Depends(get_current_user)) -> MockResultResponse:
    result = mock_service.submit_mock(current_user['id'], payload)
    gamification_service.record_event(
        current_user['id'],
        current_user['username'],
        'mock_submitted',
        metadata={
            'subject': payload.exam_type,
            'total_questions': payload.total_questions,
            'accuracy': result['accuracy'],
        },
    )
    return MockResultResponse(**result)


@router.get('/results', response_model=list[MockResultResponse])
def get_mock_results(
    limit: int = Query(default=100, ge=1, le=500),
    current_user: dict = Depends(get_current_user),
) -> list[MockResultResponse]:
    data = mock_service.results(current_user['id'], limit=limit)
    return [MockResultResponse(**item) for item in data]
