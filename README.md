# AI Study Companion Platform (NeuroPrep)

Production-ready full-stack scaffold for a modern AI-powered study platform.

## Stack

- Frontend: React (Vite), TailwindCSS, Framer Motion, Chart.js, React Router, shadcn-style UI primitives
- Backend: FastAPI, Supabase PostgreSQL, JWT auth, rate limiting, Gemini integration
- Hosting prep: Vercel (frontend), Render (backend)

## Implemented Highlights

### Frontend
- Modern SaaS landing page with:
  - Hero, features, exam categories, product snapshots, testimonials, CTA, footer
  - Smooth-scroll navigation
  - Glassmorphism + animated gradients
  - Dark mode default + light mode toggle
- Dashboard experience with:
  - Collapsible animated sidebar
  - KPI widgets with staggered entry and animated counters
  - Chart.js analytics (line, bar, heatmap matrix, accuracy trend)
  - AI Tutor chat interface with typing/streaming UX
  - Focus timer (Pomodoro-style ring animation)
  - Notes workspace with rich-text actions and AI summarize flow
  - Calendar planner with drag-and-drop tasks and progress indicators
  - Break games hub with card hovers and leaderboard
- Micro-interactions:
  - Hover glow, lift animations, icon rotation, animated progress bars, toggle animations, skeleton loaders
- Performance:
  - Lazy-loaded dashboard routes and heavy chart views

### Backend
- Modular FastAPI architecture under `backend/app`:
  - `routes`, `schemas`, `services`, `database`, `core`, `auth`, `models`
- Security:
  - JWT issuance/validation
  - Password hashing with `passlib` + bcrypt
  - Rate limiting with `slowapi`
  - Pydantic request validation
- Supabase integration:
  - Service-role client wrapper
  - Auth flows: register, login (email/username), Google OAuth endpoint
- REST endpoints implemented:
  - Auth: `/auth/login`, `/auth/register`, `/auth/google`
  - Study: `/study/session`, `/study/history`, `/study/stats`
  - Tasks: `/tasks`, `/tasks`, `/tasks/update`, `/tasks`
  - Quiz: `/quiz/start`, `/quiz/submit`, `/quiz/history`
  - Mock: `/mock/start`, `/mock/submit`, `/mock/results`
  - AI: `/ai/chat`, `/ai/generate-notes`, `/ai/generate-quiz`, `/ai/analyze-weakness`
  - Games: `/games/score`, `/games/leaderboard`
  - Analytics: `/analytics/study-hours`, `/analytics/performance`, `/analytics/weak-topics`

## Project Structure

```text
.
+-- frontend/
¦   +-- src/
¦       +-- components/
¦       +-- hooks/
¦       +-- lib/
¦       +-- pages/
+-- backend/
¦   +-- app/
¦   ¦   +-- auth/
¦   ¦   +-- core/
¦   ¦   +-- database/
¦   ¦   +-- models/
¦   ¦   +-- routes/
¦   ¦   +-- schemas/
¦   ¦   +-- services/
¦   +-- database/
¦   ¦   +-- migrations/
¦   +-- docs/
+-- docs/
+-- shared/
    +-- types/
```

## Local Setup

## 1) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## 2) Backend

```bash
cd backend
cp .env.example .env
# edit .env values
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend runs on `http://localhost:8000`.

- OpenAPI docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Supabase Database Migrations

Run SQL files in order using Supabase SQL Editor (or Supabase CLI):

1. `backend/database/migrations/001_initial_schema.sql`
2. `backend/database/migrations/002_analytics_views.sql`

Migration details: `backend/docs/SUPABASE_MIGRATIONS.md`

## Environment Variables

See `backend/.env.example` and `docs/ENVIRONMENT.md`.

## Deployment Notes

- Frontend: connect `frontend/` to Vercel
- Backend: deploy `backend/` on Render (Python web service)
- Set production env vars for Supabase and Gemini on both platforms

## Documentation

- Installation: `docs/INSTALLATION.md`
- API: `docs/API.md`
- Architecture: `docs/ARCHITECTURE.md`
- Environment: `docs/ENVIRONMENT.md`
- Backend migration guide: `backend/docs/SUPABASE_MIGRATIONS.md`
