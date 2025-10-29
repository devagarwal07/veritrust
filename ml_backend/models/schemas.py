from __future__ import annotations
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


# Requests
class FaceVerifyRequest(BaseModel):
    user_id: str
    id_image_url: str
    selfie_url: str


class DocumentVerifyRequest(BaseModel):
    user_id: str
    doc_url: str
    expected_name: Optional[str] = None


class CreditScoreRequest(BaseModel):
    user_id: str
    kyc_valid: bool
    income: float = Field(ge=0)
    transactions_per_week: int = Field(ge=0)
    fraud_flags: int = Field(ge=0)
    trust_score: int = Field(ge=0, le=100)


class FraudCheckRequest(BaseModel):
    user_id: str
    id_hash: str
    face_hash: str


# Responses
class FaceVerifyResponse(BaseModel):
    match: bool
    face_match_score: float
    liveness: bool
    proof_hash: str


class DocumentFields(BaseModel):
    name: Optional[str] = None
    dob: Optional[str] = None
    id_number: Optional[str] = None


class DocumentVerifyResponse(BaseModel):
    fields: DocumentFields
    doc_valid: bool
    tampered: bool
    proof_hash: str


class CreditScoreResponse(BaseModel):
    credit_score: int
    risk_label: str
    trust_score: int
    proof_hash: str


class FraudCheckResponse(BaseModel):
    fraud_flag: bool
    reason: Optional[str] = None


class ApiError(BaseModel):
    detail: str
