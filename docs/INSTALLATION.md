# Installation Guide

## Prerequisites

- Node.js 20+
- npm 10+
- Python 3.11+
- Supabase project (URL + anon key + service role key)
- Gemini API key (optional but recommended)

## Frontend

```bash
cd frontend
npm install
npm run dev
```

### Build

```bash
npm run build
npm run preview
```

## Backend

```bash
cd backend
cp .env.example .env
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Apply Database Schema

1. Open Supabase SQL Editor.
2. Execute:
- `backend/database/migrations/001_initial_schema.sql`
- `backend/database/migrations/002_analytics_views.sql`

## Verify

- `GET http://localhost:8000/health`
- `GET http://localhost:8000/docs`
