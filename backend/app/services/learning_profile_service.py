from __future__ import annotations

from fastapi import HTTPException, status

from app.core.config import get_settings
from app.database.supabase_client import get_supabase_admin_client
from app.schemas.learning import LearningProfileUpsertRequest
from app.services.demo_store import insert_row, list_rows, update_row
from app.services.helpers import utc_now_iso

GOAL_OPTIONS = [
    {
        'value': 'school_learning',
        'label': 'School learning',
        'description': 'Notes, quizzes, and revision support for school subjects.',
    },
    {
        'value': 'college_courses',
        'label': 'College courses',
        'description': 'Coursework support with lectures, notes, and assignments.',
    },
    {
        'value': 'competitive_exams',
        'label': 'Competitive exams',
        'description': 'Mock tests, syllabus tracking, and high-intensity prep.',
    },
    {
        'value': 'language_learning',
        'label': 'Language learning',
        'description': 'Duolingo-style lessons for vocabulary, speaking, and listening.',
    },
    {
        'value': 'skill_learning',
        'label': 'Skill learning',
        'description': 'Roadmaps for programming, AI/ML, design, and certifications.',
    },
    {
        'value': 'general_knowledge',
        'label': 'General knowledge',
        'description': 'Breadth-first exploration with AI-generated summaries and flashcards.',
    },
]

COMPETITIVE_EXAMS = ['JEE Main', 'NEET', 'UPSC Civil Services Examination', 'GATE']
SCHOOL_SUBJECTS = ['Mathematics', 'Science', 'Biology', 'Physics', 'Chemistry', 'History', 'Geography', 'English']
COLLEGE_MAJORS = ['Computer Science', 'Electronics', 'Business', 'Mathematics', 'Mechanical Engineering']
SKILL_TRACKS = ['Programming', 'AI / ML', 'Data Science', 'Design', 'Business']
LANGUAGES = ['Spanish', 'French', 'German', 'Hindi', 'Japanese', 'Korean']
SKILL_LEVELS = ['beginner', 'intermediate', 'advanced']


