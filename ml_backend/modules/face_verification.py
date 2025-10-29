from __future__ import annotations
from typing import Dict, Any

from core.utils import deterministic_score_from_strings, fetch_bytes

try:
    import cv2  # type: ignore
    from deepface import DeepFace  # type: ignore
except Exception:  # pragma: no cover
    cv2 = None  # type: ignore
    DeepFace = None  # type: ignore


DEFAULT_THRESHOLD = 0.6


def verify_face_and_liveness(id_image_url: str, selfie_url: str) -> Dict[str, Any]:
    """Deterministic placeholder face verification & liveness.
    If ML libs available, could be extended to do real embedding comparisons.
    """
    # Deterministic score for stable frontend integration
    score = deterministic_score_from_strings(id_image_url, selfie_url)
    match = score >= DEFAULT_THRESHOLD

    # Very simple liveness heuristic: if bytes fetched and size>0, mark true; else fall back to hash-based
    live = False
    id_bytes = fetch_bytes(id_image_url)
    selfie_bytes = fetch_bytes(selfie_url)
    if id_bytes and selfie_bytes:
        live = True
    else:
        live = deterministic_score_from_strings(selfie_url) > 0.2

    return {
        "match": match,
        "face_match_score": round(float(score), 4),
        "liveness": live,
    }
