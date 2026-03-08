-- 001_initial_schema.sql
-- NeuroPrep / AI Study Companion core schema for Supabase PostgreSQL

create extension if not exists "pgcrypto";

create type session_kind as enum ('study', 'break');
create type task_status as enum ('pending', 'completed');
create type flashcard_difficulty as enum ('easy', 'medium', 'hard');

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  username text not null unique,
  password_hash text,
  created_at timestamptz not null default now(),
  last_login timestamptz
);

create table if not exists study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  subject text not null,
  duration int not null check (duration > 0),
  session_type session_kind not null,
  date date not null default current_date
);

create table if not exists study_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  title text not null,
  subject text not null,
  deadline timestamptz not null,
  status task_status not null default 'pending'
);

create table if not exists quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  subject text not null,
  score numeric(10,2) not null,
  total_questions int not null check (total_questions > 0),
  accuracy numeric(5,2) not null check (accuracy >= 0 and accuracy <= 100),
  time_taken int not null check (time_taken > 0),
  created_at timestamptz not null default now()
);

create table if not exists mock_test_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  exam_type text not null,
  score numeric(10,2) not null,
  rank int,
  time_taken int not null check (time_taken > 0),
  accuracy numeric(5,2) not null check (accuracy >= 0 and accuracy <= 100),
  created_at timestamptz not null default now()
);

create table if not exists flashcards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  question text not null,
  answer text not null,
  subject text not null,
  difficulty flashcard_difficulty not null default 'medium'
);

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  title text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists weak_topics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  subject text not null,
  topic text not null,
  weakness_score numeric(5,2) not null check (weakness_score >= 0 and weakness_score <= 100)
);

create table if not exists study_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  exam_name text not null,
  daily_hours numeric(4,2) not null check (daily_hours > 0 and daily_hours <= 24),
  exam_date date not null
);

create table if not exists achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  badge_name text not null,
  unlocked_at timestamptz not null default now()
);

create table if not exists game_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  game_name text not null,
  score int not null check (score >= 0),
  created_at timestamptz not null default now()
);

create index if not exists idx_study_sessions_user_date on study_sessions (user_id, date desc);
create index if not exists idx_study_tasks_user_deadline on study_tasks (user_id, deadline);
create index if not exists idx_quiz_results_user_created on quiz_results (user_id, created_at desc);
create index if not exists idx_mock_results_user_created on mock_test_results (user_id, created_at desc);
create index if not exists idx_weak_topics_user_score on weak_topics (user_id, weakness_score desc);
create index if not exists idx_game_scores_game_score on game_scores (game_name, score desc);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_notes_updated_at on notes;
create trigger trg_notes_updated_at
before update on notes
for each row
execute function set_updated_at();

-- Row Level Security
alter table users enable row level security;
alter table study_sessions enable row level security;
alter table study_tasks enable row level security;
alter table quiz_results enable row level security;
alter table mock_test_results enable row level security;
alter table flashcards enable row level security;
alter table notes enable row level security;
alter table weak_topics enable row level security;
alter table study_plans enable row level security;
alter table achievements enable row level security;
alter table game_scores enable row level security;

-- Drop old policies if re-running migration in dev

drop policy if exists "users_select_own" on users;
drop policy if exists "users_update_own" on users;
drop policy if exists "users_insert_own" on users;

create policy "users_select_own" on users
for select using (auth.uid() = id);

create policy "users_update_own" on users
for update using (auth.uid() = id)
with check (auth.uid() = id);

create policy "users_insert_own" on users
for insert with check (auth.uid() = id);

-- owner-only table policies

do $$
declare
  t text;
begin
  foreach t in array array[
    'study_sessions', 'study_tasks', 'quiz_results', 'mock_test_results',
    'flashcards', 'notes', 'weak_topics', 'study_plans', 'achievements', 'game_scores'
  ]
  loop
    execute format('drop policy if exists %I on %I', t || '_owner_select', t);
    execute format('drop policy if exists %I on %I', t || '_owner_insert', t);
    execute format('drop policy if exists %I on %I', t || '_owner_update', t);
    execute format('drop policy if exists %I on %I', t || '_owner_delete', t);

    execute format(
      'create policy %I on %I for select using (auth.uid() = user_id)',
      t || '_owner_select', t
    );
    execute format(
      'create policy %I on %I for insert with check (auth.uid() = user_id)',
      t || '_owner_insert', t
    );
    execute format(
      'create policy %I on %I for update using (auth.uid() = user_id) with check (auth.uid() = user_id)',
      t || '_owner_update', t
    );
    execute format(
      'create policy %I on %I for delete using (auth.uid() = user_id)',
      t || '_owner_delete', t
    );
  end loop;
end $$;