MODULE_MAP: dict[str, list[dict[str, str]]] = {
    'competitive_exams': [
        {
            'id': 'mock-engine',
            'title': 'Mock Exam Engine',
            'description': 'Timed mocks, exam strategy, and rank-oriented analysis.',
            'route': '/dashboard/mock-tests',
            'accent': 'from-violet-500 to-fuchsia-500',
            'category': 'Assessment',
        },
        {
            'id': 'ai-strategy',
            'title': 'AI Exam Strategy Advisor',
            'description': 'Daily tactics, weak-topic triage, and revision sequencing.',
            'route': '/dashboard/ai-tutor',
            'accent': 'from-cyan-400 to-blue-500',
            'category': 'AI',
        },
        {
            'id': 'syllabus-notes',
            'title': 'Syllabus Notes',
            'description': 'Generate topic notes and formula sheets from the syllabus.',
            'route': '/dashboard/notes',
            'accent': 'from-emerald-400 to-teal-500',
            'category': 'Content',
        },
        {
            'id': 'study-plan',
            'title': 'Adaptive Study Planner',
            'description': 'Roadmap auto-adjusts using exam date and available hours.',
            'route': '/dashboard/planner',
            'accent': 'from-amber-400 to-orange-500',
            'category': 'Planning',
        },
    ],
    'school_learning': [
        {
            'id': 'subject-notes',
            'title': 'Subject Notes Generator',
            'description': 'Generate chapter summaries, examples, and revision points.',
            'route': '/dashboard/notes',
            'accent': 'from-cyan-400 to-sky-500',
            'category': 'Content',
        },
        {
            'id': 'practice-quizzes',
            'title': 'Practice Quizzes',
            'description': 'Topic-based quizzes and AI explanations for weak answers.',
            'route': '/dashboard/analytics',
            'accent': 'from-violet-500 to-indigo-500',
            'category': 'Assessment',
        },
        {
            'id': 'planner',
            'title': 'Homework Planner',
            'description': 'Balance school homework, revision, and test preparation.',
            'route': '/dashboard/planner',
            'accent': 'from-emerald-400 to-teal-500',
            'category': 'Planning',
        },
    ],
    'college_courses': [
        {
            'id': 'lecture-companion',
            'title': 'AI Lecture Companion',
            'description': 'Lecture summaries, topic maps, and assignment breakdowns.',
            'route': '/dashboard/notes',
            'accent': 'from-cyan-400 to-sky-500',
            'category': 'Content',
        },
        {
            'id': 'mentor-mode',
            'title': 'AI Mentor Mode',
            'description': 'Explains concepts, supports coursework, and builds weekly targets.',
            'route': '/dashboard/ai-tutor',
            'accent': 'from-violet-500 to-fuchsia-500',
            'category': 'AI',
        },
        {
            'id': 'analytics',
            'title': 'Course Analytics',
            'description': 'Track topic coverage, consistency, and project milestones.',
            'route': '/dashboard/analytics',
            'accent': 'from-amber-400 to-orange-500',
            'category': 'Analytics',
        },
    ],
    'language_learning': [
        {
            'id': 'vocabulary-lessons',
            'title': 'Vocabulary Lessons',
            'description': 'Progressive memory-based word training with review loops.',
            'route': '/dashboard/notes',
            'accent': 'from-pink-400 to-rose-500',
            'category': 'Language',
        },
        {
            'id': 'speaking-practice',
            'title': 'Speaking Practice',
            'description': 'Whisper-ready speaking drills with pronunciation scoring hooks.',
            'route': '/dashboard/ai-tutor',
            'accent': 'from-cyan-400 to-blue-500',
            'category': 'Voice',
        },
        {
            'id': 'grammar-lab',
            'title': 'Grammar Lab',
            'description': 'Daily grammar challenges and translation exercises.',
            'route': '/dashboard/notes',
            'accent': 'from-violet-500 to-indigo-500',
            'category': 'Language',
        },
        {
            'id': 'listening-planner',
            'title': 'Listening Planner',
            'description': 'Schedule listening quizzes, speaking blocks, and spaced review.',
            'route': '/dashboard/planner',
            'accent': 'from-emerald-400 to-teal-500',
            'category': 'Planning',
        },
    ],
    'skill_learning': [
        {
            'id': 'roadmap-builder',
            'title': 'Personal Curriculum Builder',
            'description': 'Turn your track into a weekly roadmap with projects and drills.',
            'route': '/dashboard/planner',
            'accent': 'from-cyan-400 to-blue-500',
            'category': 'Planning',
        },
        {
            'id': 'mentor-mode',
            'title': 'AI Mentor Mode',
            'description': 'Project coaching, mistake pattern detection, and next-step advice.',
            'route': '/dashboard/ai-tutor',
            'accent': 'from-violet-500 to-fuchsia-500',
            'category': 'AI',
        },
        {
            'id': 'practice-lab',
            'title': 'Adaptive Practice',
            'description': 'Topic practice loops with analytics and revision memory.',
            'route': '/dashboard/mock-tests',
            'accent': 'from-amber-400 to-orange-500',
            'category': 'Practice',
        },
    ],
    'general_knowledge': [
        {
            'id': 'research-mode',
            'title': 'Internet Research Mode',
            'description': 'Blend open sources with Gemini-generated concise summaries.',
            'route': '/dashboard/notes',
            'accent': 'from-cyan-400 to-blue-500',
            'category': 'Research',
        },
        {
            'id': 'companion-brief',
            'title': 'AI Daily Brief',
            'description': 'Curated knowledge sprints, flashcards, and quiz prompts.',
            'route': '/dashboard',
            'accent': 'from-violet-500 to-fuchsia-500',
            'category': 'AI',
        },
        {
            'id': 'knowledge-analytics',
            'title': 'Progress Analytics',
            'description': 'See where your reading and quiz history is strongest.',
            'route': '/dashboard/analytics',
            'accent': 'from-emerald-400 to-teal-500',
            'category': 'Analytics',
        },
    ],
}


