# Architecture

## Frontend Architecture

- `pages/` route-level screens
- `components/` reusable UI, charts, dashboard modules
- `hooks/` theme and animation hooks
- `lib/` utility helpers

### UI Principles
- Dark mode first with toggle
- Glassmorphism card system
- Consistent spacing and section wrappers
- Framer Motion for subtle transitions and hover micro-interactions

## Backend Architecture

- `app/main.py`: app bootstrapping, CORS, rate-limit handlers, router composition
- `app/routes/`: endpoint handlers grouped by domain
- `app/services/`: domain logic and Supabase operations
- `app/schemas/`: request/response contracts
- `app/core/`: settings, JWT/password security, rate limiting
- `app/database/`: Supabase client
- `backend/database/migrations/`: SQL schema and analytics views

## Data Flow

1. Client sends request with JWT.
2. FastAPI dependency validates token and resolves current user.
3. Route delegates to service.
4. Service reads/writes Supabase tables.
5. Pydantic response model serializes result.
