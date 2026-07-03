# AjoBI — Digital Ajo/Esusu Platform

AjoBI modernizes Nigeria's traditional Ajo/Esusu cooperative savings system — letting groups contribute, rotate payouts, save toward goals, and transact in escrow, all automated through Nomba's payment infrastructure.

## Features

- **Digital Ajo Groups** — create or join savings groups, automated collection and rotation payouts
- **Savings Goals** — save toward rent, tax, or any target with automated instalments
- **Simple Escrow** — secure two-party payments with dual confirmation
- **AjoScore** — dynamic financial identity built from real saving and repayment behaviour

## Tech Stack

- **Frontend** — Next.js 16, TypeScript, Tailwind CSS, Redux Toolkit
- **Backend** — Node.js, Express, PostgreSQL (Supabase)
- **Payments** — Nomba API (Checkout, Transfers, Direct Debit)
- **AI** — Gemini API (bank statement analysis)

## Running Locally

### Prerequisites
- Node.js 18+
- A Supabase project (free tier works)
- Nomba sandbox credentials

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Fill in your .env.local values
npm run dev
```

### Environment Variables

**Backend `.env`:**
PORT=5000
DB_URL=your_supabase_connection_string
JWT_SECRET=your_jwt_secret
NOMBA_BASE_URL=https://sandbox.nomba.com
NOMBA_CLIENT_ID=your_nomba_client_id
NOMBA_CLIENT_SECRET=your_nomba_client_secret
NOMBA_PARENT_ACCOUNT_ID=your_parent_account_id
NOMBA_SUB_ACCOUNT_ID=your_sub_account_id
NOMBA_WEBHOOK_SECRET=your_webhook_secret
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:3000

**Frontend `.env.local`:**
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_USE_MOCK_API=false

### Demo Credentials

Run the seed script first:
```bash
cd backend && node seed.js
```

Then login with:
- **Email:** demo@ajobi.com
- **Password:** demo1234
- **Admin:** admin@ajobi.com / AjoBI2024!

## API Endpoints

| Feature | Base Path |
|---|---|
| Auth | `/api/auth` |
| Onboarding | `/api/setup` |
| AjoScore | `/api/ajoscore` |
| Groups | `/api/groups` |
| Savings | `/api/savings` |
| Escrow | `/api/escrow` |
| User | `/api/user` |
| Admin | `/api/admin` |
| Webhooks | `/api/webhooks` |