-- 004_habit_loop.sql
-- Habit loop engine: streaks, XP, levels, challenges, missions, and leaderboard events

create table if not exists gamification_profiles (
  user_id uuid primary key references users(id) on delete cascade,
  xp int not null default 0 check (xp >= 0),
  level int not null default 1 check (level >= 1),
  level_title text not null default 'Beginner',
  current_streak int not null default 0 check (current_streak >= 0),
  longest_streak int not null default 0 check (longest_streak >= 0),
  streak_freezes int not null default 1 check (streak_freezes >= 0),
  last_activity_date date,
  lessons_completed int not null default 0 check (lessons_completed >= 0),
  flashcards_reviewed int not null default 0 check (flashcards_reviewed >= 0),
  quizzes_completed int not null default 0 check (quizzes_completed >= 0),
  mock_tests_completed int not null default 0 check (mock_tests_completed >= 0),
  questions_solved int not null default 0 check (questions_solved >= 0),
  last_reward_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists gamification_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  event_type text not null,
  xp_delta int not null default 0,
  source_label text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists daily_challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  challenge_date date not null default current_date,
  challenge_type text not null,
  title text not null,
  description text not null,
  target_count int not null check (target_count > 0),
  progress_count int not null default 0 check (progress_count >= 0),
  reward_xp int not null default 100 check (reward_xp >= 0),
  reward_claimed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists idx_daily_challenges_user_day_type
on daily_challenges (user_id, challenge_date, challenge_type);

create table if not exists study_missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  mission_type text not null,
  title text not null,
  description text not null,
  target_count int not null check (target_count > 0),
  progress_count int not null default 0 check (progress_count >= 0),
  reward_xp int not null default 500 check (reward_xp >= 0),
  badge_name text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create unique index if not exists idx_study_missions_user_type_status
on study_missions (user_id, mission_type, status);

create unique index if not exists idx_achievements_user_badge
on achievements (user_id, badge_name);

drop trigger if exists trg_gamification_profiles_updated_at on gamification_profiles;
create trigger trg_gamification_profiles_updated_at
before update on gamification_profiles
for each row
execute function set_updated_at();

revoke all privileges on table gamification_profiles from anon, authenticated;
grant all privileges on table gamification_profiles to service_role;

revoke all privileges on table gamification_events from anon, authenticated;
grant all privileges on table gamification_events to service_role;

revoke all privileges on table daily_challenges from anon, authenticated;
grant all privileges on table daily_challenges to service_role;

revoke all privileges on table study_missions from anon, authenticated;
grant all privileges on table study_missions to service_role;
