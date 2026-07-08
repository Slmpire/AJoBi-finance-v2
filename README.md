AjoBI — Digital Cooperative Savings Platform

"Your hustle is your credit history."

AjoBI is a full-stack fintech platform that digitizes Nigeria's traditional Ajo/Esusu cooperative savings system. It enables groups of people to contribute fixed amounts on a schedule, rotate payouts automatically, save toward personal goals, and transact securely in escrow — all powered by Nomba's payment infrastructure.

Table of Contents

Overview
Features
Tech Stack
Project Structure
Getting Started
Environment Variables
API Documentation
AjoScore System
Nomba Integration
Database Schema
Demo Credentials
Deployment
Roadmap
Team


Overview
Traditional Ajo/Esusu cooperative savings in Nigeria runs entirely on trust — with a human collector holding everyone's money, no paper trail, and no protection when things go wrong. AjoBI solves this by:

Replacing the human collector with automated payment collection via Nomba
Creating a transparent, tamper-proof record of every contribution and payout
Building a financial identity (AjoScore) from real saving behaviour — no bank statement required
Enabling groups across any distance, including diaspora communities


Features
Digital Ajo Groups

Create or join a savings group with a fixed contribution amount and frequency
Invite members via a unique 6-character invite code or shareable link
Auto-match to existing groups by contribution amount and frequency
Automated payment collection via Nomba Checkout
Automatic pot disbursement to the next person in rotation once all members have paid
Transparent dashboard showing every member's payment status in real time
Cycle advances automatically after each successful payout
Payout simulation endpoint for demo and testing purposes
Creator controls: invite members, copy invite code, edit rotation

Savings Goals

Create named goals (rent, tax, travel, emergency) with a target amount and deadline
Platform calculates instalment amount automatically
Track progress with percentage completion and projected completion date
Break a goal early with AjoScore penalty or complete it for a bonus

Simple Escrow

Generate a Nomba payment link for any two-party transaction
Share link via WhatsApp — recipient does not need an AjoBI account
Funds held securely until both parties confirm
Automatic release via Nomba Transfer on dual confirmation
Public status page accessible without login
Virtual account option for bank transfer payments

AjoScore Engine

Dynamic creditworthiness score (0–100) built from behavioural signals
Six weighted components: Savings Consistency, Repayment Behaviour, Transaction History, Escrow Completion, Community Standing, Account Maturity
Three tiers: Starter (0–39), Builder (40–69), Trusted (70–100)
Score increases with every on-time payment, completed goal, and successful escrow
Score decreases for missed payments, broken goals, and disputes
Feature gating based on score

KYC & Virtual Accounts

BVN collection and validation (11-digit format)
Bank account verification and storage
Real Nomba virtual account generation per user for incoming transfers

Settings

Profile management (name, phone, language)
Notification preferences (email, SMS, contribution reminders, payout alerts, escrow updates)
BVN and bank account status display

Admin Panel

Transaction feed across groups, savings, and escrow
Disputed escrow management with force release and refund
User management with ban/unban
Platform-wide stats dashboard


Tech Stack
Frontend
TechnologyPurposeNext.js 16 (App Router)React framework, routing, SSRTypeScriptType safety across all components and servicesTailwind CSSUtility-first stylingRedux ToolkitGlobal state managementAxiosHTTP client via typed service layer
Backend
TechnologyPurposeNode.js + ExpressREST API serverPostgreSQL (Supabase)Primary databaseJWT + bcryptAuthentication and password hashingnode-cronScheduled jobs for collection checksMulterFile upload handlingAxiosNomba API calls
External Services
ServiceUsageNomba APICheckout, Transfers, Virtual Accounts, WebhooksSupabaseHosted PostgreSQL databaseVercelFrontend hostingRailwayBackend hostingGemini APIBank statement analysis (optional)

