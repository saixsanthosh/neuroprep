# Supabase Migration Guide

This backend expects the SQL schema in `backend/database/migrations`.

## Files

1. `001_initial_schema.sql`
- Creates all core tables:
  - `users`
  - `study_sessions`
  - `study_tasks`
  - `quiz_results`
  - `mock_test_results`
  - `flashcards`
  - `notes`
  - `weak_topics`
  - `study_plans`
  - `achievements`
  - `game_scores`
- Adds enums, constraints, indexes, update trigger for notes
- Enables Row Level Security and owner policies

2. `002_analytics_views.sql`
- Adds aggregated read views:
  - `v_daily_study_hours`
  - `v_subject_accuracy`

## Apply with Supabase SQL Editor

1. Open your project SQL Editor.
2. Run `001_initial_schema.sql`.
3. Run `002_analytics_views.sql`.
4. Verify tables under Table Editor.

## Rollback Notes

No down migration is included by default. For rollback in staging:
- drop views
- drop tables
- drop enum types

Use backups before running destructive SQL in production.
