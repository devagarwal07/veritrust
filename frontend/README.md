# VeriTrust+ Frontend

A Next.js 15 application providing decentralized trust and identity verification with AI-powered KYC, credit scoring, fraud detection, and blockchain proof storage.

## 🚀 Features

### 🔐 AI-Powered KYC Verification

- Facial recognition and document verification
- Real-time webcam capture
- Document authenticity checks
- Anti-fraud detection

### 📊 Credit Score Evaluation

- Comprehensive credit assessment
- Multiple factor analysis
- AI-powered recommendations
- FICO-like scoring (300-850)

### ⛓️ Blockchain Integration

- Immutable verification storage
- Ethereum/Polygon support
- MetaMask wallet connection
- Transaction proof

### 📈 Analytics Dashboard

- Real-time verification statistics
- Credit score distribution
- Fraud detection insights
- Interactive charts

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Authentication**: Clerk
- **Database**: Supabase
- **Blockchain**: Ethers.js (Polygon)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **TypeScript**: Full type safety

## 📦 Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd veritrust/frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Required environment variables:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_CONTRACT_ADDRESS` - Smart contract address
- `NEXT_PUBLIC_CHAIN_ID` - Blockchain network ID (80001 for Mumbai, 137 for Polygon)

4. **Run development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
frontend/
├── app/
│   ├── api/                    # API routes
│   │   ├── verify-face/        # Face verification endpoint
│   │   ├── verify-document/    # Document verification endpoint
│   │   ├── calculate-credit/   # Credit score calculation
│   │   ├── store-blockchain/   # Blockchain storage
│   │   ├── analytics/          # Analytics data
│   │   └── user/[userId]/      # User data endpoint
│   ├── credit/                 # Credit evaluation page
│   ├── dashboard/              # Analytics dashboard
│   ├── verify/                 # KYC verification flow
│   │   ├── page.tsx            # Main verification page
│   │   └── webcam.tsx          # Webcam component
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/
│   ├── Chart.tsx               # Chart components
│   ├── CreditResultCard.tsx    # Credit score display
│   ├── Loader.tsx              # Loading indicators
│   ├── Navbar.tsx              # Navigation bar
│   └── UploadBox.tsx           # File upload component
├── lib/
│   ├── api.ts                  # API client
│   ├── blockchain.ts           # Blockchain utilities
│   ├── clerkClient.ts          # Clerk helpers
│   └── supabaseClient.ts       # Supabase client
├── utils/
│   ├── constants.ts            # App constants
│   └── scoring.ts              # Credit scoring logic
└── styles/
    └── globals.css             # Global styles
```

## 🔧 Configuration

### Clerk Setup

1. Create account at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy API keys to `.env.local`
4. Configure sign-in/sign-up routes

### Supabase Setup

1. Create project at [supabase.com](https://supabase.com)
2. Run the following SQL to create tables:

```sql
-- Verifications table
CREATE TABLE verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  status TEXT NOT NULL,
  document_type TEXT NOT NULL,
  document_url TEXT,
  selfie_url TEXT,
  face_match_score FLOAT,
  fraud_flags TEXT[],
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Credit reports table
CREATE TABLE credit_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  credit_score INTEGER NOT NULL,
  grade TEXT NOT NULL,
  risk_level TEXT NOT NULL,
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
  severity TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_verifications_user_id ON verifications(user_id);
CREATE INDEX idx_credit_reports_user_id ON credit_reports(user_id);
CREATE INDEX idx_fraud_alerts_user_id ON fraud_alerts(user_id);
```

3. Copy project URL and anon key to `.env.local`

### Blockchain Setup

1. Install MetaMask browser extension
2. Connect to Polygon Mumbai testnet
3. Get test MATIC from faucet
4. Deploy smart contract (see `/contracts` directory)
5. Add contract address to `.env.local`

## 🎨 Customization

### Styling

- Edit `tailwind.config.ts` for theme customization
- Modify `styles/globals.css` for global styles
- Update color scheme in `utils/constants.ts`

### Credit Scoring Algorithm

- Customize weights in `utils/scoring.ts`
- Modify score calculation logic
- Add custom factors

### UI Components

- All components are in `/components`
- Styled with Tailwind CSS
- Fully responsive and accessible

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
vercel deploy
```

### Other Platforms

```bash
npm run build
npm start
```

## 📝 API Documentation

### POST /api/verify-face

Verify face match between selfie and ID photo.

**Request:**

- `selfie`: File
- `idPhoto`: File

**Response:**

```json
{
  "isMatch": true,
  "similarity": 92.5,
  "confidence": 92.5,
  "fraudFlags": []
}
```

### POST /api/verify-document

Verify document authenticity.

**Request:**

- `document`: File
- `documentType`: string

**Response:**

```json
{
  "isValid": true,
  "documentType": "passport",
  "extractedData": { ... },
  "fraudFlags": []
}
```

### POST /api/calculate-credit

Calculate credit score.

**Request:**

```json
{
  "paymentHistory": 80,
  "creditUtilization": 30,
  "creditAge": 36,
  "creditMix": 3,
  "newCreditInquiries": 2
}
```

**Response:**

```json
{
  "score": 720,
  "grade": "Good",
  "factors": [...],
  "recommendations": [...],
  "riskLevel": "low"
}
```

## 🔒 Security

- All routes protected with Clerk authentication
- Server-side validation for all inputs
- File upload size limits enforced
- CORS protection enabled
- Blockchain signatures required for on-chain storage

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type check
npm run type-check

# Build test
npm run build
```

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For issues and questions:

- Open a GitHub issue
- Email: support@veritrust.example
- Discord: [Join our community](https://discord.gg/veritrust)

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced ML fraud detection
- [ ] Multi-chain support
- [ ] Decentralized storage (IPFS)
- [ ] Zero-knowledge proofs
- [ ] Social credit scoring
- [ ] B2B API access
- [ ] White-label solution

---

Built with ❤️ by the VeriTrust+ Team