Project Structure
AJoBi-finance-v2/
├── frontend/                    # Next.js 16 application
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   │   ├── dashboard/       # All dashboard pages
│   │   │   │   ├── overview/    # Dashboard home
│   │   │   │   ├── groups/      # Ajo Groups (list, create, detail)
│   │   │   │   ├── savings/     # Savings Goals (list, create, detail)
│   │   │   │   ├── escrow/      # Escrow (list, create, detail)
│   │   │   │   ├── score/       # AjoScore page
│   │   │   │   └── settings/    # Profile and preferences
│   │   │   ├── setup/           # 5-step onboarding wizard
│   │   │   ├── onboarding/      # Registration page
│   │   │   └── pay/             # Public escrow payment page
│   │   ├── services/            # API service layer (one file per feature)
│   │   │   ├── apiClient.ts     # Axios instance, token attachment
│   │   │   ├── authService.ts
│   │   │   ├── setupService.ts
│   │   │   ├── scoreService.ts
│   │   │   ├── groupsService.ts
│   │   │   ├── savingsService.ts
│   │   │   ├── escrowService.ts
│   │   │   ├── userService.ts
│   │   │   └── settingsService.ts
│   │   ├── store/               # Redux store and slices
│   │   │   └── slices/          # authSlice, scoreSlice, groupsSlice, savingsSlice, settingsSlice
│   │   └── components/          # Shared UI components
│   ├── .env.local               # Frontend environment variables
│   └── package.json
│
├── backend/                     # Node.js + Express API
│   ├── index.js                 # Entry point, route mounting, server start
│   ├── seed.js                  # Demo data seeding script
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js            # PostgreSQL connection pool (Supabase)
│   │   │   └── cors.js          # CORS configuration
│   │   ├── middleware/
│   │   │   ├── auth.js          # JWT verification middleware
│   │   │   ├── adminOnly.js     # Admin role guard
│   │   │   └── errorHandler.js  # Global error handler
│   │   ├── models/
│   │   │   └── db.sql           # Full database schema (14 tables)
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── setupController.js
│   │   │   ├── scoreController.js
│   │   │   ├── userController.js
│   │   │   ├── groupController.js
│   │   │   ├── savingsController.js
│   │   │   ├── escrowController.js
│   │   │   ├── adminController.js
│   │   │   └── webhookController.js
│   │   ├── routes/              # Express routers (one per feature)
│   │   ├── services/
│   │   │   ├── NombaService.js  # All Nomba API calls
│   │   │   ├── ScoreService.js  # Shared updateScore() function
│   │   │   └── GeminiService.js # Bank statement analysis
│   │   ├── jobs/
│   │   │   ├── groupCollectionJob.js    # Daily check for overdue payments
│   │   │   └── savingsInstalmentJob.js  # Daily check for due instalments
│   │   └── utils/
│   │       ├── response.js      # Standardized success/fail helpers
│   │       ├── scoreFormulas.js # AjoScore calculation and tier config
│   │       └── bankCodes.js     # Nigerian bank codes (NIBSS standard)
│   ├── .env                     # Backend environment variables (never commit)
│   ├── .env.example             # Template for environment variables
│   └── package.json
│
└── README.md

Getting Started
Prerequisites

Node.js v18 or higher
A Supabase project (free tier works)
Nomba sandbox credentials (free registration)
Gemini API key (optional — for bank statement scoring)

Backend Setup
bashgit clone https://github.com/Slmpire/AJoBi-finance-v2.git
cd AJoBi-finance-v2/backend
npm install
cp .env.example .env
# Fill in your values in .env
Run the database schema:
bashnode -e "
require('dotenv').config();
const fs = require('fs');
const pool = require('./src/config/db');
const sql = fs.readFileSync('./src/models/db.sql', 'utf8');
pool.query(sql).then(() => { console.log('Schema created'); process.exit(0); }).catch(err => { console.error(err.message); process.exit(1); });
"
Seed demo data:
bashnode seed.js
Start development server:
bashnpm run dev
Frontend Setup
bashcd ../frontend
npm install
cp .env.example .env.local
# Fill in NEXT_PUBLIC_API_URL and NEXT_PUBLIC_USE_MOCK_API
npm run dev
Frontend runs on http://localhost:3000, backend on http://localhost:5000.

Environment Variables
Backend .env
env# Server
PORT=5000
NODE_ENV=development

# Database (Supabase connection string — use session pooler)
DB_URL=postgresql://postgres.[ref]:[password]@aws-0-eu-west-1.pooler.supabase.com:5432/postgres

# Authentication
JWT_SECRET=your_long_random_secret_here

