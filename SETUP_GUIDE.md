# VeriTrust+ Setup Guide

This guide will walk you through setting up VeriTrust+ from scratch.

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- npm or yarn
- A code editor (VS Code recommended)
- Git installed

## Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/veritrust.git
cd veritrust
```

## Step 2: Install Dependencies

```bash
cd frontend
npm install
```

## Step 3: Set Up Clerk (Authentication)

### 3.1 Create a Clerk Account

1. Go to [clerk.com](https://clerk.com)
2. Sign up for a free account
3. Click "Create Application"
4. Choose your application name (e.g., "VeriTrust")
5. Select authentication methods (Email, Google, etc.)

### 3.2 Get API Keys

1. Go to the dashboard
2. Navigate to "API Keys"
3. Copy the following:
   - Publishable Key
   - Secret Key

### 3.3 Configure Clerk URLs

In your Clerk dashboard:

1. Go to "Paths"
2. Set the following:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in URL: `/dashboard`
   - After sign-up URL: `/verify`

## Step 4: Set Up Supabase (Database)

### 4.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Sign in
3. Click "New Project"
4. Fill in project details:
   - Name: VeriTrust
   - Database Password: (choose a strong password)
   - Region: (closest to you)

### 4.2 Create Database Tables

In the Supabase SQL Editor, run:

```sql
-- Verifications table
CREATE TABLE verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'verified', 'rejected')),
  document_type TEXT NOT NULL,
  document_url TEXT,
  selfie_url TEXT,
  face_match_score FLOAT CHECK (face_match_score >= 0 AND face_match_score <= 100),
  fraud_flags TEXT[],
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Credit reports table
CREATE TABLE credit_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  credit_score INTEGER NOT NULL CHECK (credit_score >= 300 AND credit_score <= 850),
  grade TEXT NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
  factors JSONB,
  recommendations TEXT[],
  blockchain_hash TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Fraud alerts table
CREATE TABLE fraud_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT,
  metadata JSONB,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_verifications_user_id ON verifications(user_id);
CREATE INDEX idx_verifications_status ON verifications(status);
CREATE INDEX idx_credit_reports_user_id ON credit_reports(user_id);
CREATE INDEX idx_fraud_alerts_user_id ON fraud_alerts(user_id);
CREATE INDEX idx_fraud_alerts_severity ON fraud_alerts(severity);

-- Enable Row Level Security
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_alerts ENABLE ROW LEVEL SECURITY;

-- Create policies (users can only access their own data)
CREATE POLICY "Users can view own verifications"
  ON verifications FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own verifications"
  ON verifications FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can view own credit reports"
  ON credit_reports FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own credit reports"
  ON credit_reports FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can view own fraud alerts"
  ON fraud_alerts FOR SELECT
  USING (auth.uid()::text = user_id);
```

### 4.3 Set Up Storage

1. In Supabase, go to "Storage"
2. Create a new bucket named "documents"
3. Set the bucket to "Public" or configure appropriate policies
4. Create the following folders in the bucket:
   - `identities/`
   - `selfies/`

### 4.4 Get API Keys

1. Go to "Settings" > "API"
2. Copy the following:
   - Project URL
   - Anon/Public Key

## Step 5: Set Up Environment Variables

Create a `.env.local` file in the `frontend` directory:

```bash
cd frontend
cp .env.local.example .env.local
```

Edit `.env.local` and add your keys:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/verify

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Blockchain (Optional for now)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=80001

# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Step 6: Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 7: Test the Application

### Test Account Creation

1. Click "Sign Up"
2. Create a test account
3. Verify email if required

### Test KYC Verification

1. Navigate to "Verify Identity"
2. Select a document type
3. Upload a test ID image
4. Capture or upload a selfie
5. Submit for verification

### Test Credit Scoring

1. Navigate to "Credit Score"
2. Fill in the form with test data
3. Calculate your score
4. View recommendations

### Test Dashboard

1. Navigate to "Dashboard"
2. View your verification status
3. Check credit score
4. Explore analytics

## Step 8: Optional - Blockchain Setup

### 8.1 Install MetaMask

1. Install [MetaMask](https://metamask.io) browser extension
2. Create or import a wallet

### 8.2 Connect to Polygon Mumbai Testnet

1. Open MetaMask
2. Click network dropdown
3. Select "Add Network"
4. Enter details:
   - Network Name: Mumbai Testnet
   - RPC URL: https://rpc-mumbai.maticvigil.com
   - Chain ID: 80001
   - Currency Symbol: MATIC
   - Block Explorer: https://mumbai.polygonscan.com

### 8.3 Get Test MATIC

1. Go to [Mumbai Faucet](https://faucet.polygon.technology)
2. Enter your wallet address
3. Request test MATIC

### 8.4 Deploy Smart Contract (Advanced)

See `contracts/README.md` for smart contract deployment instructions.

## Troubleshooting

### Issue: Cannot connect to Supabase

**Solution**: Check your Supabase URL and API key in `.env.local`

### Issue: Clerk authentication not working

**Solution**: Verify your Clerk keys and ensure URLs are configured correctly

### Issue: Images not uploading

**Solution**: Check Supabase storage bucket permissions

### Issue: Module not found errors

**Solution**: Delete `node_modules` and `.next`, then run `npm install` again

### Issue: TypeScript errors

**Solution**: Run `npm run build` to see detailed error messages

## Next Steps

1. **Customize Branding**: Update colors in `tailwind.config.ts`
2. **Add Real ML Models**: Integrate face recognition APIs
3. **Deploy**: Deploy to Vercel or your preferred hosting
4. **Set Up CI/CD**: Configure automated testing and deployment
5. **Monitor**: Set up error tracking (Sentry, etc.)

## Need Help?

- Check the [README.md](README.md)
- Open an issue on GitHub
- Join our Discord community
- Email: support@veritrust.example

## Security Checklist

Before going to production:

- [ ] Change all default secrets
- [ ] Enable rate limiting
- [ ] Set up CORS properly
- [ ] Enable HTTPS
- [ ] Configure CSP headers
- [ ] Set up error monitoring
- [ ] Enable audit logging
- [ ] Review Supabase RLS policies
- [ ] Set up backup strategy
- [ ] Configure environment-specific variables

---

Happy building! 🚀
