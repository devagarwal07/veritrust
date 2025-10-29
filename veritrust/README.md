# VeriTrust Frontend (Next.js 16, TypeScript, Tailwind)

This folder contains a minimal scaffold for the VeriTrust+ frontend using Next.js (app router), TypeScript and Tailwind CSS.

Quick start (PowerShell):

```powershell
cd veritrust
npm install
npm run dev
```

Notes:

- This is a starter scaffold. It provides placeholder components for KYC upload, credit evaluation, and a simple dashboard.
- Next steps: wire `UploadKyc` to the ML backend (`ml_backend/`), implement API routes for credit scoring, and add blockchain transaction integration to persist proofs.
- Tailwind is configured in `tailwind.config.ts` and `styles/globals.css`.

Suggested additions:

- Add secure API routes and auth (Clerk/Supabase) like the main repo.
- Replace local heuristics with ML-backed scoring from `ml_backend/`.
- Add tests and TypeScript types for data shapes.
