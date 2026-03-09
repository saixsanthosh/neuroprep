from __future__ import annotations

from fastapi import APIRouter, Depends, Path, Query

from app.auth.dependencies import get_current_user
from app.schemas.common import MessageResponse
from app.schemas.library import (
    DocumentInsightRequest,
    DocumentInsightResponse,
    FlashcardBulkCreateRequest,
    FlashcardResponse,
    NoteCreateRequest,
    NoteResponse,
    NoteUpdateRequest,
    RevisionDigestResponse,
)
from app.services.library_service import LibraryService

router = APIRouter(prefix='/library', tags=['Library'])
library_service = LibraryService()


@router.get('/notes', response_model=list[NoteResponse])
def list_notes(
    search: str | None = Query(default=None, max_length=100),
    limit: int = Query(default=50, ge=1, le=200),
    current_user: dict = Depends(get_current_user),
) -> list[NoteResponse]:
    return [NoteResponse(**item) for item in library_service.list_notes(current_user['id'], search=search, limit=limit)]


@router.post('/notes', response_model=NoteResponse)
def create_note(payload: NoteCreateRequest, current_user: dict = Depends(get_current_user)) -> NoteResponse:
    return NoteResponse(**library_service.create_note(current_user['id'], payload))


@router.put('/notes/{note_id}', response_model=NoteResponse)
def update_note(
    payload: NoteUpdateRequest,
    note_id: str = Path(...),
    current_user: dict = Depends(get_current_user),
) -> NoteResponse:
    return NoteResponse(**library_service.update_note(current_user['id'], note_id, payload))


@router.get('/flashcards', response_model=list[FlashcardResponse])
def list_flashcards(
    subject: str | None = Query(default=None, max_length=100),
    limit: int = Query(default=200, ge=1, le=300),
    current_user: dict = Depends(get_current_user),
) -> list[FlashcardResponse]:
    return [
        FlashcardResponse(**item)
        for item in library_service.list_flashcards(current_user['id'], subject=subject, limit=limit)
    ]


@router.post('/flashcards', response_model=list[FlashcardResponse])
def create_flashcards(
    payload: FlashcardBulkCreateRequest,
    current_user: dict = Depends(get_current_user),
) -> list[FlashcardResponse]:
    return [FlashcardResponse(**item) for item in library_service.create_flashcards(current_user['id'], payload)]


@router.delete('/flashcards/{flashcard_id}', response_model=MessageResponse)
def delete_flashcard(
    flashcard_id: str = Path(...),
    current_user: dict = Depends(get_current_user),
) -> MessageResponse:
    library_service.delete_flashcard(current_user['id'], flashcard_id)
    return MessageResponse(message='Flashcard deleted successfully')


@router.get('/revision', response_model=RevisionDigestResponse)
def revision_digest(current_user: dict = Depends(get_current_user)) -> RevisionDigestResponse:
    return RevisionDigestResponse(**library_service.revision_digest(current_user['id']))


@router.post('/document-insight', response_model=DocumentInsightResponse)
def document_insight(
    payload: DocumentInsightRequest,
    current_user: dict = Depends(get_current_user),
) -> DocumentInsightResponse:
    return DocumentInsightResponse(**library_service.document_insight(current_user['id'], payload))
