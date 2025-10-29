from __future__ import annotations
from typing import Optional

from fastapi import FastAPI, Depends, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from core.config import get_settings
from core.utils import make_proof_hash
from db.mongo import save_verification_log
from models.schemas import (
    FaceVerifyRequest, FaceVerifyResponse,
    DocumentVerifyRequest, DocumentVerifyResponse, DocumentFields,
    CreditScoreRequest, CreditScoreResponse,
    FraudCheckRequest, FraudCheckResponse,
    ApiError,
)
from modules.face_verification import verify_face_and_liveness
from modules.document_verification import extract_and_validate
from modules.scoring_engine import compute_credit_and_risk
from modules.fraud_detection import check_fraud

settings = get_settings()

app = FastAPI(title="VeriTrust+ ML Backend", version="0.1.0")

# CORS (dev-friendly defaults)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def auth_dependency(authorization: Optional[str] = Header(default=None)) -> None:
    """Very light auth placeholder.
    If DISABLE_AUTH=true, allows all. Otherwise requires a Bearer token header.
    Integration with Clerk JWT validation can be added here later.
    """
    if settings.disable_auth:
        return
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing or invalid Authorization header")
    # TODO: validate JWT with Clerk JWKS
    return


@app.get("/health")
async def health() -> dict:
    return {"status": "ok", "version": app.version}


@app.post("/verify/face", response_model=FaceVerifyResponse, responses={400: {"model": ApiError}})
async def verify_face(req: FaceVerifyRequest, _auth: None = Depends(auth_dependency)):
    if not req.id_image_url or not req.selfie_url:
        raise HTTPException(status_code=400, detail="id_image_url and selfie_url are required")

    result = verify_face_and_liveness(req.id_image_url, req.selfie_url)

    payload = {
        "match": bool(result["match"]),
        "face_match_score": float(result["face_match_score"]),
        "liveness": bool(result["liveness"]),
    }
    proof_hash = make_proof_hash({**payload, "user_id": req.user_id, "endpoint": "/verify/face"})

    save_verification_log(req.user_id, {**payload, "proof_hash": proof_hash}, kind="face")
    return {**payload, "proof_hash": proof_hash}


@app.post("/verify/document", response_model=DocumentVerifyResponse, responses={400: {"model": ApiError}})
async def verify_document(req: DocumentVerifyRequest, _auth: None = Depends(auth_dependency)):
    if not req.doc_url:
        raise HTTPException(status_code=400, detail="doc_url is required")

    result = extract_and_validate(req.doc_url, req.expected_name)

    fields = DocumentFields(**result.get("fields", {}))
    payload = {
        "fields": fields.model_dump(),
        "doc_valid": bool(result["doc_valid"]),
        "tampered": bool(result["tampered"]),
    }
    proof_hash = make_proof_hash({**payload, "user_id": req.user_id, "endpoint": "/verify/document"})

    save_verification_log(req.user_id, {**payload, "proof_hash": proof_hash}, kind="document")
    return {**payload, "proof_hash": proof_hash}


@app.post("/score/credit", response_model=CreditScoreResponse, responses={400: {"model": ApiError}})
async def score_credit(req: CreditScoreRequest, _auth: None = Depends(auth_dependency)):
    result = compute_credit_and_risk(
        kyc_valid=req.kyc_valid,
        income=req.income,
        tx_per_week=req.transactions_per_week,
        fraud_flags=req.fraud_flags,
        trust_score=req.trust_score,
    )

    payload = {
        "credit_score": int(result["credit_score"]),
        "risk_label": str(result["risk_label"]),
        "trust_score": int(result["trust_score"]),
    }
    proof_hash = make_proof_hash({**payload, "user_id": req.user_id, "endpoint": "/score/credit"})

    save_verification_log(req.user_id, {**payload, "proof_hash": proof_hash}, kind="score")
    return {**payload, "proof_hash": proof_hash}


@app.post("/fraud/check", response_model=FraudCheckResponse, responses={400: {"model": ApiError}})
async def fraud_check(req: FraudCheckRequest, _auth: None = Depends(auth_dependency)):
    if not req.id_hash or not req.face_hash:
        raise HTTPException(status_code=400, detail="id_hash and face_hash are required")

    result = check_fraud(req.user_id, req.id_hash, req.face_hash)

    save_verification_log(req.user_id, {**result}, kind="fraud-check")
    return result


# Uvicorn entry (optional):
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
