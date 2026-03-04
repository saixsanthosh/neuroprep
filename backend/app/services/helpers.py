from datetime import date, datetime, timezone


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def to_iso_date(value: date | None) -> str:
    return (value or datetime.now(timezone.utc).date()).isoformat()
