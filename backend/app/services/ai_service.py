from __future__ import annotations

from statistics import mean

from app.core.config import get_settings

try:
    import google.generativeai as genai
except Exception:  # pragma: no cover - handled at runtime if dependency missing
    genai = None


class AIService:
    def __init__(self):
        self.settings = get_settings()
        self.has_gemini = bool(self.settings.GEMINI_API_KEY and genai is not None)

        if self.has_gemini:
            genai.configure(api_key=self.settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = None

    def _generate(self, prompt: str) -> str:
        if not self.model:
            return (
                'Gemini API key is not configured. This is a placeholder response. '
                'Set GEMINI_API_KEY in backend/.env to enable live generation.'
            )

        response = self.model.generate_content(prompt)
        return getattr(response, 'text', '').strip() or 'No response generated.'

    def tutor_chat(self, message: str, context: str | None = None) -> str:
        prompt = (
            'You are NeuroPrep AI Tutor. Provide clear, concise exam-oriented guidance with step-by-step logic.\n\n'
            f'Context: {context or "N/A"}\n'
            f'Student question: {message}\n'
            'Respond with actionable explanation.'
        )
        return self._generate(prompt)

    def generate_notes(self, topic: str, level: str = 'intermediate') -> str:
        prompt = (
            'Generate structured study notes for the topic below. Include:\n'
            '1) Concept explanation\n2) Formulas\n3) Examples\n4) Key points\n5) Summary\n\n'
            f'Topic: {topic}\n'
            f'Level: {level}'
        )
        return self._generate(prompt)

    def generate_quiz_questions(
        self,
        topic: str,
        subject: str,
        difficulty: str = 'medium',
        count: int = 5,
    ) -> list[str]:
        if not self.model:
            return [f'{subject} question {index + 1} on {topic} ({difficulty})' for index in range(count)]

        prompt = (
            f'Create {count} {difficulty} difficulty exam questions for {subject} on topic {topic}. '
            'Return each question on a new line, no answers.'
        )
        response_text = self._generate(prompt)

        questions = [line.strip(' -0123456789.') for line in response_text.splitlines() if line.strip()]
        if not questions:
            questions = [f'{subject} question {index + 1} on {topic}' for index in range(count)]

        return questions[:count]

    def analyze_weakness(
        self,
        subject: str,
        topic: str,
        quiz_scores: list[float],
        mock_scores: list[float],
        time_per_question: list[float],
    ) -> dict:
        avg_quiz = mean(quiz_scores) if quiz_scores else 0
        avg_mock = mean(mock_scores) if mock_scores else 0
        avg_time = mean(time_per_question) if time_per_question else 0

        score_component = max(0, 100 - ((avg_quiz * 0.6) + (avg_mock * 0.4)))
        speed_penalty = min(20, max(0, avg_time - 60) / 3)
        weakness_score = min(100, round(score_component + speed_penalty, 2))

        recommendation = self._generate(
            f'Subject: {subject}\nTopic: {topic}\nQuiz average: {avg_quiz}\nMock average: {avg_mock}\n'
            f'Average time per question: {avg_time}s\n'
            'Provide a short revision recommendation for this weak topic.'
        )

        focus_areas = [
            'Review core definitions and formulas',
            'Solve 30 mixed-difficulty practice problems',
            'Attempt one timed sectional test',
        ]

        return {
            'weakness_score': weakness_score,
            'recommendation': recommendation,
            'focus_areas': focus_areas,
        }

    def study_recommendations(self, weak_topics: list[dict]) -> str:
        topics_text = ', '.join([f"{item['subject']} - {item['topic']}" for item in weak_topics])
        return self._generate(
            'Create a one-week personalized study recommendation plan based on these weak topics: '
            f'{topics_text}'
        )
