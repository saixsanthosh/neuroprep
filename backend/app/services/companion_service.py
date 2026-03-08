from __future__ import annotations

from app.core.config import get_settings
from app.services.analytics_service import AnalyticsService
from app.services.learning_profile_service import LearningProfileService
from app.services.study_service import StudyService
from app.services.task_service import TaskService


class CompanionService:
    def __init__(self):
        self.settings = get_settings()
        self.analytics = AnalyticsService()
        self.study = StudyService()
        self.tasks = TaskService()
        self.learning_profiles = LearningProfileService()

    def daily_brief(self, user: dict) -> dict:
        profile = self.learning_profiles.require_profile(user['id'])
        stats = self.study.get_stats(user['id'])
        weak_topics = self.analytics.weak_topics(user['id'], limit=3)
        pending_tasks = self.tasks.list_tasks(user['id'], status_filter='pending')[:3]

        focus_label = self._focus_label(profile, weak_topics)
        readiness_score = self._readiness_score(stats.productivity_score, weak_topics, stats.weekly_hours)
        roadmap = self._roadmap(profile, weak_topics)

        daily_brief = []
        if pending_tasks:
            daily_brief.extend([f"{task['subject']}: {task['title']}" for task in pending_tasks])
        else:
            daily_brief.extend(roadmap[:3])

        smart_suggestions = self._smart_suggestions(profile, stats, weak_topics)
        revision_alerts = self._revision_alerts(weak_topics, profile)

        return {
            'greeting': f"Good day {user['name'].split()[0]}.",
            'mentor_message': (
                f"Your {profile['goal_type'].replace('_', ' ')} workspace is active. "
                f"Today, push hardest on {focus_label} and keep your study window near {profile['study_hours']} hours."
            ),
            'strategy_tip': self._strategy_tip(profile, weak_topics),
            'mistake_pattern': self._mistake_pattern(weak_topics),
            'readiness_score': readiness_score,
            'motivation_message': self._motivation(stats.study_streak, stats.productivity_score),
            'next_focus': focus_label,
            'daily_brief': daily_brief,
            'smart_suggestions': smart_suggestions,
            'revision_alerts': revision_alerts,
            'roadmap': roadmap,
            'skill_progress_map': self._skill_progress_map(profile, stats.productivity_score, weak_topics),
            'voice_tools': {
                'whisper': bool(self.settings.WHISPER_MODEL),
                'coqui_tts': bool(self.settings.COQUI_TTS_MODEL),
                'libretranslate': bool(self.settings.LIBRETRANSLATE_URL),
                'tesseract': bool(self.settings.TESSERACT_CMD),
            },
        }

    def _focus_label(self, profile: dict, weak_topics: list[dict]) -> str:
        if weak_topics:
            return weak_topics[0]['topic']
        if profile.get('subjects'):
            return profile['subjects'][0]
        return (
            profile.get('exam_name')
            or profile.get('language')
            or profile.get('skill_track')
            or profile.get('major_subject')
            or 'core practice'
        )

    def _readiness_score(self, productivity_score: int, weak_topics: list[dict], weekly_hours: float) -> int:
        weakness_penalty = int(sum(item['weakness_score'] for item in weak_topics) / max(len(weak_topics), 1) / 5) if weak_topics else 4
        readiness = int(min(98, max(35, productivity_score + min(int(weekly_hours * 3), 18) - weakness_penalty)))
        return readiness

    def _roadmap(self, profile: dict, weak_topics: list[dict]) -> list[str]:
        if profile['goal_type'] == 'competitive_exams':
            exam_name = profile.get('exam_name') or 'your exam'
            tracks = profile.get('subjects') or ['Concept revision', 'Practice set', 'Mock review']
            return [
                f'Day 1 - Rebuild {tracks[0]} fundamentals for {exam_name}',
                f'Day 2 - Timed practice on {tracks[min(1, len(tracks) - 1)]}',
                f'Day 3 - Analyze mistakes and revise {weak_topics[0]["topic"] if weak_topics else tracks[0]}',
            ]
        if profile['goal_type'] == 'language_learning':
            language = profile.get('language') or 'your target language'
            return [
                f'Day 1 - {language} vocabulary sprint and spaced recall',
                f'Day 2 - Speaking drill plus pronunciation scoring loop',
                f'Day 3 - Listening quiz and translation challenge',
            ]
        if profile['goal_type'] == 'skill_learning':
            track = profile.get('skill_track') or 'your skill track'
            return [
                f'Day 1 - Foundations review for {track}',
                'Day 2 - Mini project milestone',
                'Day 3 - Adaptive quiz and retrospective',
            ]
        subjects = profile.get('subjects') or ['Concept review', 'Practice', 'Revision']
        return [
            f'Day 1 - Notes + active recall for {subjects[0]}',
            f'Day 2 - Quiz practice for {subjects[min(1, len(subjects) - 1)]}',
            f'Day 3 - Revision sprint for {weak_topics[0]["topic"] if weak_topics else subjects[0]}',
        ]

    def _smart_suggestions(self, profile: dict, stats, weak_topics: list[dict]) -> list[str]:
        suggestions = []
        if weak_topics:
            suggestions.append(
                f"You are slipping in {weak_topics[0]['topic']}. Schedule a 20-minute recovery block next."
            )
        if stats.weekly_hours < profile['study_hours'] * 3:
            suggestions.append(
                f"Your weekly hours are behind target. Add one extra {int(profile['study_hours'] * 30)}-minute sprint today."
            )
        if profile['goal_type'] == 'language_learning':
            suggestions.append('Open the speaking loop after your vocabulary lesson to reinforce pronunciation memory.')
        elif profile['goal_type'] == 'competitive_exams':
            suggestions.append('Run one timed mock section before the end of the day and analyze negative-marking risk.')
        else:
            suggestions.append('Use AI tutor follow-ups immediately after each quiz to lock in conceptual understanding.')
        return suggestions[:3]

    def _revision_alerts(self, weak_topics: list[dict], profile: dict) -> list[str]:
        if weak_topics:
            return [f"Time to revisit {item['topic']} in {item['subject']}." for item in weak_topics[:3]]
        focus = self._focus_label(profile, weak_topics)
        return [f'Revision memory for {focus} is due today.']

    def _strategy_tip(self, profile: dict, weak_topics: list[dict]) -> str:
        if profile['goal_type'] == 'competitive_exams':
            return 'Start with a confidence-building section, then attack medium-difficulty questions before full mocks.'
        if profile['goal_type'] == 'language_learning':
            return 'Alternate vocabulary, speaking, and listening blocks so recall and pronunciation improve together.'
        if weak_topics:
            return f"Spend your first deep-work block on {weak_topics[0]['topic']} before switching context."
        return 'Start with concept review, then move into a timed practice block while focus is strongest.'

    def _mistake_pattern(self, weak_topics: list[dict]) -> str:
        if weak_topics:
            return (
                f"Your current mistake pattern clusters around {weak_topics[0]['topic']}. "
                'Slow down on first-pass reading and verify formulas before committing answers.'
            )
        return 'No dominant mistake pattern yet. Keep logging quizzes and mocks so the companion can detect one.'

    def _motivation(self, study_streak: int, productivity_score: int) -> str:
        if study_streak >= 7:
            return f'Great work. You protected a {study_streak}-day streak and your focus discipline is holding.'
        if productivity_score >= 80:
            return 'Solid focus signal today. Keep the same pace through one more deliberate study block.'
        return 'Momentum is still recoverable today. One focused sprint can reset the entire day.'

    def _skill_progress_map(self, profile: dict, productivity_score: int, weak_topics: list[dict]) -> list[dict]:
        tracks = profile.get('subjects') or [
            profile.get('exam_name'),
            profile.get('language'),
            profile.get('skill_track'),
            profile.get('major_subject'),
        ]
        labels = [track for track in tracks if track][:4] or ['Core mastery', 'Practice memory', 'Revision speed']
        nodes = []
        for index, label in enumerate(labels):
            weakness_hit = next(
                (
                    item
                    for item in weak_topics
                    if label.lower() in item['subject'].lower() or label.lower() in item['topic'].lower()
                ),
                None,
            )
            mastery = max(35, min(95, productivity_score - (index * 6) - int((weakness_hit or {}).get('weakness_score', 0) / 6)))
            nodes.append(
                {
                    'label': label,
                    'mastery': mastery,
                    'momentum': 'rising' if mastery >= 75 else 'stabilize' if mastery >= 55 else 'recover',
                }
            )
        return nodes
