from __future__ import annotations

from uuid import uuid4

from app.services.helpers import utc_now_iso

_demo_tables: dict[str, list[dict]] = {
    'learning_profiles': [],
    'gamification_profiles': [],
    'gamification_events': [],
    'daily_challenges': [],
    'study_missions': [],
    'achievements': [],
    'study_sessions': [],
    'study_tasks': [],
    'quiz_results': [],
    'mock_test_results': [],
    'weak_topics': [],
    'game_scores': [],
}


def insert_row(table_name: str, row: dict, *, with_created_at: bool = False) -> dict:
    record = dict(row)
    record.setdefault('id', str(uuid4()))
    if with_created_at and 'created_at' not in record:
        record['created_at'] = utc_now_iso()
    _demo_tables[table_name].append(record)
    return dict(record)


def list_rows(
    table_name: str,
    *,
    predicate=None,
    order_by: str | None = None,
    desc: bool = False,
    limit: int | None = None,
) -> list[dict]:
    rows = [dict(row) for row in _demo_tables[table_name] if predicate is None or predicate(row)]
    if order_by:
        rows.sort(key=lambda row: row.get(order_by) or '', reverse=desc)
    if limit is not None:
        rows = rows[:limit]
    return rows


def update_row(table_name: str, *, predicate, updates: dict) -> dict | None:
    for index, row in enumerate(_demo_tables[table_name]):
        if predicate(row):
            updated = {**row, **updates}
            _demo_tables[table_name][index] = updated
            return dict(updated)
    return None


def delete_row(table_name: str, *, predicate) -> bool:
    for index, row in enumerate(_demo_tables[table_name]):
        if predicate(row):
            del _demo_tables[table_name][index]
            return True
    return False


def upsert_weak_topic(row: dict) -> dict:
    for index, existing in enumerate(_demo_tables['weak_topics']):
        if (
            existing['user_id'] == row['user_id']
            and existing['subject'] == row['subject']
            and existing['topic'] == row['topic']
        ):
            updated = {**existing, **row}
            updated.setdefault('id', existing.get('id', str(uuid4())))
            _demo_tables['weak_topics'][index] = updated
            return dict(updated)

    return insert_row('weak_topics', row)
