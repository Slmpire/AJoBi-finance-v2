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