class LearningProfileService:
    def __init__(self):
        self.demo_mode = get_settings().DEMO_MODE
        self.client = None if self.demo_mode else get_supabase_admin_client()

    def get_onboarding_options(self) -> dict:
        return {
            'goals': GOAL_OPTIONS,
            'competitive_exams': COMPETITIVE_EXAMS,
            'school_subjects': SCHOOL_SUBJECTS,
            'college_majors': COLLEGE_MAJORS,
            'skill_tracks': SKILL_TRACKS,
            'languages': LANGUAGES,
            'skill_levels': SKILL_LEVELS,
        }

    def get_profile(self, user_id: str) -> dict | None:
        if self.demo_mode:
            rows = list_rows('learning_profiles', predicate=lambda row: row['user_id'] == user_id, limit=1)
            return rows[0] if rows else None

        response = self.client.table('user_learning_profile').select('*').eq('user_id', user_id).limit(1).execute()
        return response.data[0] if response.data else None

    def upsert_profile(self, user_id: str, payload: LearningProfileUpsertRequest) -> dict:
        goal_type = payload.goal_type
        uses_subjects = goal_type in {'school_learning', 'competitive_exams', 'general_knowledge'}
        focus_modules = [module['id'] for module in MODULE_MAP[goal_type]]
        row = {
            'user_id': user_id,
            'goal_type': goal_type,
            'exam_name': payload.exam_name if goal_type == 'competitive_exams' else None,
            'school_grade': payload.school_grade if goal_type == 'school_learning' else None,
            'degree_type': payload.degree_type if goal_type == 'college_courses' else None,
            'major_subject': payload.major_subject if goal_type == 'college_courses' else None,
            'subjects': payload.subjects if uses_subjects else [],
            'language': payload.language if goal_type == 'language_learning' else None,
            'skill_track': payload.skill_track if goal_type == 'skill_learning' else None,
            'skill_level': payload.skill_level,
            'study_hours': payload.study_hours,
            'onboarding_completed': True,
            'focus_modules': focus_modules,
            'preferences': payload.preferences,
            'updated_at': utc_now_iso(),
        }

        existing = self.get_profile(user_id)
        if self.demo_mode:
            if existing:
                updated = update_row(
                    'learning_profiles',
                    predicate=lambda existing_row: existing_row['user_id'] == user_id,
                    updates=row,
                )
                return updated or {**existing, **row}

            row['created_at'] = utc_now_iso()
            return insert_row('learning_profiles', row)

        if existing:
            response = self.client.table('user_learning_profile').update(row).eq('user_id', user_id).execute()
            return response.data[0] if response.data else {**existing, **row}

        row['created_at'] = utc_now_iso()
        response = self.client.table('user_learning_profile').insert(row).execute()
        if not response.data:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='Failed to save profile')
        return response.data[0]

    def build_dashboard(self, profile: dict) -> dict:
        goal_type = profile['goal_type']
        modules = MODULE_MAP.get(goal_type, MODULE_MAP['general_knowledge'])
        focus_tracks = self._focus_tracks(profile)
        hero_title, hero_subtitle = self._hero_copy(profile, focus_tracks)
        return {
            'profile': profile,
            'hero_title': hero_title,
            'hero_subtitle': hero_subtitle,
            'focus_tracks': focus_tracks,
            'modules': modules,
        }

    def build_language_path(self, profile: dict) -> dict:
        if profile.get('goal_type') != 'language_learning':
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Profile is not in language mode')

        language = profile.get('language') or 'Spanish'
        skill_level = profile.get('skill_level') or 'beginner'
        if language.lower() == 'japanese' and skill_level == 'beginner':
            return {
                'language': language,
                'skill_level': skill_level,
                'lessons': [
                    {
                        'id': 'jp-hiragana',
                        'lesson_type': 'alphabet',
                        'title': 'Hiragana foundations',
                        'description': 'Master the full hiragana chart, stroke order, and the first 46 sounds before moving to words.',
                        'duration_minutes': 18,
                        'difficulty': skill_level,
                    },
                    {
                        'id': 'jp-katakana',
                        'lesson_type': 'alphabet',
                        'title': 'Katakana survival kit',
                        'description': 'Learn katakana for loanwords, menus, and common beginner reading tasks.',
                        'duration_minutes': 18,
                        'difficulty': skill_level,
                    },
                    {
                        'id': 'jp-greetings',
                        'lesson_type': 'vocabulary',
                        'title': 'Daily greetings and self-introduction',
                        'description': 'Build your first conversation set: greetings, name, nationality, and polite responses.',
                        'duration_minutes': 14,
                        'difficulty': skill_level,
                    },
                    {
                        'id': 'jp-particles',
                        'lesson_type': 'grammar',
                        'title': 'Particles starter pack',
                        'description': 'Understand wa, ga, o, ni, and de through short sentence patterns and translation drills.',
                        'duration_minutes': 16,
                        'difficulty': skill_level,
                    },
                    {
                        'id': 'jp-verbs',
                        'lesson_type': 'grammar',
                        'title': 'Polite verb patterns',
                        'description': 'Practice desu, masu, masen, and common daily verbs with beginner conjugation reps.',
                        'duration_minutes': 15,
                        'difficulty': skill_level,
                    },
                    {
                        'id': 'jp-listening',
                        'lesson_type': 'listening',
                        'title': 'Slow Japanese listening loop',
                        'description': 'Shadow beginner dialogues and train your ear with repeat-after-audio comprehension checks.',
                        'duration_minutes': 12,
                        'difficulty': skill_level,
                    },
                    {
                        'id': 'jp-speaking',
                        'lesson_type': 'speaking',
                        'title': 'Pronunciation and shadowing',
                        'description': 'Use Whisper-style speaking checks to practice pitch, rhythm, and clear mora timing.',
                        'duration_minutes': 12,
                        'difficulty': skill_level,
                    },
                    {
                        'id': 'jp-kanji',
                        'lesson_type': 'kanji',
                        'title': 'First kanji set',
                        'description': 'Start with numbers, days, people, and common nouns so reading practice becomes less intimidating.',
                        'duration_minutes': 14,
                        'difficulty': skill_level,
                    },
                ],
                'roadmap': [
                    {'day': 'Day 1', 'title': 'Hiragana and sounds', 'objective': 'Finish the base hiragana chart and read simple syllables without romaji.'},
                    {'day': 'Day 2', 'title': 'Katakana and loanwords', 'objective': 'Read common katakana words and spot familiar English-origin vocabulary.'},
                    {'day': 'Day 3', 'title': 'Greetings and self-introduction', 'objective': 'Say your name, nationality, and basic greetings in polite Japanese.'},
                    {'day': 'Day 4', 'title': 'Particles and sentence order', 'objective': 'Build short sentences using wa, o, and ni with confidence.'},
                    {'day': 'Day 5', 'title': 'Polite verbs', 'objective': 'Use desu and masu forms for everyday statements and questions.'},
                    {'day': 'Day 6', 'title': 'Listening and shadowing', 'objective': 'Repeat short dialogues and understand key phrases without pausing every line.'},
                    {'day': 'Day 7', 'title': 'Kanji and review', 'objective': 'Learn the first kanji pack and review the full week with a quiz and flashcards.'},
                ],
                'survival_pack': [
                    'konnichiwa - hello',
                    'arigatou gozaimasu - thank you',
                    'sumimasen - excuse me / sorry',
                    'hai / iie - yes / no',
                    'watashi wa ... desu - I am ...',
                    'kore wa nan desu ka - what is this?',
                    'mou ichido onegaishimasu - please say it again',
                    'wakarimasen - I do not understand',
                ],
                'resource_links': [
                    {
                        'source': 'NHK World',
                        'title': 'Easy Japanese',
                        'description': 'Structured beginner dialogues, audio, and phrase lessons from NHK.',
                        'url': 'https://www.nhk.or.jp/lesson/en/',
                    },
                    {
                        'source': 'Tae Kim',
                        'title': 'Guide to Japanese',
                        'description': 'A free grammar guide that starts from kana and builds beginner sentence patterns.',
                        'url': 'https://guidetojapanese.org/learn/',
                    },
                    {
                        'source': 'Tofugu',
                        'title': 'Learn Hiragana',
                        'description': 'Detailed mnemonics and memorization approach for hiragana.',
                        'url': 'https://www.tofugu.com/japanese/learn-hiragana/',
                    },
                    {
                        'source': 'Tofugu',
                        'title': 'Learn Katakana',
                        'description': 'Beginner-friendly katakana guide with mnemonics and practice.',
                        'url': 'https://www.tofugu.com/japanese/learn-katakana/',
                    },
                    {
                        'source': 'Jisho',
                        'title': 'Japanese Dictionary',
                        'description': 'Search vocabulary, kanji, example sentences, and stroke order details.',
                        'url': 'https://jisho.org/',
                    },
                    {
                        'source': 'Wasabi',
                        'title': 'Japanese Grammar Reference',
                        'description': 'Clear grammar references and example sentences for beginners.',
                        'url': 'https://www.wasabi-jpn.com/japanese-grammar/',
                    },
                    {
                        'source': "Erin's Challenge",
                        'title': 'Conversation lessons',
                        'description': 'Video-based Japanese conversation and cultural context for beginners.',
                        'url': 'https://www.erin.jpf.go.jp/en/',
                    },
                    {
                        'source': 'Marugoto',
                        'title': 'Starter learning portal',
                        'description': 'Japanese Foundation beginner learning portal with course guidance and self-study support.',
                        'url': 'https://www.marugoto-online.jp/info/',
                    },
                ],
            }

        lessons = [
            {
                'id': 'vocab-core',
                'lesson_type': 'vocabulary',
                'title': f'{language} core vocabulary sprint',
                'description': 'Learn high-frequency terms with spaced repetition flashcards.',
                'duration_minutes': 12,
                'difficulty': skill_level,
            },
            {
                'id': 'speak-loop',
                'lesson_type': 'speaking',
                'title': f'{language} speaking loop',
                'description': 'Pronunciation prompts designed for Whisper scoring and Coqui playback.',
                'duration_minutes': 10,
                'difficulty': skill_level,
            },
            {
                'id': 'grammar-grid',
                'lesson_type': 'grammar',
                'title': f'{language} grammar builder',
                'description': 'Pattern drills for sentence structure and conjugation.',
                'duration_minutes': 14,
                'difficulty': skill_level,
            },
            {
                'id': 'listen-quiz',
                'lesson_type': 'listening',
                'title': f'{language} listening quiz',
                'description': 'Listening prompts followed by comprehension and translation tasks.',
                'duration_minutes': 10,
                'difficulty': skill_level,
            },
        ]
        return {'language': language, 'skill_level': skill_level, 'lessons': lessons, 'roadmap': [], 'survival_pack': [], 'resource_links': []}

    def require_profile(self, user_id: str) -> dict:
        profile = self.get_profile(user_id)
        if not profile:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Learning profile not found')
        return profile

    def _focus_tracks(self, profile: dict) -> list[str]:
        goal_type = profile.get('goal_type')
        if goal_type == 'language_learning':
            language = profile.get('language') or 'Language learning'
            return [language, 'Vocabulary', 'Speaking', 'Listening']
        if goal_type == 'skill_learning':
            track = profile.get('skill_track') or 'Skill learning'
            return [track, 'Projects', 'Practice', 'Review']
        if profile.get('subjects'):
            return profile['subjects'][:4]

        values = [
            profile.get('exam_name'),
            profile.get('major_subject'),
            profile.get('language'),
            profile.get('skill_track'),
            profile.get('goal_type', '').replace('_', ' ').title(),
        ]
        return [value for value in values if value][:4]

    def _hero_copy(self, profile: dict, focus_tracks: list[str]) -> tuple[str, str]:
        goal = profile['goal_type']
        if goal == 'competitive_exams':
            exam = profile.get('exam_name') or 'Exam'
            return (
                f'{exam} command center',
                'Mock tests, syllabus-aware notes, and revision sequencing are now aligned to your exam goal.',
            )
        if goal == 'language_learning':
            language = profile.get('language') or 'your target language'
            return (
                f'{language} fluency runway',
                'Speaking practice, vocabulary drills, grammar loops, and listening workouts are now your primary track.',
            )
        if goal == 'school_learning':
            grade = profile.get('school_grade') or 'school'
            return (
                f'Grade {grade} study cockpit',
                'Notes, quizzes, planner blocks, and AI tutor sessions are tuned to your school subjects.',
            )
        if goal == 'college_courses':
            major = profile.get('major_subject') or 'your course'
            return (
                f'{major} learning workspace',
                'Lecture support, coursework planning, and concept mentoring are staged for your college track.',
            )
        if goal == 'skill_learning':
            track = profile.get('skill_track') or 'your skill path'
            return (
                f'{track} growth board',
                'Projects, practice loops, and mentor-mode guidance are staged into an adaptive curriculum.',
            )
        track_label = ', '.join(focus_tracks[:2]) if focus_tracks else 'knowledge sprints'
        return (
            'General knowledge studio',
            f'Curated resources, AI summaries, and flashcard-friendly exploration are centered on {track_label}.',
        )
