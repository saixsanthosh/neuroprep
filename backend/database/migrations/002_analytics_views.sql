-- 002_analytics_views.sql
-- Optional analytics views for lightweight aggregation in Supabase

create or replace view v_daily_study_hours as
select
  user_id,
  date,
  round(sum(case when session_type = 'study' then duration else 0 end) / 60.0, 2) as hours
from study_sessions
group by user_id, date;

create or replace view v_subject_accuracy as
select
  user_id,
  subject,
  round(avg(accuracy), 2) as avg_accuracy,
  count(*) as attempts
from quiz_results
group by user_id, subject;
