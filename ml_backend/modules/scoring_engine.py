from __future__ import annotations
from typing import Dict, Any


def compute_credit_and_risk(kyc_valid: bool, income: float, tx_per_week: int, fraud_flags: int, trust_score: int) -> Dict[str, Any]:
    # Start with base
    score = 600

    # Income contribution (diminishing)
    score += min(int(income / 1000) * 5, 150)  # up to +150 for high income

    # Activity contribution
    score += min(tx_per_week * 4, 80)  # up to +80

    # Trust score contribution
    score += int((trust_score - 50) * 2)  # -100..+100

    # KYC validity bonus/penalty
    score += 30 if kyc_valid else -60

    # Fraud penalties
    score -= fraud_flags * 50

    # Clamp to 300..850
    score = max(300, min(850, score))

    # Risk label
    if score >= 750:
        label = "Low Risk"
    elif score >= 650:
        label = "Medium Risk"
    else:
        label = "High Risk"

    return {"credit_score": int(score), "risk_label": label, "trust_score": trust_score}
