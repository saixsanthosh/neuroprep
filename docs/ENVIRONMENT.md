# Environment Setup

## Backend `.env`

```env
PROJECT_NAME=NeuroPrep API
API_V1_PREFIX=
ENVIRONMENT=development
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET_KEY=change_this_to_a_long_random_secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
GEMINI_API_KEY=your_gemini_api_key
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## Frontend

Create `frontend/.env` if you want to wire API base URL in client code.

Example:

```env
VITE_API_BASE_URL=http://localhost:8000
```
