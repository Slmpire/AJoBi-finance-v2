
# AjoBI — Digital Cooperative Savings Platform

> *"Your hustle is your credit history."*

AjoBI is a full-stack fintech platform that digitizes Nigeria's traditional Ajo/Esusu cooperative savings system. It enables groups of people to contribute fixed amounts on a schedule, rotate payouts automatically, save toward personal goals, and transact securely in escrow — all powered by Nomba's payment infrastructure.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Onboarding & AjoScore](#onboarding--ajoscore)
  - [Ajo Groups](#ajo-groups)
  - [Savings Goals](#savings-goals)
  - [Escrow](#escrow)
  - [User & Settings](#user--settings)
  - [Admin](#admin)
  - [Webhooks](#webhooks)
- [AjoScore System](#ajoscore-system)
- [Nomba Integration](#nomba-integration)
- [Database Schema](#database-schema)
- [Demo](#demo)
- [Roadmap](#roadmap)
- [Team](#team)

---

## Overview

Traditional Ajo/Esusu cooperative savings in Nigeria runs entirely on trust — with a human collector holding everyone's money, no paper trail, and no protection when things go wrong. AjoBI solves this by:

- Replacing the human collector with automated payment collection via Nomba
- Creating a transparent, tamper-proof record of every contribution and payout
- Building a financial identity (AjoScore) from real saving behaviour — no bank statement required
- Enabling groups across any distance, including diaspora communities

---

## Features

### Digital Ajo Groups
- Create a savings group with a fixed contribution amount and frequency (weekly, biweekly, monthly)
- Invite members via a unique 6-character invite code or shareable link
- Automated payment collection via Nomba Checkout
- Automatic pot disbursement to the next person in rotation once all members have paid
- Transparent dashboard showing every member's payment status in real time
- Cycle advances automatically after each successful payout
- Payout simulation endpoint for demo and testing purposes

### Savings Goals
- Create named goals (rent, tax, travel, emergency) with a target amount and deadline
- Platform calculates the instalment amount automatically based on frequency and deadline
- Track progress with percentage completion and projected completion date
- Break a goal early (with AjoScore penalty) or complete it to unlock a score bonus

### Simple Escrow
- Generate a payment link for any two-party transaction
- Share the link via WhatsApp or any channel — recipient does not need an AjoBI account
- Funds are held securely until both parties confirm the transaction is complete
- Automatic release via Nomba Transfer on dual confirmation
- Public status page accessible without login

### AjoScore Engine
- Dynamic creditworthiness score (0–100) built from behavioural signals
- Six weighted components: Savings Consistency, Repayment Behaviour, Transaction History, Escrow Completion, Community Standing, Account Maturity
- Three tiers: Starter (0–39), Builder (40–69), Trusted (70–100)
- Score increases with every on-time payment, completed goal, and successful escrow
- Score decreases for missed payments, broken goals, and disputes
- Feature gating based on score (e.g. public group access requires 30+)

### KYC & Virtual Accounts
- BVN collection and validation (11-digit format)
- Bank account verification and storage
- Nomba virtual account generation per user for incoming transfers

### Admin Panel
- Transaction feed across groups, savings, and escrow
- Disputed escrow management with force release and refund
- User management with ban/unban
- Platform-wide stats dashboard

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | React framework, routing, SSR |
| TypeScript | Type safety across all components and services |
| Tailwind CSS | Utility-first styling |
| Redux Toolkit | Global state management |
| Axios | HTTP client via typed service layer |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| PostgreSQL (Supabase) | Primary database |
| JWT + bcrypt | Authentication and password hashing |
| node-cron | Scheduled jobs for collection checks |
| Multer | File upload handling (bank statements) |
| Axios | Nomba API calls |

### External Services
| Service | Usage |
|---|---|
| Nomba API | Checkout, Transfers, Virtual Accounts, Webhooks |
| Supabase | Hosted PostgreSQL database |
| Gemini API | Bank statement analysis for AjoScore boost |

---

## Project Structure

```
AJoBi-finance-v2/
├── frontend/                    # Next.js 16 application
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   │   ├── dashboard/       # Dashboard pages (groups, savings, escrow, settings)
│   │   │   ├── setup/           # 5-step onboarding wizard
│   │   │   ├── onboarding/      # Registration page
│   │   │   └── pay/             # Public escrow payment page
│   │   ├── services/            # API service layer (one file per feature)
│   │   ├── store/               # Redux store and slices
│   │   └── components/          # Shared UI components
│   ├── .env.local               # Frontend environment variables
│   └── package.json
│
├── backend/                     # Node.js + Express API
│   ├── index.js                 # Entry point, route mounting, server start
│   ├── seed.js                  # Demo data seeding script
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js            # PostgreSQL connection pool
│   │   │   └── cors.js          # CORS configuration
│   │   ├── middleware/
│   │   │   ├── auth.js          # JWT verification middleware
│   │   │   ├── adminOnly.js     # Admin role guard
│   │   │   └── errorHandler.js  # Global error handler
│   │   ├── models/
│   │   │   └── db.sql           # Full database schema (14 tables)
│   │   ├── controllers/         # Request handlers (one per feature)
│   │   ├── routes/              # Express routers (one per feature)
│   │   ├── services/
│   │   │   ├── NombaService.js  # All Nomba API calls (auth, checkout, transfer, virtual accounts)
│   │   │   ├── ScoreService.js  # Shared updateScore() function
│   │   │   └── GeminiService.js # Bank statement analysis
│   │   ├── jobs/
│   │   │   ├── groupCollectionJob.js    # Daily check for overdue group payments
│   │   │   └── savingsInstalmentJob.js  # Daily check for due savings instalments
│   │   └── utils/
│   │       ├── response.js      # Standardized success/fail response helpers
│   │       ├── scoreFormulas.js # AjoScore calculation logic and tier config
│   │       └── bankCodes.js     # Nigerian bank codes (NIBSS standard)
│   ├── .env                     # Backend environment variables
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- A [Supabase](https://supabase.com) project (free tier works)
- [Nomba sandbox credentials](https://developer.nomba.com) (free registration)
- A Gemini API key (optional — for bank statement scoring)

---

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/Slmpire/AJoBi-finance-v2.git
cd AJoBi-finance-v2/backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Fill in your values in .env (see Environment Variables section below)

# Run the database schema against your Supabase project
node -e "
require('dotenv').config();
const fs = require('fs');
const pool = require('./src/config/db');
const sql = fs.readFileSync('./src/models/db.sql', 'utf8');
pool.query(sql).then(() => { console.log('Schema created'); process.exit(0); }).catch(err => { console.error(err.message); process.exit(1); });
"

# Seed demo data (optional but recommended for testing)
node seed.js

# Start the development server
npm run dev
```

The backend runs on `http://localhost:5000`. Confirm with:
```bash
curl http://localhost:5000/api/health
```

---

### Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create local environment file
cp .env.example .env.local
# Fill in NEXT_PUBLIC_API_URL and NEXT_PUBLIC_USE_MOCK_API

# Start the development server
npm run dev
```

The frontend runs on `http://localhost:3000`.

---

### Environment Variables

**`backend/.env`**

```env
# Server
PORT=5000
NODE_ENV=development

# Database (Supabase connection string)
DB_URL=postgresql://postgres.[project-ref]:[password]@aws-0-eu-west-1.pooler.supabase.com:5432/postgres

# Authentication
JWT_SECRET=your_long_random_secret_string_here

# Nomba API
NOMBA_BASE_URL=https://sandbox.nomba.com
NOMBA_PARENT_ACCOUNT_ID=your_parent_account_id
NOMBA_SUB_ACCOUNT_ID=your_sub_account_id
NOMBA_CLIENT_ID=your_client_id
NOMBA_CLIENT_SECRET=your_private_key
NOMBA_WEBHOOK_SECRET=your_webhook_secret
NOMBA_WEBHOOK_CALLBACK_URL=https://your-ngrok-url/api/webhooks/nomba

# Gemini (optional)
GEMINI_API_KEY=your_gemini_api_key

# Frontend
FRONTEND_URL=http://localhost:3000
```

**`frontend/.env.local`**

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_USE_MOCK_API=false
```

---

## API Documentation

All endpoints return this consistent response shape:

```json
{ "status": true, "message": "Success", "data": { } }
{ "status": false, "message": "What went wrong", "data": null }
```

All protected endpoints require:
```
Authorization: Bearer <token>
```

---

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login and receive JWT |
| POST | `/api/auth/logout` | Yes | Invalidate token |
| GET | `/api/auth/user` | Yes | Get current user |

**Register request:**
```json
{
  "full_name": "Pelumi Ogunleye",
  "email": "pelumi@example.com",
  "phone": "08012345678",
  "password": "securepassword"
}
```

**Login response:**
```json
{
  "status": true,
  "message": "Login successful",
  "data": {
    "user_id": "1",
    "full_name": "Pelumi Ogunleye",
    "email": "pelumi@example.com",
    "ajo_score": 41,
    "score_tier": "Builder",
    "onboarding_complete": true,
    "token": "eyJhbGci..."
  }
}
```

---

### Onboarding & AjoScore

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/setup/progress` | Yes | Get onboarding progress |
| POST | `/api/setup/step1` | Yes | Submit occupation |
| POST | `/api/setup/step2` | Yes | Submit location and income |
| POST | `/api/setup/step3` | Yes | Submit savings behaviour |
| POST | `/api/setup/step4` | Yes | Submit repayment history |
| POST | `/api/setup/step5` | Yes | Submit language, complete onboarding, receive AjoScore |
| GET | `/api/ajoscore/me` | Yes | Get full AjoScore with breakdown |
| POST | `/api/ajoscore/bank-statement` | Yes | Upload PDF for score boost |
| GET | `/api/score/history` | Yes | Score history (pass `?days=30`) |
| GET | `/api/score/events` | Yes | Score change events |
| GET | `/api/score/eligibility` | Yes | Feature eligibility based on score |

**Step 5 response (score reveal):**
```json
{
  "status": true,
  "message": "Onboarding completed successfully",
  "data": {
    "onboarding_complete": true,
    "ajo_score": 41,
    "score_tier": "Builder",
    "breakdown": {
      "savings_consistency": 15,
      "repayment_behaviour": 8,
      "escrow_completion": 0,
      "transaction_history": 0,
      "account_maturity": 5,
      "community_standing": 13
    },
    "explanation": "Your AjoScore is 41/100 based on your onboarding answers.",
    "improvement_tips": ["Complete more escrow transactions to build trust"]
  }
}
```

---

### Ajo Groups

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/groups/create` | Yes | Create a new group |
| POST | `/api/groups/join` | Yes | Join a group via invite code |
| GET | `/api/groups/mine` | Yes | Get all groups user belongs to |
| GET | `/api/groups/browse` | Yes | Browse public groups available to join |
| POST | `/api/groups/match` | Yes | Auto-match to a group by amount and frequency |
| GET | `/api/groups/banks` | Yes | List Nigerian bank codes |
| GET | `/api/groups/:id` | Yes | Get group dashboard (members, payments, rotation) |
| GET | `/api/groups/:id/members` | Yes | Get member list with payment status |
| GET | `/api/groups/:id/payments` | Yes | Get payment history |
| POST | `/api/groups/:id/setup-debit` | Yes | Generate Nomba checkout link for contribution |
| POST | `/api/groups/:id/simulate-payout` | Yes | Simulate a full payout cycle (demo/testing) |

**Create group request:**
```json
{
  "name": "Lagos Tech Savings",
  "contribution_amount": 10000,
  "frequency": "monthly",
  "max_members": 10
}
```

**Create group response:**
```json
{
  "status": true,
  "message": "Group created successfully",
  "data": {
    "group": {
      "id": 1,
      "name": "Lagos Tech Savings",
      "invite_code": "7PCFJS",
      "contribution_amount": "10000.00",
      "frequency": "monthly",
      "max_members": 10,
      "current_cycle": 1,
      "next_collection_date": "2026-08-03T00:00:00.000Z",
      "status": "pending"
    },
    "invite_link": "http://localhost:3000/groups/join/7PCFJS"
  }
}
```

**Setup debit response (Nomba checkout):**
```json
{
  "status": true,
  "message": "Checkout created successfully",
  "data": {
    "checkout_link": "https://pay.nomba.com/sandbox/...",
    "order_reference": "GRP-1-USR-1-CYC-1-1782901136922",
    "amount": "10000.00",
    "instructions": "Complete your ₦10000 contribution for Lagos Tech Savings via the checkout link."
  }
}
```

---

### Savings Goals

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/savings/create` | Yes | Create a savings goal |
| GET | `/api/savings/mine` | Yes | List all goals |
| GET | `/api/savings/overview` | Yes | Summary of total savings |
| GET | `/api/savings/activity` | Yes | Instalment payment history |
| GET | `/api/savings/automation-rules` | Yes | Active saving schedules |
| GET | `/api/savings/:id` | Yes | Goal detail with instalments |
| POST | `/api/savings/:id/setup-payment` | Yes | Generate Nomba checkout for instalment |
| POST | `/api/savings/:id/break` | Yes | Break goal early (AjoScore penalty) |

**Create goal request:**
```json
{
  "name": "Annual Rent",
  "target_amount": 500000,
  "deadline": "2026-12-31",
  "frequency": "monthly"
}
```

**Create goal response:**
```json
{
  "status": true,
  "message": "Savings goal created successfully",
  "data": {
    "goal": {
      "id": 1,
      "name": "Annual Rent",
      "target_amount": "500000.00",
      "locked_balance": "0.00",
      "frequency": "monthly",
      "deadline": "2026-12-31",
      "instalment_amount": "41666.67",
      "status": "pending_payment_setup"
    },
    "instalment_breakdown": {
      "instalment_amount": 41666.67,
      "frequency": "monthly",
      "periods": 12,
      "total": 500000
    }
  }
}
```

---

### Escrow

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/escrow/create` | Yes | Create escrow and generate payment link |
| GET | `/api/escrow/mine` | Yes | List all escrows (created and received) |
| GET | `/api/escrow/public/:code` | No | Public escrow status (no login needed) |
| GET | `/api/escrow/:id` | Yes | Escrow detail |
| POST | `/api/escrow/:id/confirm` | Yes | Confirm release (both parties must confirm) |
| POST | `/api/escrow/:id/virtual-account` | Yes | Generate virtual account for escrow payment |

**Create escrow request:**
```json
{
  "amount": 25000,
  "description": "Payment for logo design",
  "recipient_email": "designer@example.com"
}
```

**Create escrow response:**
```json
{
  "status": true,
  "message": "Escrow created successfully",
  "data": {
    "escrow": {
      "id": 1,
      "amount": "25000.00",
      "description": "Payment for logo design",
      "payment_code": "esc_bwwk5rym",
      "status": "awaiting_payment"
    },
    "checkout_link": "https://pay.nomba.com/sandbox/...",
    "payment_link": "http://localhost:3000/pay/esc_bwwk5rym",
    "share_message": "You have been requested to pay ₦25000 for \"Payment for logo design\". Pay securely here: http://localhost:3000/pay/esc_bwwk5rym"
  }
}
```

---

### User & Settings

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/user/profile` | Yes | Full user profile with AjoScore |
| PATCH | `/api/user/profile` | Yes | Update profile |
| PATCH | `/api/user/beneficiary` | Yes | Update bank account details |
| GET | `/api/user/dashboard` | Yes | Dashboard summary (score, groups, savings, escrow counts) |
| POST | `/api/user/kyc` | Yes | Submit BVN and bank account for KYC |
| GET | `/api/user/virtualaccounts` | Yes | Get user's virtual account |
| POST | `/api/user/groupvirtualaccounts` | Yes | Create virtual account for group |
| GET | `/api/settings/profile` | Yes | Settings profile view |
| PUT | `/api/settings/profile` | Yes | Update settings profile |
| GET | `/api/settings/security` | Yes | Security settings |
| PUT | `/api/settings/security` | Yes | Update security settings |
| GET | `/api/settings/notifications` | Yes | Notification preferences |
| PUT | `/api/settings/notifications` | Yes | Update notification preferences |

**KYC request:**
```json
{
  "bvn": "12345678901",
  "account_number": "0123456789",
  "account_name": "Pelumi Ogunleye",
  "bank_code": "058"
}
```

---

### Admin

All admin endpoints require `role: admin` on the JWT.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/stats` | Admin | Platform-wide stats |
| GET | `/api/admin/transactions` | Admin | All transactions (filter by type) |
| GET | `/api/admin/escrow/disputed` | Admin | Disputed escrows |
| POST | `/api/admin/escrow/:id/release` | Admin | Force release escrow |
| POST | `/api/admin/escrow/:id/refund` | Admin | Force refund escrow |
| GET | `/api/admin/users` | Admin | All users with scores |
| POST | `/api/admin/users/:id/ban` | Admin | Ban a user |
| POST | `/api/admin/users/:id/unban` | Admin | Unban a user |

**Admin credentials (after running seed):**
- Email: `admin@ajobi.com`
- Password: `AjoBI2024!`

---

### Webhooks

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/webhooks/nomba` | Signature | Nomba payment event handler |

The webhook handler verifies the Nomba HMAC-SHA256 signature, then routes events based on the `orderReference` prefix:

- `GRP-` → group payment handler (marks member paid, triggers payout if all paid)
- `SAV-` → savings instalment handler (adds to locked balance, checks completion)
- `esc_` → escrow payment handler (marks escrow as funded)

Supported event types:
- `checkout.order.completed` — payment successful
- `checkout.order.failed` — payment failed (applies score penalty)

---

## AjoScore System

The AjoScore is calculated in two phases:

**Phase 1 — Onboarding (max 50 points)**

| Component | Max Points | Signal |
|---|---|---|
| Savings Consistency | 15 | Saves regularly, in an Ajo group, contributes on time |
| Repayment Behaviour | 15 | Has borrowed and repaid fully and on time |
| Community Standing | 15 | Occupation specificity and years of earning |
| Account Maturity | 5 | Base points for creating an account |

**Phase 2 — Platform Activity (max 50 additional points)**

| Event | Points |
|---|---|
| Group contribution paid on time | +2 |
| Missed group contribution | -5 |
| Savings instalment paid | +1 |
| Savings goal completed | +5 |
| Savings goal broken early | -3 |
| Escrow completed successfully | +1 |

**Tiers:**

| Tier | Score Range | Color | Unlocks |
|---|---|---|---|
| Starter | 0–39 | Grey | Basic groups and savings |
| Builder | 40–69 | Amber | Public groups (30+), standard group tiers |
| Trusted | 70–100 | Green | Increased group limits, priority support, micro-credit (coming soon) |

---

## Nomba Integration

AjoBI uses three Nomba APIs:

**1. Checkout API** (`POST /v1/checkout/order`)
Used for: group contributions, savings instalments, escrow payments.
Each payment generates a unique checkout link the user completes on Nomba's hosted page.

**2. Transfer API** (`POST /v2/transfers/bank`)
Used for: disbursing group payouts to the rotation recipient's bank account, releasing escrow funds.

**3. Virtual Account API** (`POST /v1/accounts/virtual`)
Used for: creating a dedicated Nomba account number per user for receiving transfers.

**Webhook flow:**
```
User pays on Nomba checkout
    ↓
Nomba fires POST /api/webhooks/nomba
    ↓
Backend verifies HMAC-SHA256 signature
    ↓
Routes by orderReference prefix (GRP / SAV / esc_)
    ↓
Updates DB, triggers payout or completion
    ↓
AjoScore updated
```

---

## Database Schema

14 tables across 6 feature domains:

```
Auth:       users, invalidated_tokens
Onboarding: onboarding_progress
AjoScore:   ajo_scores, score_history, score_events
Payments:   virtual_accounts
Groups:     groups, group_members, group_payments, group_disbursements
Savings:    savings_goals, savings_instalments
Escrow:     escrows
```

To view or modify the full schema, see `backend/src/models/db.sql`.

---

## Demo

### Quick Start with Demo Data

```bash
cd backend
node seed.js
```

This creates:
- Demo user: `demo@ajobi.com` / `demo1234` (AjoScore: 65, Builder tier)
- Admin user: `admin@ajobi.com` / `AjoBI2024!`
- 1 active Ajo group (DEMO01, ₦5,000/week, 5 members)
- 1 savings goal (Annual Rent, ₦500,000 target, 25% saved)
- 1 funded escrow (₦50,000, awaiting confirmation)

### Simulate a Group Payout

```bash
# Login and get token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@ajobi.com", "password": "demo1234"}' | \
  node -e "process.stdin.resume();let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(JSON.parse(d).data.token))")

# Simulate payout for group 1
curl -X POST http://localhost:5000/api/groups/1/simulate-payout \
  -H "Authorization: Bearer $TOKEN"
```

---

## Roadmap

**Now (hackathon MVP):**
- [x] Digital Ajo Groups with Nomba Checkout
- [x] Savings Goals with automated instalments
- [x] Simple Escrow with dual confirmation
- [x] AjoScore engine (6 components, 3 tiers)
- [x] KYC (BVN + bank account)
- [x] Virtual accounts via Nomba
- [x] Webhook handler for real payment events
- [x] Admin panel

**Next 30 days:**
- [ ] Live webhook testing with real Nomba payments
- [ ] Real user pilot with 3–5 Ajo groups
- [ ] USSD channel for feature phone users
- [ ] WhatsApp contribution reminders

**3–6 months:**
- [ ] Diaspora support (GBP/USD/CAD contributions, naira disbursement)
- [ ] Micro-credit for Trusted tier users
- [ ] Group reputation system
- [ ] Savings vault with interest via money market integration
- [ ] iOS and Android apps

---

## Team

**Team Ajobi** ([@Slmpire](https://github.com/Slmpire))

---

## License

MIT

---

*Built for the DevCareer x Nomba Hackathon 2026*
```

---

Paste that into `~/AJoBi-finance-v2/README.md`. It covers everything a judge, teammate, or future contributor needs to understand, run, and extend the project.
