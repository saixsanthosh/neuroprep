from fastapi import APIRouter, Depends, Query

from app.auth.dependencies import get_current_user
from app.schemas.common import MessageResponse
from app.schemas.tasks import TaskCreate, TaskResponse, TaskUpdate
from app.services.task_service import TaskService

router = APIRouter(prefix='/tasks', tags=['Task Management'])
task_service = TaskService()


@router.post('', response_model=TaskResponse)
def create_task(payload: TaskCreate, current_user: dict = Depends(get_current_user)) -> TaskResponse:
    return TaskResponse(**task_service.create_task(current_user['id'], payload))


@router.get('', response_model=list[TaskResponse])
def get_tasks(
    status: str | None = Query(default=None),
    current_user: dict = Depends(get_current_user),
) -> list[TaskResponse]:
    data = task_service.list_tasks(current_user['id'], status_filter=status)
    return [TaskResponse(**item) for item in data]


@router.put('/update', response_model=TaskResponse)
def update_task(payload: TaskUpdate, current_user: dict = Depends(get_current_user)) -> TaskResponse:
    return TaskResponse(**task_service.update_task(current_user['id'], payload))


@router.delete('', response_model=MessageResponse)
def delete_task(
    task_id: str = Query(..., description='Task ID to delete'),
    current_user: dict = Depends(get_current_user),
) -> MessageResponse:
    task_service.delete_task(current_user['id'], task_id)
    return MessageResponse(message='Task deleted successfully')
