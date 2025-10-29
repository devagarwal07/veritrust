from __future__ import annotations
import hashlib
import json
from typing import Any, Optional

try:
    import requests  # type: ignore
except Exception:  # pragma: no cover
    requests = None  # fallback if not installed yet


def safe_json_dumps(data: dict[str, Any]) -> str:
    return json.dumps(data, sort_keys=True, separators=(",", ":"))


def make_proof_hash(data: dict[str, Any]) -> str:
    serialized = safe_json_dumps(data).encode()
    return "0x" + hashlib.sha256(serialized).hexdigest()


def fetch_bytes(url: str, timeout: float = 5.0) -> Optional[bytes]:
    """Download bytes from a URL if requests is available. Returns None on failure."""
    if not requests:
        return None
    try:
        resp = requests.get(url, timeout=timeout)
        if resp.status_code == 200:
            return resp.content
    except Exception:
        return None
    return None


def deterministic_score_from_strings(*parts: str) -> float:
    """Generate a deterministic pseudo-score in [0,1) from input strings."""
    h = hashlib.sha256("::".join(parts).encode()).hexdigest()
    # take first 8 hex chars as int and scale
    val = int(h[:8], 16)
    return (val % 10_000) / 10_000.0
