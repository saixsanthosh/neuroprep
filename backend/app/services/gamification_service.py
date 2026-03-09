from __future__ import annotations

from datetime import date, timedelta

from app.core.config import get_settings
from app.database.supabase_client import get_supabase_admin_client
from app.services.auth_service import list_demo_users
from app.services.demo_store import insert_row, list_rows, update_row
from app.services.helpers import utc_now_iso
from app.services.learning_profile_service import LearningProfileService

LEVEL_XP_STEP = 120
LEVEL_TITLES = [
    (20, 'Exam Warrior'),
    (10, 'Study Master'),
    (5, 'Focus Learner'),
    (1, 'Beginner'),
]

XP_REWARDS = {
    'study_session_completed': 10,
    'lesson_completed': 10,
    'word_builder_puzzle_solved': 12,
    'quiz_submitted': 20,
    'flashcards_reviewed': 8,
    'mock_submitted': 50,
    'game_score_submitted': 15,
    'daily_challenge_completed': 100,
    'mission_completed': 500,
}


class GamificationService:
    def __init__(self):
        self.demo_mode = get_settings().DEMO_MODE
        self.client = None if self.demo_mode else get_supabase_admin_client()
        self.learning_profiles = LearningProfileService()

    def summary(self, user_id: str) -> dict:
        profile = self.get_or_create_profile(user_id)
        challenges = self._ensure_daily_challenges(user_id)
        mission = self._ensure_active_mission(user_id)
        achievements = self._achievements(user_id, limit=6)
        leaderboard = self.leaderboard(scope='weekly', limit=5)

        reminder_message = self._reminder_message(profile)
        encouragement_message = self._encouragement_message(profile)

        return {
            'profile': self._profile_with_progress(profile),
            'reminder_message': reminder_message,
            'encouragement_message': encouragement_message,
            'active_challenges': challenges,
            'active_mission': mission,
            'achievements': achievements,
            'leaderboard_preview': leaderboard,
            'mastery_tracks': self._mastery_tracks(profile),
        }

    def list_challenges(self, user_id: str) -> list[dict]:
        return self._ensure_daily_challenges(user_id)

    def list_missions(self, user_id: str) -> list[dict]:
        mission = self._ensure_active_mission(user_id)
        completed = self._list_rows('study_missions', predicate=lambda row: row['user_id'] == user_id and row['status'] == 'completed', limit=5, order_by='created_at', desc=True)
        return [mission] + completed if mission else completed

    def leaderboard(self, scope: str = 'weekly', limit: int = 20) -> list[dict]:
        users_map = self._user_map()
        profiles = self._list_rows('gamification_profiles', order_by='xp', desc=True, limit=500)

        if scope == 'weekly':
            cutoff = date.today() - timedelta(days=6)
            rows = self._list_rows(
                'gamification_events',
                predicate=lambda row: row['created_at'][:10] >= cutoff.isoformat(),
                order_by='created_at',
                desc=True,
                limit=5000,
            )
            weekly_scores: dict[str, int] = {}
            for row in rows:
                weekly_scores[row['user_id']] = weekly_scores.get(row['user_id'], 0) + int(row.get('xp_delta', 0))
            ranking_source = [
                {
                    'user_id': profile['user_id'],
                    'xp': weekly_scores.get(profile['user_id'], 0),
                    'level': profile['level'],
                    'current_streak': profile['current_streak'],
                }
                for profile in profiles
                if weekly_scores.get(profile['user_id'], 0) > 0
            ]
            ranking_source.sort(key=lambda row: row['xp'], reverse=True)
        else:
            ranking_source = [
                {
                    'user_id': profile['user_id'],
                    'xp': profile['xp'],
                    'level': profile['level'],
                    'current_streak': profile['current_streak'],
                }
                for profile in profiles
            ]
            ranking_source.sort(key=lambda row: row['xp'], reverse=True)

        return [
            {
                'rank': index + 1,
                'user_id': row['user_id'],
                'username': users_map.get(row['user_id'], 'Unknown'),
                'xp': int(row['xp']),
                'level': int(row['level']),
                'streak': int(row['current_streak']),
            }
            for index, row in enumerate(ranking_source[:limit])
        ]

    def record_event(
        self,
        user_id: str,
        username: str,
        event_type: str,
        *,
        count: int = 1,
        metadata: dict | None = None,
    ) -> dict:
        metadata = metadata or {}
        profile = self.get_or_create_profile(user_id)
        challenges = self._ensure_daily_challenges(user_id)
        mission = self._ensure_active_mission(user_id)

        counters = self._event_counters(event_type, count=count, metadata=metadata)
        xp_delta = XP_REWARDS.get(event_type, 0) * max(count, 1)

        updates = {
            'xp': int(profile['xp']) + xp_delta,
            'lessons_completed': int(profile['lessons_completed']) + counters.get('lessons_completed', 0),
            'flashcards_reviewed': int(profile['flashcards_reviewed']) + counters.get('flashcards_reviewed', 0),
            'quizzes_completed': int(profile['quizzes_completed']) + counters.get('quizzes_completed', 0),
            'mock_tests_completed': int(profile['mock_tests_completed']) + counters.get('mock_tests_completed', 0),
            'questions_solved': int(profile['questions_solved']) + counters.get('questions_answered', 0),
            'last_reward_message': self._reward_message(event_type, xp_delta),
            'updated_at': utc_now_iso(),
        }

        if event_type == 'study_session_completed' and counters.get('qualifies_for_streak'):
            streak_updates = self._streak_updates(profile, metadata.get('activity_date'))
            updates.update(streak_updates)

        level, level_title = self._level_from_xp(updates['xp'])
        updates['level'] = level
        updates['level_title'] = level_title

        profile = self._upsert_profile(user_id, updates)

        if xp_delta > 0:
            self._insert_row(
                'gamification_events',
                {
                    'user_id': user_id,
                    'event_type': event_type,
                    'xp_delta': xp_delta,
                    'source_label': self._source_label(event_type),
                    'metadata': metadata,
                },
                with_created_at=True,
            )

        self._progress_challenges(user_id, challenges, counters)
        self._progress_mission(user_id, mission, counters)
        self._unlock_achievements(user_id, username, profile, metadata)
        return self.summary(user_id)

    def get_or_create_profile(self, user_id: str) -> dict:
        profile = self._first_row('gamification_profiles', predicate=lambda row: row['user_id'] == user_id)
        if profile:
            return profile

        level, level_title = self._level_from_xp(0)
        payload = {
            'user_id': user_id,
            'xp': 0,
            'level': level,
            'level_title': level_title,
            'current_streak': 0,
            'longest_streak': 0,
            'streak_freezes': 1,
            'last_activity_date': None,
            'lessons_completed': 0,
            'flashcards_reviewed': 0,
            'quizzes_completed': 0,
            'mock_tests_completed': 0,
            'questions_solved': 0,
            'last_reward_message': None,
            'created_at': utc_now_iso(),
            'updated_at': utc_now_iso(),
        }
        return self._insert_row('gamification_profiles', payload)

    def _ensure_daily_challenges(self, user_id: str) -> list[dict]:
        today = date.today().isoformat()
        rows = self._list_rows(
            'daily_challenges',
            predicate=lambda row: row['user_id'] == user_id and row['challenge_date'] == today,
            order_by='created_at',
            desc=False,
        )
        if rows:
            return rows

        profile = self.learning_profiles.get_profile(user_id) or {'goal_type': 'general_knowledge'}
        templates = self._challenge_templates(profile)
        created = [
            self._insert_row(
                'daily_challenges',
                {
                    'user_id': user_id,
                    'challenge_date': today,
                    **template,
                },
                with_created_at=True,
            )
            for template in templates
        ]
        return created

    def _ensure_active_mission(self, user_id: str) -> dict | None:
        active = self._first_row(
            'study_missions',
            predicate=lambda row: row['user_id'] == user_id and row['status'] == 'active',
            order_by='created_at',
            desc=False,
        )
        if active:
            return active

        profile = self.learning_profiles.get_profile(user_id) or {'goal_type': 'general_knowledge'}
        mission_template = self._mission_template(profile)
        return self._insert_row(
            'study_missions',
            {
                'user_id': user_id,
                **mission_template,
            },
            with_created_at=True,
        )

    def _challenge_templates(self, profile: dict) -> list[dict]:
        goal = profile.get('goal_type', 'general_knowledge')
        focus = (profile.get('subjects') or [profile.get('exam_name') or profile.get('language') or 'core topic'])[0]
        base = [
            {
                'challenge_type': 'study_sessions',
                'title': 'Protect your streak',
                'description': 'Study for at least 10 focused minutes today.',
                'target_count': 1,
                'progress_count': 0,
                'reward_xp': 100,
                'reward_claimed': False,
            }
        ]
        if goal == 'language_learning':
            base.extend(
                [
                    {
                        'challenge_type': 'lessons_completed',
                        'title': 'Daily vocabulary lesson',
                        'description': f'Complete one {profile.get("language") or "language"} lesson.',
                        'target_count': 1,
                        'progress_count': 0,
                        'reward_xp': 100,
                        'reward_claimed': False,
                    },
                    {
                        'challenge_type': 'flashcards_reviewed',
                        'title': 'Flashcard drill',
                        'description': 'Review 10 flashcards to reinforce recall.',
                        'target_count': 10,
                        'progress_count': 0,
                        'reward_xp': 100,
                        'reward_claimed': False,
                    },
                ]
            )
        else:
            base.extend(
                [
                    {
                        'challenge_type': 'questions_answered',
                        'title': f'Solve 5 {focus} questions',
                        'description': f'Answer five questions in {focus} today.',
                        'target_count': 5,
                        'progress_count': 0,
                        'reward_xp': 100,
                        'reward_claimed': False,
                    },
                    {
                        'challenge_type': 'flashcards_reviewed',
                        'title': 'Review flashcards',
                        'description': 'Review 10 flashcards or quick notes.',
                        'target_count': 10,
                        'progress_count': 0,
                        'reward_xp': 100,
                        'reward_claimed': False,
                    },
                ]
            )
        return base

    def _mission_template(self, profile: dict) -> dict:
        goal = profile.get('goal_type', 'general_knowledge')
        if goal == 'competitive_exams':
            return {
                'mission_type': 'questions_answered',
                'title': 'Exam Sprint',
                'description': 'Solve 100 exam-style questions and hold your streak.',
                'target_count': 100,
                'progress_count': 0,
                'reward_xp': 500,
                'badge_name': 'Exam Warrior Mission',
                'status': 'active',
            }
        if goal == 'language_learning':
            return {
                'mission_type': 'lessons_completed',
                'title': 'Vocabulary Builder',
                'description': 'Complete 10 language lessons this cycle.',
                'target_count': 10,
                'progress_count': 0,
                'reward_xp': 500,
                'badge_name': 'Language Builder',
                'status': 'active',
            }
        return {
            'mission_type': 'study_sessions',
            'title': 'Consistency Builder',
            'description': 'Finish 10 focused study sessions without losing momentum.',
            'target_count': 10,
            'progress_count': 0,
            'reward_xp': 500,
            'badge_name': 'Consistency Builder',
            'status': 'active',
        }

    def _event_counters(self, event_type: str, *, count: int, metadata: dict) -> dict:
        duration = int(metadata.get('duration', 0) or 0)
        counters = {}
        if event_type == 'study_session_completed':
            counters['study_sessions'] = count
            counters['qualifies_for_streak'] = duration >= 10 and metadata.get('session_type', 'study') == 'study'
        if event_type == 'lesson_completed':
            counters['lessons_completed'] = count
        if event_type == 'word_builder_puzzle_solved':
            counters['lessons_completed'] = count
            counters['questions_answered'] = count
        if event_type == 'flashcards_reviewed':
            counters['flashcards_reviewed'] = count
        if event_type == 'quiz_submitted':
            counters['quizzes_completed'] = 1
            counters['questions_answered'] = int(metadata.get('total_questions', count))
        if event_type == 'mock_submitted':
            counters['mock_tests_completed'] = 1
            counters['questions_answered'] = int(metadata.get('total_questions', 0))
        return counters

    def _streak_updates(self, profile: dict, activity_date: str | None) -> dict:
        today = date.fromisoformat(activity_date) if activity_date else date.today()
        last_activity = profile.get('last_activity_date')
        if last_activity:
            last_date = date.fromisoformat(str(last_activity))
            delta = (today - last_date).days
        else:
            delta = None

        current_streak = int(profile['current_streak'])
        freezes = int(profile['streak_freezes'])

        if delta is None or delta == 0:
            next_streak = max(current_streak, 1)
        elif delta == 1:
            next_streak = current_streak + 1
        elif delta == 2 and freezes > 0:
            next_streak = current_streak + 1
            freezes -= 1
        else:
            next_streak = 1

        return {
            'current_streak': next_streak,
            'longest_streak': max(int(profile['longest_streak']), next_streak),
            'streak_freezes': freezes,
            'last_activity_date': today.isoformat(),
        }

    def _progress_challenges(self, user_id: str, challenges: list[dict], counters: dict) -> None:
        for challenge in challenges:
            amount = int(counters.get(challenge['challenge_type'], 0))
            if amount <= 0:
                continue
            next_progress = min(int(challenge['target_count']), int(challenge['progress_count']) + amount)
            updates = {'progress_count': next_progress}
            if next_progress >= int(challenge['target_count']) and not challenge.get('reward_claimed'):
                updates['completed_at'] = utc_now_iso()
                updates['reward_claimed'] = True
                self._reward_bonus(user_id, 'daily_challenge_completed', int(challenge['reward_xp']), challenge['title'])
            self._update_row('daily_challenges', challenge['id'], updates)

    def _progress_mission(self, user_id: str, mission: dict | None, counters: dict) -> None:
        if not mission or mission.get('status') != 'active':
            return
        amount = int(counters.get(mission['mission_type'], 0))
        if amount <= 0:
            return
        next_progress = min(int(mission['target_count']), int(mission['progress_count']) + amount)
        updates = {'progress_count': next_progress}
        if next_progress >= int(mission['target_count']):
            updates['status'] = 'completed'
            updates['completed_at'] = utc_now_iso()
            self._reward_bonus(user_id, 'mission_completed', int(mission['reward_xp']), mission['title'])
            if mission.get('badge_name'):
                self._insert_achievement(user_id, mission['badge_name'])
        self._update_row('study_missions', mission['id'], updates)

    def _reward_bonus(self, user_id: str, event_type: str, xp_delta: int, source_label: str) -> None:
        profile = self.get_or_create_profile(user_id)
        next_xp = int(profile['xp']) + xp_delta
        level, level_title = self._level_from_xp(next_xp)
        self._upsert_profile(
            user_id,
            {
                'xp': next_xp,
                'level': level,
                'level_title': level_title,
                'last_reward_message': self._reward_message(event_type, xp_delta),
                'updated_at': utc_now_iso(),
            },
        )
        self._insert_row(
            'gamification_events',
            {
                'user_id': user_id,
                'event_type': event_type,
                'xp_delta': xp_delta,
                'source_label': source_label,
                'metadata': {},
            },
            with_created_at=True,
        )

    def _unlock_achievements(self, user_id: str, username: str, profile: dict, metadata: dict) -> None:
        del username
        achievements = {
            'First Study Session': int(profile['current_streak']) >= 1,
            '7 Day Streak': int(profile['current_streak']) >= 7,
            '100 Questions Solved': int(profile['questions_solved']) >= 100,
            'Focus Learner': int(profile['level']) >= 5,
            'Study Master': int(profile['level']) >= 10,
            'First Mock Complete': int(profile['mock_tests_completed']) >= 1,
        }
        if str(metadata.get('subject', '')).lower() == 'algebra' and float(metadata.get('accuracy', 0)) >= 80:
            achievements['Master of Algebra'] = True

        for badge_name, unlocked in achievements.items():
            if unlocked:
                self._insert_achievement(user_id, badge_name)

    def _insert_achievement(self, user_id: str, badge_name: str) -> None:
        existing = self._first_row(
            'achievements',
            predicate=lambda row: row['user_id'] == user_id and row['badge_name'] == badge_name,
        )
        if existing:
            return
        self._insert_row(
            'achievements',
            {'user_id': user_id, 'badge_name': badge_name, 'unlocked_at': utc_now_iso()},
            with_created_at=False,
        )

    def _achievements(self, user_id: str, limit: int) -> list[dict]:
        return self._list_rows(
            'achievements',
            predicate=lambda row: row['user_id'] == user_id,
            order_by='unlocked_at',
            desc=True,
            limit=limit,
        )

    def _profile_with_progress(self, profile: dict) -> dict:
        return {
            **profile,
            'xp_to_next_level': max(0, (int(profile['level']) * LEVEL_XP_STEP) - int(profile['xp'])),
        }

    def _mastery_tracks(self, profile: dict) -> list[dict]:
        return [
            {'label': 'Consistency', 'progress': min(100, int(profile['current_streak']) * 10)},
            {'label': 'Quiz Cadence', 'progress': min(100, int(profile['quizzes_completed']) * 8)},
            {'label': 'Mission Momentum', 'progress': min(100, int(profile['questions_solved']) // 2)},
        ]

    def _reminder_message(self, profile: dict) -> str:
        if int(profile['current_streak']) == 0:
            return 'Start a 10-minute session today to ignite your first streak.'
        return f"Your {profile['current_streak']}-day streak is active. Complete one short study block to protect it."

    def _encouragement_message(self, profile: dict) -> str:
        if int(profile['level']) >= 10:
            return f"Excellent work. You are operating at {profile['level_title']} level with {profile['xp']} XP."
        if int(profile['current_streak']) >= 7:
            return f"Strong momentum. A {profile['current_streak']}-day streak is compounding your focus."
        return f"Good progress. You are level {profile['level']} with {profile['xp']} XP. Keep stacking small wins."

    def _reward_message(self, event_type: str, xp_delta: int) -> str:
        label = self._source_label(event_type)
        return f'+{xp_delta} XP | {label}'

    def _source_label(self, event_type: str) -> str:
        return {
            'study_session_completed': 'Study session completed',
            'lesson_completed': 'Lesson completed',
            'word_builder_puzzle_solved': 'Word Builder puzzle solved',
            'quiz_submitted': 'Quiz completed',
            'flashcards_reviewed': 'Flashcards reviewed',
            'mock_submitted': 'Mock test completed',
            'game_score_submitted': 'Game score submitted',
            'daily_challenge_completed': 'Daily challenge completed',
            'mission_completed': 'Study mission completed',
        }.get(event_type, event_type.replace('_', ' ').title())

    def _level_from_xp(self, xp: int) -> tuple[int, str]:
        level = max(1, min(20, (xp // LEVEL_XP_STEP) + 1))
        title = next(title for threshold, title in LEVEL_TITLES if level >= threshold)
        return level, title

    def _user_map(self) -> dict[str, str]:
        if self.demo_mode:
            return {row['id']: row['username'] for row in list_demo_users()}
        users = self._list_rows('users', limit=5000)
        return {row['id']: row['username'] for row in users}

    def _insert_row(self, table_name: str, row: dict, *, with_created_at: bool = False) -> dict:
        if self.demo_mode:
            record = insert_row(table_name, row, with_created_at=with_created_at)
            if table_name == 'achievements' and 'unlocked_at' not in record:
                record['unlocked_at'] = utc_now_iso()
                self._update_row(table_name, record['id'], {'unlocked_at': record['unlocked_at']})
            return record
        response = self.client.table(table_name).insert(row).execute()
        return response.data[0]

    def _list_rows(self, table_name: str, *, predicate=None, order_by: str | None = None, desc: bool = False, limit: int | None = None) -> list[dict]:
        if self.demo_mode:
            rows = list_rows(table_name, predicate=predicate)
            if order_by:
                def sort_value(row: dict):
                    value = row.get(order_by)
                    if value is None:
                        return (2, '')
                    if isinstance(value, bool):
                        return (0, float(int(value)))
                    if isinstance(value, (int, float)):
                        return (0, float(value))
                    text = str(value)
                    try:
                        return (0, float(text))
                    except ValueError:
                        return (1, text)

                rows.sort(key=sort_value, reverse=desc)
            if limit is not None:
                rows = rows[:limit]
            return rows
        query = self.client.table(table_name).select('*')
        if order_by:
            query = query.order(order_by, desc=desc)
        if limit is not None and predicate is None:
            query = query.limit(limit)
        response = query.execute()
        rows = response.data or []
        if predicate:
            rows = [row for row in rows if predicate(row)]
        if limit is not None:
            rows = rows[:limit]
        return rows

    def _first_row(self, table_name: str, *, predicate, order_by: str | None = None, desc: bool = False) -> dict | None:
        rows = self._list_rows(table_name, predicate=predicate, order_by=order_by, desc=desc, limit=1)
        return rows[0] if rows else None

    def _upsert_profile(self, user_id: str, updates: dict) -> dict:
        if self.demo_mode:
            updated = update_row('gamification_profiles', predicate=lambda row: row['user_id'] == user_id, updates=updates)
            return updated or self.get_or_create_profile(user_id)
        response = self.client.table('gamification_profiles').update(updates).eq('user_id', user_id).execute()
        return response.data[0] if response.data else self.get_or_create_profile(user_id)

    def _update_row(self, table_name: str, existing_id: str | None, updates: dict, predicate=None) -> dict | None:
        if self.demo_mode:
            if existing_id is not None:
                return update_row(table_name, predicate=lambda row: row['id'] == existing_id, updates=updates)
            if predicate is not None:
                return update_row(table_name, predicate=predicate, updates=updates)
            return None
        if existing_id is None:
            return None
        response = self.client.table(table_name).update(updates).eq('id', existing_id).execute()
        return response.data[0] if response.data else None

