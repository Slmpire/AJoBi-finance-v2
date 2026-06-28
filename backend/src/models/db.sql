-- ============================
-- USERS & AUTH
-- ============================

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'user', -- 'user' or 'admin'
  status VARCHAR(20) DEFAULT 'active', -- 'active' or 'banned'
  bvn VARCHAR(20),
  beneficiary_account VARCHAR(20),
  account_name VARCHAR(150),
  profile_photo TEXT,
  language VARCHAR(20) DEFAULT 'english',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE invalidated_tokens (
  id SERIAL PRIMARY KEY,
  token TEXT NOT NULL,
  invalidated_at TIMESTAMP DEFAULT NOW()
);

-- ============================
-- SETUP / ONBOARDING (5-step flow)
-- ============================

CREATE TABLE onboarding_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  steps_completed INTEGER[] DEFAULT '{}',
  current_step INTEGER DEFAULT 1,
  onboarding_complete BOOLEAN DEFAULT FALSE,

  -- step 1
  occupation VARCHAR(150),

  -- step 2
  trade_duration VARCHAR(50),
  state VARCHAR(100),
  lga VARCHAR(100),
  income_range VARCHAR(50),

  -- step 3
  saves_money BOOLEAN,
  savings_methods TEXT[],
  in_ajo_group BOOLEAN,
  contribution_consistency VARCHAR(50),

  -- step 4
  has_borrowed BOOLEAN,
  repaid_fully BOOLEAN,
  repaid_on_time BOOLEAN,

  -- step 5
  language VARCHAR(20),

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================
-- AJOSCORE
-- ============================

CREATE TABLE ajo_scores (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  tier VARCHAR(50) DEFAULT 'Starter',

  savings_consistency INTEGER DEFAULT 0,
  repayment_behaviour INTEGER DEFAULT 0,
  escrow_completion INTEGER DEFAULT 0,
  transaction_history INTEGER DEFAULT 0,
  account_maturity INTEGER DEFAULT 0,
  community_standing INTEGER DEFAULT 0,

  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE score_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  old_score INTEGER,
  new_score INTEGER,
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE score_events (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  event_type VARCHAR(50),
  points INTEGER,
  direction VARCHAR(10), -- 'up' or 'down'
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================
-- VIRTUAL ACCOUNTS (Nomba)
-- ============================

CREATE TABLE virtual_accounts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  account_number VARCHAR(20),
  account_name VARCHAR(150),
  bank_name VARCHAR(100),
  bank_code VARCHAR(20),
  account_ref VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================
-- AJO GROUPS
-- ============================

CREATE TABLE groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  invite_code VARCHAR(10) UNIQUE NOT NULL,
  contribution_amount NUMERIC(12,2) NOT NULL,
  frequency VARCHAR(20) NOT NULL, -- weekly, biweekly, monthly
  max_members INTEGER NOT NULL,
  current_cycle INTEGER DEFAULT 1,
  next_collection_date DATE,
  status VARCHAR(20) DEFAULT 'pending', -- pending, active, completed
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE group_members (
  id SERIAL PRIMARY KEY,
  group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  rotation_position INTEGER NOT NULL,
  nomba_mandate_id VARCHAR(150),
  bank_account VARCHAR(20),
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

CREATE TABLE group_payments (
  id SERIAL PRIMARY KEY,
  group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  cycle_number INTEGER NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, paid, failed
  nomba_reference VARCHAR(150),
  paid_at TIMESTAMP
);

CREATE TABLE group_disbursements (
  id SERIAL PRIMARY KEY,
  group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
  recipient_user_id INTEGER REFERENCES users(id),
  cycle_number INTEGER NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  nomba_transfer_id VARCHAR(150),
  status VARCHAR(20) DEFAULT 'pending',
  disbursed_at TIMESTAMP
);

-- ============================
-- SAVINGS GOALS
-- ============================

CREATE TABLE savings_goals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  target_amount NUMERIC(12,2) NOT NULL,
  locked_balance NUMERIC(12,2) DEFAULT 0,
  frequency VARCHAR(20) NOT NULL, -- weekly, monthly
  deadline DATE NOT NULL,
  instalment_amount NUMERIC(12,2) NOT NULL,
  next_debit_date DATE,
  nomba_mandate_id VARCHAR(150),
  status VARCHAR(30) DEFAULT 'pending_debit_setup',
  -- pending_debit_setup, active, completed, broken
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE savings_instalments (
  id SERIAL PRIMARY KEY,
  goal_id INTEGER REFERENCES savings_goals(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, paid, failed
  nomba_reference VARCHAR(150),
  paid_at TIMESTAMP
);

-- ============================
-- ESCROW
-- ============================

CREATE TABLE escrows (
  id SERIAL PRIMARY KEY,
  creator_user_id INTEGER REFERENCES users(id),
  recipient_user_id INTEGER REFERENCES users(id),
  amount NUMERIC(12,2) NOT NULL,
  description TEXT,
  payment_code VARCHAR(50) UNIQUE NOT NULL,
  nomba_checkout_link TEXT,
  nomba_reference VARCHAR(150),
  creator_confirmed BOOLEAN DEFAULT FALSE,
  recipient_confirmed BOOLEAN DEFAULT FALSE,
  status VARCHAR(30) DEFAULT 'awaiting_payment',
  -- awaiting_payment, funded, awaiting_confirmation, released, disputed, refunded
  created_at TIMESTAMP DEFAULT NOW(),
  released_at TIMESTAMP
);

-- ============================
-- INDEXES (performance)
-- ============================

CREATE INDEX idx_group_members_group ON group_members(group_id);
CREATE INDEX idx_group_payments_group ON group_payments(group_id);
CREATE INDEX idx_savings_user ON savings_goals(user_id);
CREATE INDEX idx_escrows_creator ON escrows(creator_user_id);
CREATE INDEX idx_escrows_recipient ON escrows(recipient_user_id);
CREATE INDEX idx_escrows_payment_code ON escrows(payment_code);