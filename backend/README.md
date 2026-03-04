# NeuroPrep Backend

FastAPI + Supabase backend for NeuroPrep AI Study Companion.

## Run

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Env
Copy `.env.example` to `.env` and provide Supabase + JWT + Gemini values.

## API Docs
- Swagger: `/docs`
- ReDoc: `/redoc`

## Schema
Run migrations in `backend/database/migrations`.
