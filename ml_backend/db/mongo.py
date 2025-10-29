from __future__ import annotations
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from core.config import get_settings

try:
    from pymongo import MongoClient  # type: ignore
    from pymongo.collection import Collection  # type: ignore
except Exception:  # pragma: no cover
    MongoClient = None  # type: ignore
    Collection = None  # type: ignore

_settings = get_settings()
_client: Optional[Any] = None
_in_memory_logs: list[dict[str, Any]] = []


def get_collection(name: str = "verifications") -> Optional[Any]:
    global _client
    if MongoClient is None:
        return None
    try:
        if _client is None:
            _client = MongoClient(_settings.mongo_uri, serverSelectionTimeoutMS=1500)
            # ping to confirm
            _client.admin.command("ping")
        db = _client[_settings.mongo_db]
        return db[name]
    except Exception:
        return None


def save_verification_log(user_id: str, payload: Dict[str, Any], kind: str) -> None:
    doc = {
        "user_id": user_id,
        "kind": kind,
        **payload,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    col = get_collection("verifications")
    if col is None:
        # fallback to in-memory log to avoid breaking local runs
        _in_memory_logs.append(doc)
        return
    try:
        col.insert_one(doc)
    except Exception:
        _in_memory_logs.append(doc)


def find_by_hash(hash_key: str, value: str) -> list[dict[str, Any]]:
    col = get_collection("verifications")
    if col is None:
        return [x for x in _in_memory_logs if x.get(hash_key) == value]
    try:
        return list(col.find({hash_key: value}))
    except Exception:
        return [x for x in _in_memory_logs if x.get(hash_key) == value]
