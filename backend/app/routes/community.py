from __future__ import annotations

from fastapi import APIRouter, Depends, Path, Query

from app.auth.dependencies import get_current_user
from app.schemas.community import (
    CommunityPostCreateRequest,
    CommunityPostResponse,
    CommunityReplyCreateRequest,
    CommunityReplyResponse,
)
from app.services.community_service import CommunityService

router = APIRouter(prefix='/community', tags=['Community'])
community_service = CommunityService()


@router.get('/posts', response_model=list[CommunityPostResponse])
def list_posts(limit: int = Query(default=30, ge=1, le=100)) -> list[CommunityPostResponse]:
    return [CommunityPostResponse(**item) for item in community_service.list_posts(limit=limit)]


@router.post('/posts', response_model=CommunityPostResponse)
def create_post(
    payload: CommunityPostCreateRequest,
    current_user: dict = Depends(get_current_user),
) -> CommunityPostResponse:
    return CommunityPostResponse(**community_service.create_post(current_user, payload))


@router.post('/posts/{post_id}/upvote', response_model=CommunityPostResponse)
def upvote_post(post_id: str = Path(...), current_user: dict = Depends(get_current_user)) -> CommunityPostResponse:
    del current_user
    return CommunityPostResponse(**community_service.upvote_post(post_id))


@router.post('/posts/{post_id}/reply', response_model=CommunityReplyResponse)
def reply_to_post(
    payload: CommunityReplyCreateRequest,
    post_id: str = Path(...),
    current_user: dict = Depends(get_current_user),
) -> CommunityReplyResponse:
    return CommunityReplyResponse(**community_service.reply_to_post(post_id, current_user, payload))
