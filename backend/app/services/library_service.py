from __future__ import annotations

from datetime import datetime

from fastapi import HTTPException, status

from app.core.config import get_settings
from app.database.supabase_client import get_supabase_admin_client
from app.schemas.library import DocumentInsightRequest, FlashcardBulkCreateRequest, NoteCreateRequest, NoteUpdateRequest
from app.services.ai_service import AIService
from app.services.demo_store import delete_row, insert_row, list_rows, update_row
from app.services.helpers import utc_now_iso


def _is_workspace_note(title: str | None) -> bool:
    return bool(title and not title.startswith('community::'))


class LibraryService:
    def __init__(self):
        self.settings = get_settings()
        self.demo_mode = self.settings.DEMO_MODE
        self.client = None if self.demo_mode else get_supabase_admin_client()
        self.ai = AIService()

    def list_notes(self, user_id: str, search: str | None = None, limit: int = 50) -> list[dict]:
        if self.demo_mode:
            rows = list_rows(
                'notes',
                predicate=lambda row: row['user_id'] == user_id and _is_workspace_note(row.get('title')),
                order_by='updated_at',
                desc=True,
                limit=limit,
            )
        else:
            response = (
                self.client.table('notes')
                .select('*')
                .eq('user_id', user_id)
                .order('updated_at', desc=True)
                .limit(limit)
                .execute()
            )
            rows = [row for row in response.data if _is_workspace_note(row.get('title'))]

        if search:
            query = search.lower().strip()
            rows = [
                row
                for row in rows
                if query in row.get('title', '').lower() or query in row.get('content', '').lower()
            ]
        return rows

    def create_note(self, user_id: str, payload: NoteCreateRequest) -> dict:
        row = {'user_id': user_id, 'title': payload.title.strip(), 'content': payload.content.strip()}
        if self.demo_mode:
            created = insert_row('notes', {**row, 'updated_at': utc_now_iso()}, with_created_at=True)
            created.setdefault('updated_at', created['created_at'])
            return created

        response = self.client.table('notes').insert(row).execute()
        if not response.data:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='Failed to create note')
        return response.data[0]

    def update_note(self, user_id: str, note_id: str, payload: NoteUpdateRequest) -> dict:
        updates = {}
        if payload.title is not None:
            updates['title'] = payload.title.strip()
        if payload.content is not None:
            updates['content'] = payload.content.strip()
        if not updates:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='No note fields provided')

        if self.demo_mode:
            updated = update_row(
                'notes',
                predicate=lambda row: row['id'] == note_id and row['user_id'] == user_id,
                updates={**updates, 'updated_at': utc_now_iso()},
            )
            if not updated:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Note not found')
            return updated

        response = (
            self.client.table('notes')
            .update(updates)
            .eq('id', note_id)
            .eq('user_id', user_id)
            .execute()
        )
        if not response.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Note not found')
        return response.data[0]

    def list_flashcards(self, user_id: str, subject: str | None = None, limit: int = 200) -> list[dict]:
        if self.demo_mode:
            return list_rows(
                'flashcards',
                predicate=lambda row: row['user_id'] == user_id
                and (subject is None or row['subject'].lower() == subject.lower()),
                order_by='id',
                desc=True,
                limit=limit,
            )

        query = self.client.table('flashcards').select('*').eq('user_id', user_id)
        if subject:
            query = query.eq('subject', subject)
        response = query.limit(limit).execute()
        return response.data

    def create_flashcards(self, user_id: str, payload: FlashcardBulkCreateRequest) -> list[dict]:
        rows = [
            {
                'user_id': user_id,
                'question': card.question.strip(),
                'answer': card.answer.strip(),
                'subject': card.subject.strip(),
                'difficulty': card.difficulty,
            }
            for card in payload.cards
        ]

        if self.demo_mode:
            return [insert_row('flashcards', row) for row in rows]

        response = self.client.table('flashcards').insert(rows).execute()
        return response.data or []

    def delete_flashcard(self, user_id: str, flashcard_id: str) -> None:
        if self.demo_mode:
            deleted = delete_row(
                'flashcards',
                predicate=lambda row: row['id'] == flashcard_id and row['user_id'] == user_id,
            )
            if not deleted:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Flashcard not found')
            return

        response = (
            self.client.table('flashcards').delete().eq('id', flashcard_id).eq('user_id', user_id).execute()
        )
        if not response.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Flashcard not found')

    def revision_digest(self, user_id: str) -> dict:
        weak_topics = self._weak_topics(user_id)[:5]
        flashcards = self.list_flashcards(user_id, limit=8)[:8]
        notes = self.list_notes(user_id, limit=4)[:4]
        next_topic = weak_topics[0]['topic'] if weak_topics else 'core concepts'
        next_subject = weak_topics[0]['subject'] if weak_topics else 'your active track'
        actions = [
            {
                'title': f'Repair {next_topic}',
                'description': f'Run a short focused revision block on {next_subject} and close the weakest gap first.',
                'route': '/dashboard/analytics',
            },
            {
                'title': 'Review flashcards',
                'description': 'Use active recall on your saved deck before attempting the next practice set.',
                'route': '/dashboard/flashcards',
            },
            {
                'title': 'Generate a fresh quiz',
                'description': 'Convert revision into verification with a short adaptive quiz.',
                'route': '/dashboard/ai-tutor',
            },
        ]
        return {
            'weak_topics': weak_topics,
            'flashcards': flashcards,
            'recent_notes': notes,
            'action_plan': actions,
        }

    def document_insight(self, user_id: str, payload: DocumentInsightRequest) -> dict:
        text = payload.text.strip()
        topic = payload.title.strip()
        excerpt = text[:4000]
        summary_prompt = (
            'Summarize this study document into 5 concise revision bullets and then one short recap paragraph.\n\n'
            f'Title: {topic}\n'
            f'Subject: {payload.subject or "General"}\n'
            f'Content:\n{excerpt}'
        )
        summary = self.ai.tutor_chat(summary_prompt, context='Document learning summarizer')
        key_points = self._key_points(summary or text)
        quiz_prompts = self.ai.generate_quiz_questions(
            topic=topic,
            subject=payload.subject or 'General',
            difficulty='medium',
            count=5,
        )
        study_actions = [
            f'Convert {topic} into 5 flashcards for active recall.',
            'Run one short quiz immediately after review.',
            'Add the most difficult concept into tomorrow’s planner block.',
        ]
        saved_note = None
        if payload.save_note:
            note_payload = NoteCreateRequest(
                title=f'{topic} - extracted notes',
                content=f'{summary}\n\nKey points:\n' + '\n'.join(f'- {point}' for point in key_points),
            )
            saved_note = self.create_note(user_id, note_payload)

        return {
            'summary': summary,
            'key_points': key_points,
            'quiz_prompts': quiz_prompts,
            'study_actions': study_actions,
            'saved_note': saved_note,
        }

    def _weak_topics(self, user_id: str) -> list[dict]:
        if self.demo_mode:
            return list_rows(
                'weak_topics',
                predicate=lambda row: row['user_id'] == user_id,
                order_by='weakness_score',
                desc=True,
                limit=10,
            )

        response = (
            self.client.table('weak_topics')
            .select('*')
            .eq('user_id', user_id)
            .order('weakness_score', desc=True)
            .limit(10)
            .execute()
        )
        return response.data

    def _key_points(self, text: str) -> list[str]:
        lines = [
            line.strip('-• ').strip()
            for line in text.replace('\r', '').splitlines()
            if line.strip()
        ]
        if lines:
            return lines[:5]

        chunks = [chunk.strip() for chunk in text.split('.') if chunk.strip()]
        return chunks[:5]
