-- 003_learning_profile.sql
-- Personalized onboarding and AI learning profile storage for NeuroPrep

create table if not exists user_learning_profile (
  user_id uuid primary key references users(id) on delete cascade,
  goal_type text not null,
  exam_name text,
  school_grade int check (school_grade is null or school_grade between 6 and 12),
  degree_type text,
  major_subject text,
  subjects text[] not null default '{}',
  language text,
  skill_track text,
  skill_level text,
  study_hours numeric(4,2) not null default 2.0 check (study_hours > 0 and study_hours <= 16),
  onboarding_completed boolean not null default true,
  focus_modules text[] not null default '{}',
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_user_learning_profile_goal on user_learning_profile (goal_type);

drop trigger if exists trg_user_learning_profile_updated_at on user_learning_profile;
create trigger trg_user_learning_profile_updated_at
before update on user_learning_profile
for each row
execute function set_updated_at();

revoke all privileges on table user_learning_profile from anon, authenticated;
grant all privileges on table user_learning_profile to service_role;

revoke all privileges on all sequences in schema public from anon, authenticated;
grant all privileges on all sequences in schema public to service_role;
