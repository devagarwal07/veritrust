from __future__ import annotations
from typing import Dict, Any

from db.mongo import find_by_hash, save_verification_log


# Very simple duplicate detection using stored logs

def check_fraud(user_id: str, id_hash: str, face_hash: str) -> Dict[str, Any]:
    # If same id_hash or face_hash is seen for other users, flag
    reason = None
    flagged = False

    id_matches = [d for d in find_by_hash("id_hash", id_hash) if d.get("user_id") != user_id]
    face_matches = [d for d in find_by_hash("face_hash", face_hash) if d.get("user_id") != user_id]

    if id_matches:
        flagged = True
        reason = "ID reused by another user"
    elif face_matches:
        flagged = True
        reason = "Face reused by another user"

    # Store the hashes for this user for future checks (idempotent-ish)
    save_verification_log(user_id, {"id_hash": id_hash, "face_hash": face_hash}, kind="fraud-index")

    return {"fraud_flag": flagged, "reason": reason}