# Nomba API (use sandbox credentials for development)
NOMBA_BASE_URL=https://sandbox.nomba.com
NOMBA_PARENT_ACCOUNT_ID=your_parent_account_id
NOMBA_SUB_ACCOUNT_ID=your_sub_account_id
NOMBA_CLIENT_ID=your_client_id
NOMBA_CLIENT_SECRET=your_private_key
NOMBA_WEBHOOK_SECRET=your_webhook_secret
NOMBA_WEBHOOK_CALLBACK_URL=https://your-ngrok-or-production-url/api/webhooks/nomba

# Gemini (optional)
GEMINI_API_KEY=your_gemini_api_key

# Frontend
FRONTEND_URL=http://localhost:3000
Frontend .env.local
envNEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_USE_MOCK_API=false

API Documentation
All endpoints return:
json{ "status": true, "message": "Success", "data": { } }
{ "status": false, "message": "Error message", "data": null }
All protected endpoints require:
Authorization: Bearer <token>
Authentication
MethodEndpointAuthDescriptionPOST/api/auth/registerNoRegister new userPOST/api/auth/loginNoLogin and receive JWTPOST/api/auth/logoutYesInvalidate tokenGET/api/auth/userYesGet current user
Onboarding & Setup
MethodEndpointAuthDescriptionGET/api/setup/progressYesGet onboarding progressPOST/api/setup/step1YesSubmit occupationPOST/api/setup/step2YesSubmit location and incomePOST/api/setup/step3YesSubmit savings behaviourPOST/api/setup/step4YesSubmit repayment historyPOST/api/setup/step5YesComplete onboarding, get AjoScore
AjoScore
MethodEndpointAuthDescriptionGET/api/ajoscore/meYesFull score with breakdownPOST/api/ajoscore/bank-statementYesUpload PDF for score boostGET/api/score/historyYesScore history (pass ?days=30)GET/api/score/eventsYesScore change eventsGET/api/score/eligibilityYesFeature eligibility
Ajo Groups
MethodEndpointAuthDescriptionPOST/api/groups/createYesCreate a new groupPOST/api/groups/joinYesJoin via invite codeGET/api/groups/mineYesList user's groupsGET/api/groups/browseYesBrowse public groupsPOST/api/groups/matchYesAuto-match by amount/frequencyGET/api/groups/banksYesNigerian bank codesGET/api/groups/:idYesGroup dashboardGET/api/groups/:id/membersYesMember listGET/api/groups/:id/paymentsYesPayment historyPOST/api/groups/:id/setup-debitYesGenerate Nomba checkoutPOST/api/groups/:id/simulate-payoutYesSimulate full payout cycle
Savings Goals
MethodEndpointAuthDescriptionPOST/api/savings/createYesCreate a savings goalGET/api/savings/mineYesList all goalsGET/api/savings/overviewYesTotal savings summaryGET/api/savings/activityYesInstalment historyGET/api/savings/automation-rulesYesActive saving schedulesGET/api/savings/:idYesGoal detail with instalmentsPOST/api/savings/:id/setup-paymentYesGenerate Nomba checkoutPOST/api/savings/:id/breakYesBreak goal early
Escrow
MethodEndpointAuthDescriptionPOST/api/escrow/createYesCreate escrow + payment linkGET/api/escrow/mineYesList all escrowsGET/api/escrow/public/:codeNoPublic status pageGET/api/escrow/:idYesEscrow detailPOST/api/escrow/:id/confirmYesConfirm releasePOST/api/escrow/:id/virtual-accountYesGenerate virtual account
User & Settings
MethodEndpointAuthDescriptionGET/api/user/profileYesFull profile with scorePATCH/api/user/profileYesUpdate profilePATCH/api/user/beneficiaryYesUpdate bank accountGET/api/user/dashboardYesDashboard summaryPOST/api/user/kycYesSubmit BVN and bank accountGET/api/user/virtualaccountsYesGet virtual accountPOST/api/user/virtualaccountsYesCreate virtual accountGET/api/settings/profileYesSettings profilePUT/api/settings/profileYesUpdate settingsGET/api/settings/notificationsYesNotification preferencesPUT/api/settings/notificationsYesUpdate notificationsGET/api/settings/securityYesSecurity settings
Admin (requires admin role)
MethodEndpointAuthDescriptionGET/api/admin/statsAdminPlatform statsGET/api/admin/transactionsAdminAll transactionsGET/api/admin/escrow/disputedAdminDisputed escrowsPOST/api/admin/escrow/:id/releaseAdminForce releasePOST/api/admin/escrow/:id/refundAdminForce refundGET/api/admin/usersAdminAll usersPOST/api/admin/users/:id/banAdminBan userPOST/api/admin/users/:id/unbanAdminUnban user
Webhooks
MethodEndpointAuthDescriptionPOST/api/webhooks/nombaSignatureNomba payment events

