from __future__ import annotations

import json
from uuid import uuid4

from fastapi import HTTPException, status

from app.core.config import get_settings
from app.database.supabase_client import get_supabase_admin_client
from app.schemas.community import CommunityPostCreateRequest, CommunityReplyCreateRequest
from app.services.demo_store import insert_row, list_rows, update_row
from app.services.helpers import utc_now_iso

POST_PREFIX = 'community::post::'
REPLY_PREFIX = 'community::reply::'


class CommunityService:
    def __init__(self):
        self.settings = get_settings()
        self.demo_mode = self.settings.DEMO_MODE
        self.client = None if self.demo_mode else get_supabase_admin_client()

    def list_posts(self, limit: int = 30) -> list[dict]:
        if self.demo_mode:
            posts = list_rows('community_posts', order_by='created_at', desc=True, limit=limit)
            replies = list_rows('community_replies', order_by='created_at', desc=False)
            grouped_replies = self._group_demo_replies(replies)
            return [self._attach_replies(post, grouped_replies.get(post['id'], [])) for post in posts]

        post_response = (
            self.client.table('notes')
            .select('*')
            .like('title', f'{POST_PREFIX}%')
            .order('created_at', desc=True)
            .limit(limit)
            .execute()
        )
        reply_response = (
            self.client.table('notes')
            .select('*')
            .like('title', f'{REPLY_PREFIX}%')
            .order('created_at', desc=False)
            .limit(200)
            .execute()
        )

        grouped_replies = {}
        for reply in reply_response.data:
            decoded = self._decode_reply(reply)
            grouped_replies.setdefault(decoded['post_id'], []).append(decoded['reply'])

        posts = []
        for row in post_response.data:
            decoded = self._decode_post(row)
            posts.append(self._attach_replies(decoded, grouped_replies.get(decoded['id'], [])))
        return posts

    def create_post(self, user: dict, payload: CommunityPostCreateRequest) -> dict:
        clean_tags = [tag.strip() for tag in payload.tags if tag.strip()][:6]
        record = {
            'user_id': user['id'],
            'title': payload.title.strip(),
            'body': payload.body.strip(),
            'topic': payload.topic.strip(),
            'tags': clean_tags,
            'upvotes': 0,
            'author_name': user.get('name') or user.get('username') or 'Learner',
            'created_at': utc_now_iso(),
        }

        if self.demo_mode:
            created = insert_row('community_posts', record)
            return {**created, 'replies': []}

        row = {
            'user_id': user['id'],
            'title': f"{POST_PREFIX}{payload.topic.strip()}::{payload.title.strip()}",
            'content': json.dumps(
                {
                    'body': payload.body.strip(),
                    'topic': payload.topic.strip(),
                    'tags': clean_tags,
                    'upvotes': 0,
                    'author_name': record['author_name'],
                }
            ),
        }
        response = self.client.table('notes').insert(row).execute()
        if not response.data:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='Failed to create post')
        return {**self._decode_post(response.data[0]), 'replies': []}

    def upvote_post(self, post_id: str) -> dict:
        if self.demo_mode:
            updated = update_row(
                'community_posts',
                predicate=lambda row: row['id'] == post_id,
                updates={
                    'upvotes': next(
                        (
                            row['upvotes'] + 1
                            for row in list_rows('community_posts', predicate=lambda candidate: candidate['id'] == post_id, limit=1)
                        ),
                        1,
                    )
                },
            )
            if not updated:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Post not found')
            return self._attach_replies(updated, [])

        response = self.client.table('notes').select('*').eq('id', post_id).limit(1).execute()
        row = response.data[0] if response.data else None
        if not row or not str(row.get('title', '')).startswith(POST_PREFIX):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Post not found')

        payload = self._decode_post(row)
        next_upvotes = int(payload['upvotes']) + 1
        updated_content = {
            'body': payload['body'],
            'topic': payload['topic'],
            'tags': payload['tags'],
            'upvotes': next_upvotes,
            'author_name': payload['author_name'],
        }
        update_response = (
            self.client.table('notes')
            .update({'content': json.dumps(updated_content)})
            .eq('id', post_id)
            .execute()
        )
        if not update_response.data:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='Failed to update post')
        return self._attach_replies(self._decode_post(update_response.data[0]), [])

    def reply_to_post(self, post_id: str, user: dict, payload: CommunityReplyCreateRequest) -> dict:
        reply = {
            'user_id': user['id'],
            'author_name': user.get('name') or user.get('username') or 'Learner',
            'body': payload.body.strip(),
            'created_at': utc_now_iso(),
        }
        if self.demo_mode:
            created = insert_row('community_replies', {**reply, 'post_id': post_id})
            return {
                'id': created['id'],
                'user_id': created['user_id'],
                'author_name': created['author_name'],
                'body': created['body'],
                'created_at': created['created_at'],
            }

        row = {
            'user_id': user['id'],
            'title': f'{REPLY_PREFIX}{post_id}::{uuid4()}',
            'content': json.dumps(
                {
                    'post_id': post_id,
                    'body': payload.body.strip(),
                    'author_name': reply['author_name'],
                }
            ),
        }
        response = self.client.table('notes').insert(row).execute()
        if not response.data:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='Failed to create reply')
        decoded = self._decode_reply(response.data[0])
        return decoded['reply']

    def _group_demo_replies(self, rows: list[dict]) -> dict[str, list[dict]]:
        grouped = {}
        for row in rows:
            grouped.setdefault(row['post_id'], []).append(
                {
                    'id': row['id'],
                    'user_id': row['user_id'],
                    'author_name': row['author_name'],
                    'body': row['body'],
                    'created_at': row['created_at'],
                }
            )
        return grouped

    def _attach_replies(self, post: dict, replies: list[dict]) -> dict:
        return {**post, 'replies': replies}

    def _decode_post(self, row: dict) -> dict:
        try:
            content = json.loads(row.get('content') or '{}')
        except json.JSONDecodeError:
            content = {}
        title_parts = str(row.get('title', '')).split('::', 3)
        fallback_topic = title_parts[2] if len(title_parts) > 2 else 'Study group'
        fallback_title = title_parts[3] if len(title_parts) > 3 else 'Community post'
        return {
            'id': row['id'],
            'user_id': row['user_id'],
            'title': fallback_title,
            'body': content.get('body', ''),
            'topic': content.get('topic', fallback_topic),
            'tags': content.get('tags', []),
            'upvotes': int(content.get('upvotes', 0)),
            'author_name': content.get('author_name', 'Learner'),
            'created_at': row['created_at'],
        }

    def _decode_reply(self, row: dict) -> dict:
        try:
            content = json.loads(row.get('content') or '{}')
        except json.JSONDecodeError:
            content = {}
        title_parts = str(row.get('title', '')).split('::', 3)
        post_id = content.get('post_id') or (title_parts[2] if len(title_parts) > 2 else '')
        return {
            'post_id': post_id,
            'reply': {
                'id': row['id'],
                'user_id': row['user_id'],
                'author_name': content.get('author_name', 'Learner'),
                'body': content.get('body', ''),
                'created_at': row['created_at'],
            },
        }
