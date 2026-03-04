from app.services.ai_service import AIService


class RecommendationService:
    def __init__(self):
        self.ai = AIService()

    def weekly_report(self, weak_topics: list[dict]) -> str:
        return self.ai.study_recommendations(weak_topics)
