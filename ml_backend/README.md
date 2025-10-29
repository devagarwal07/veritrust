# VeriTrust+ ML Backend (Starter)

FastAPI-based modular ML backend designed to plug into a Next.js + Clerk frontend. Implements the contracts from the ML PRD with deterministic placeholder logic so the frontend team can integrate immediately.

## What’s included

- Endpoints
  - POST /verify/face → match, face_match_score, liveness, proof_hash
  - POST /verify/document → fields, doc_valid, tampered, proof_hash
  - POST /score/credit → credit_score, risk_label, trust_score, proof_hash
  - POST /fraud/check → fraud_flag, reason
- Deterministic placeholder ML logic (no heavy deps required to start)
- Proof hashing of results (SHA-256 of result JSON)
- MongoDB logging with graceful in-memory fallback
- Auth placeholder (DISABLE_AUTH=true by default for local dev)

## Folder structure

```
ml_backend/
├── main.py
├── requirements.txt
├── .env.example
├── core/
│   ├── config.py
│   └── utils.py
├── modules/
│   ├── face_verification.py
│   ├── document_verification.py
│   ├── scoring_engine.py
│   └── fraud_detection.py
├── models/
│   └── schemas.py
└── db/
    └── mongo.py
```

## Quickstart (Windows PowerShell)

1) Create venv and install packages

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

2) Configure env (optional)

```powershell
copy .env.example .env
# Edit .env to point to your Mongo if desired
```

3) Run the server

```powershell
uvicorn main:app --reload
```

Visit: http://127.0.0.1:8000/docs

## Example requests

```jsonc
POST /verify/face
{
  "user_id": "clerk_user_id",
  "id_image_url": "https://res.cloudinary.com/demo/image/upload/id.jpg",
  "selfie_url": "https://res.cloudinary.com/demo/image/upload/selfie.jpg"
}
```

```jsonc
POST /verify/document
{
  "user_id": "clerk_user_id",
  "doc_url": "https://res.cloudinary.com/demo/image/upload/aadhaar.jpg",
  "expected_name": "Dev Agarwal"
}
```

```jsonc
POST /score/credit
{
  "user_id": "clerk_user_id",
  "kyc_valid": true,
  "income": 45000,
  "transactions_per_week": 8,
  "fraud_flags": 0,
  "trust_score": 88
}
```

```jsonc
POST /fraud/check
{
  "user_id": "clerk_user_id",
  "id_hash": "0x45f1...",
  "face_hash": "0x98e2..."
}
```

## Notes

- Heavy ML libraries are listed in `requirements.txt` but the current code runs with placeholders if they’re not installed.
- Real ML wiring (DeepFace, EasyOCR, etc.) can be enabled incrementally without changing the API contracts.
- Auth is disabled by default for local dev. Set `DISABLE_AUTH=false` and add Clerk JWT validation in `main.py` later.
- Blockchain write (Hardhat) will be added in a separate module using web3.py.
