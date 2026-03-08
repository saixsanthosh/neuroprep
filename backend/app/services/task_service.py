from fastapi import HTTPException, status

from app.core.config import get_settings
from app.database.supabase_client import get_supabase_admin_client
from app.schemas.tasks import TaskCreate, TaskUpdate
from app.services.demo_store import delete_row, insert_row, list_rows, update_row


class TaskService:
    def __init__(self):
        self.demo_mode = get_settings().DEMO_MODE
        self.client = None if self.demo_mode else get_supabase_admin_client()

    def create_task(self, user_id: str, payload: TaskCreate) -> dict:
        row = {
            'user_id': user_id,
            'title': payload.title,
            'subject': payload.subject,
            'deadline': payload.deadline.isoformat(),
            'status': payload.status,
        }
        if self.demo_mode:
            return insert_row('study_tasks', row)
        response = self.client.table('study_tasks').insert(row).execute()
        return response.data[0]

    def list_tasks(self, user_id: str, status_filter: str | None = None) -> list[dict]:
        if self.demo_mode:
            return list_rows(
                'study_tasks',
                predicate=lambda row: row['user_id'] == user_id
                and (status_filter is None or row['status'] == status_filter),
                order_by='deadline',
                desc=False,
            )
        query = (
            self.client.table('study_tasks')
            .select('*')
            .eq('user_id', user_id)
            .order('deadline', desc=False)
        )

        if status_filter:
            query = query.eq('status', status_filter)

        response = query.execute()
        return response.data or []

    def update_task(self, user_id: str, payload: TaskUpdate) -> dict:
        updates = {
            key: value
            for key, value in {
                'title': payload.title,
                'subject': payload.subject,
                'deadline': payload.deadline.isoformat() if payload.deadline else None,
                'status': payload.status,
            }.items()
            if value is not None
        }

        if not updates:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='No task updates provided')

        if self.demo_mode:
            record = update_row(
                'study_tasks',
                predicate=lambda row: row['id'] == payload.id and row['user_id'] == user_id,
                updates=updates,
            )
            if not record:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Task not found')
            return record

        response = (
            self.client.table('study_tasks')
            .update(updates)
            .eq('id', payload.id)
            .eq('user_id', user_id)
            .execute()
        )

        if not response.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Task not found')

        return response.data[0]

    def delete_task(self, user_id: str, task_id: str) -> None:
        if self.demo_mode:
            deleted = delete_row(
                'study_tasks',
                predicate=lambda row: row['id'] == task_id and row['user_id'] == user_id,
            )
            if not deleted:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Task not found')
            return

        response = (
            self.client.table('study_tasks')
            .delete()
            .eq('id', task_id)
            .eq('user_id', user_id)
            .execute()
        )

        if not response.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Task not found')
