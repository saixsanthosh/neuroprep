from collections import defaultdict

from app.database.supabase_client import get_supabase_admin_client
from app.schemas.games import GameScoreCreate


class GamesService:
    def __init__(self):
        self.client = get_supabase_admin_client()

    def submit_score(self, user_id: str, payload: GameScoreCreate) -> dict:
        row = {
            'user_id': user_id,
            'game_name': payload.game_name,
            'score': payload.score,
        }
        response = self.client.table('game_scores').insert(row).execute()
        return response.data[0]

    def leaderboard(self, limit: int = 20) -> list[dict]:
        scores_response = (
            self.client.table('game_scores')
            .select('user_id, score')
            .order('score', desc=True)
            .limit(200)
            .execute()
        )

        users_response = self.client.table('users').select('id, username').execute()
        username_map = {row['id']: row['username'] for row in (users_response.data or [])}

        best_scores = defaultdict(int)
        for row in scores_response.data or []:
            user_id = row['user_id']
            score = int(row['score'])
            best_scores[user_id] = max(best_scores[user_id], score)

        ranked = sorted(best_scores.items(), key=lambda item: item[1], reverse=True)[:limit]
        return [
            {
                'user_id': user_id,
                'username': username_map.get(user_id, 'Unknown'),
                'score': score,
            }
            for user_id, score in ranked
        ]
