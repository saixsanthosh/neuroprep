from __future__ import annotations

from urllib.parse import quote_plus

import httpx

from app.core.config import get_settings
from app.services.ai_service import AIService


class ResourceService:
    def __init__(self):
        self.settings = get_settings()
        self.ai = AIService()

    def recommended_resources(self, profile: dict, topic: str | None = None) -> dict:
        query = topic or self._derive_query(profile)
        resources = self._curated_resources(query, profile)
        strategy = 'curated_open_resources'

        tavily_results = self._tavily_results(query)
        if tavily_results:
            resources = tavily_results + resources
            strategy = 'tavily_plus_curated_open_resources'

        resources = resources[: self.settings.OPEN_RESOURCE_MAX_RESULTS]
        generated_notes = None
        if not resources:
            generated_notes = self.ai.generate_notes(query, profile.get('skill_level') or 'intermediate')
            strategy = 'gemini_generated_notes'

        return {
            'query': query,
            'source_strategy': strategy,
            'resources': resources,
            'generated_notes': generated_notes,
        }

    def _derive_query(self, profile: dict) -> str:
        values = [
            profile.get('exam_name'),
            profile.get('major_subject'),
            profile.get('language'),
            profile.get('skill_track'),
            *profile.get('subjects', []),
        ]
        query = next((value for value in values if value), None)
        return query or profile.get('goal_type', 'learning goals').replace('_', ' ')

    def _curated_resources(self, query: str, profile: dict) -> list[dict]:
        encoded = quote_plus(query)
        query_wiki = quote_plus(query.replace(' ', '_'))
        goal = profile.get('goal_type')
        resources = [
            {
                'source': 'Khan Academy',
                'title': f'Khan Academy search for {query}',
                'description': 'Free lessons and practice material from Khan Academy.',
                'url': f'https://www.khanacademy.org/search?page_search_query={encoded}',
                'category': 'lesson',
            },
            {
                'source': 'MIT OpenCourseWare',
                'title': f'MIT OpenCourseWare resources for {query}',
                'description': 'Open lecture notes, assignments, and course resources.',
                'url': f'https://ocw.mit.edu/search/?q={encoded}',
                'category': 'courseware',
            },
            {
                'source': 'OpenStax',
                'title': f'OpenStax textbook support for {query}',
                'description': 'Open textbook references that pair well with structured study notes.',
                'url': f'https://openstax.org/search?query={encoded}',
                'category': 'textbook',
            },
            {
                'source': 'Wikipedia',
                'title': f'Wikipedia primer for {query}',
                'description': 'Fast primer for concept overviews and connected topics.',
                'url': f'https://en.wikipedia.org/wiki/{query_wiki}',
                'category': 'reference',
            },
        ]
        if goal == 'language_learning':
            resources[0]['description'] = 'Vocabulary, grammar, and language practice references.'
            resources[1]['description'] = 'Open language and linguistics coursework references.'
        return resources

    def _tavily_results(self, query: str) -> list[dict]:
        if not self.settings.TAVILY_API_KEY:
            return []

        body = {
            'api_key': self.settings.TAVILY_API_KEY,
            'query': query,
            'search_depth': 'basic',
            'topic': 'general',
            'max_results': 3,
        }
        try:
            with httpx.Client(timeout=8.0) as client:
                response = client.post('https://api.tavily.com/search', json=body)
                response.raise_for_status()
                payload = response.json()
        except Exception:
            return []

        results = []
        for item in payload.get('results', []):
            results.append(
                {
                    'source': item.get('site_name') or 'Tavily',
                    'title': item.get('title') or query,
                    'description': item.get('content') or 'Web result returned by Tavily.',
                    'url': item.get('url') or 'https://tavily.com',
                    'category': 'web',
                }
            )
        return results