AjoScore System
Phase 1 — Onboarding (max 50 points)
ComponentMax PointsSignalSavings Consistency15Saves regularly, in Ajo group, on-time contributionsRepayment Behaviour15Has borrowed and repaid fully and on timeCommunity Standing15Occupation specificity and years of earningAccount Maturity5Base points for account creation
Phase 2 — Platform Activity (max 50 additional points)
EventPointsGroup contribution paid on time+2Missed group contribution-5Savings instalment paid+1Savings goal completed+5Savings goal broken early-3Escrow completed+1
Tiers
TierRangeColourUnlocksStarter0–39GreyBasic groups and savingsBuilder40–69AmberPublic groups, standard group tiersTrusted70–100GreenPriority support, micro-credit (coming soon)

Nomba Integration
Real API calls:

POST /v1/checkout/order — generates payment links for groups, savings, escrow
POST /v2/transfers/bank — disburses group payouts and escrow releases
POST /v1/accounts/virtual — creates dedicated account numbers per user
POST /v1/auth/token/issue — obtains access tokens (cached, auto-refreshed)

Webhook flow:
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
AjoScore updated for all parties
Simulated (sandbox limitations):

Direct Debit mandates (endpoint returns 404 on sandbox)
BVN verification (accepts any 11-digit number for hackathon)


Database Schema
14 tables across 6 feature domains:
Auth:       users, invalidated_tokens
Onboarding: onboarding_progress
AjoScore:   ajo_scores, score_history, score_events
Payments:   virtual_accounts
Groups:     groups, group_members, group_payments, group_disbursements
Savings:    savings_goals, savings_instalments
Escrow:     escrows
Full schema: backend/src/models/db.sql

Demo Credentials
Run the seed script first:
bashcd backend && node seed.js
RoleEmailPasswordDemo Userdemo@ajobi.comdemo1234Adminadmin@ajobi.comAjoBI2024!
Simulate a Group Payout
bashTOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@ajobi.com", "password": "demo1234"}' | \
  node -e "process.stdin.resume();let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(JSON.parse(d).data.token))")

curl -X POST http://localhost:5000/api/groups/1/simulate-payout \
  -H "Authorization: Bearer $TOKEN"

Deployment
Backend — Railway

Push to GitHub → Railway auto-deploys on every push
Set all environment variables in Railway Variables tab
Set networking port to match process.env.PORT (Railway default: 8080)

Frontend — Vercel

Connected to GitHub repo, auto-deploys on push
Set NEXT_PUBLIC_API_URL and NEXT_PUBLIC_USE_MOCK_API in Vercel Environment Variables

Live URLs:

Frontend: https://ajobi-frontend.vercel.app
Backend: https://ajobi-backend-production.up.railway.app


Roadmap
Hackathon MVP (completed):

 Digital Ajo Groups with Nomba Checkout
 Savings Goals with automated instalments
 Simple Escrow with dual confirmation
 AjoScore engine (6 components, 3 tiers)
 KYC (BVN + bank account)
 Real Nomba virtual accounts
 Webhook handler for payment events
 Admin panel
 Settings (profile, notifications, security)
 Auto-match groups
 Payout simulation

Next 30 days:

 Live webhook testing with real Nomba payments
 Real user pilot with 3–5 Ajo groups
 USSD channel for feature phone users
 WhatsApp contribution reminders via Africa's Talking

3–6 months:

 Diaspora support (GBP/USD/CAD → naira)
 Micro-credit for Trusted tier users
 Savings vault with interest via money market
 iOS and Android apps
 Real BVN verification via Mono/Smile Identity


Team
Pelumi Ogunleye (@Slmpire)
Full-Stack Engineer — Backend, Frontend, Nomba Integration, AjoScore Engine
400-level Electrical and Electronics Engineering, Obafemi Awolowo University
Microsoft Student Ambassador Lead OAU | IEEE OAU | Google Developer Student Club OAU

License
MIT

Built for the DevCareer x Nomba Hackathon 2026
