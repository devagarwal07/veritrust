from __future__ import annotations
from typing import Dict, Any, Optional

from core.utils import deterministic_score_from_strings

try:
    import easyocr  # type: ignore
except Exception:  # pragma: no cover
    easyocr = None  # type: ignore

try:
    import pytesseract  # type: ignore
except Exception:  # pragma: no cover
    pytesseract = None  # type: ignore


# Placeholder OCR + validation

def extract_and_validate(doc_url: str, expected_name: Optional[str]) -> Dict[str, Any]:
    # We return stable placeholders; real OCR wiring can be added when deps are ready
    # For demo: consider doc valid if an expected_name is provided
    doc_valid = bool(expected_name)
    tampered = False

    # Fake ID number derived from URL hash for determinism
    h = deterministic_score_from_strings(doc_url)
    id_number = f"{int(h*9999):04d}-{int(h*8888):04d}-{int(h*7777):04d}"

    fields = {
        "name": expected_name,
        "dob": None,
        "id_number": id_number,
    }

    return {
        "fields": fields,
        "doc_valid": doc_valid,
        "tampered": tampered,
    }
