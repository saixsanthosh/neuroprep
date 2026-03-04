# API Documentation

Base URL: `http://localhost:8000`

## Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/google`

## Study Tracking

- `POST /study/session`
- `GET /study/history`
- `GET /study/stats`

## Tasks

- `POST /tasks`
- `GET /tasks`
- `PUT /tasks/update`
- `DELETE /tasks?task_id=<uuid>`

## Quiz

- `POST /quiz/start`
- `POST /quiz/submit`
- `GET /quiz/history`

## Mock

- `POST /mock/start`
- `POST /mock/submit`
- `GET /mock/results`

## AI

- `POST /ai/chat`
- `POST /ai/generate-notes`
- `POST /ai/generate-quiz`
- `POST /ai/analyze-weakness`

## Games

- `POST /games/score`
- `GET /games/leaderboard`

## Analytics

- `GET /analytics/study-hours`
- `GET /analytics/performance`
- `GET /analytics/weak-topics`

## Auth Header

For protected endpoints, pass JWT token:

```http
Authorization: Bearer <token>
```

## Interactive Docs

- Swagger: `/docs`
- ReDoc: `/redoc`
