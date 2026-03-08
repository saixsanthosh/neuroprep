from collections import defaultdict

from app.core.config import get_settings
from app.database.supabase_client import get_supabase_admin_client
from app.schemas.games import GameScoreCreate
from app.services.demo_store import insert_row, list_rows


class GamesService:
    def __init__(self):
        self.demo_mode = get_settings().DEMO_MODE
        self.client = None if self.demo_mode else get_supabase_admin_client()

    def submit_score(self, user_id: str, username: str, payload: GameScoreCreate) -> dict:
        row = {
            'user_id': user_id,
            'game_name': payload.game_name,
            'score': payload.score,
        }
        if self.demo_mode:
            row['username'] = username
            return insert_row('game_scores', row, with_created_at=True)
        response = self.client.table('game_scores').insert(row).execute()
        return response.data[0]

    def leaderboard(self, limit: int = 20) -> list[dict]:
        if self.demo_mode:
            scores_rows = list_rows('game_scores', order_by='score', desc=True, limit=200)
            username_map = {
                row['user_id']: row.get('username', 'Unknown')
                for row in scores_rows
                if row.get('username')
            }
        else:
            scores_response = (
                self.client.table('game_scores')
                .select('user_id, score')
                .order('score', desc=True)
                .limit(200)
                .execute()
            )

            users_response = self.client.table('users').select('id, username').execute()
            scores_rows = scores_response.data or []
            username_map = {row['id']: row['username'] for row in (users_response.data or [])}

        best_scores = defaultdict(int)
        for row in scores_rows:
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
