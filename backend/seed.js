require('dotenv').config();
const pool = require('./src/config/db');
const bcrypt = require('bcrypt');

async function seed() {
  console.log('Seeding demo data...');

  // Demo user
  const hash = await bcrypt.hash('demo1234', 10);
  const userResult = await pool.query(
    `INSERT INTO users (full_name, email, phone, password_hash, role)
     VALUES ('Demo User', 'demo@ajobi.com', '08012345678', $1, 'user')
     ON CONFLICT (email) DO UPDATE SET full_name = 'Demo User'
     RETURNING id`,
    [hash]
  );
  const userId = userResult.rows[0].id;

  // AjoScore and onboarding
  await pool.query(
    'INSERT INTO ajo_scores (user_id, score, tier) VALUES ($1, 65, \'Builder\') ON CONFLICT (user_id) DO UPDATE SET score = 65, tier = \'Builder\'',
    [userId]
  );
  await pool.query(
    `INSERT INTO onboarding_progress
       (user_id, occupation, trade_duration, state, lga, income_range,
        saves_money, in_ajo_group, contribution_consistency,
        has_borrowed, repaid_fully, repaid_on_time, language,
        steps_completed, current_step, onboarding_complete)
     VALUES ($1, 'Software Developer', '1_3_years', 'Lagos', 'Ikeja', '100k_500k',
        true, true, 'always_on_time', false, false, false, 'english',
        '{1,2,3,4,5}', 6, true)
     ON CONFLICT (user_id) DO UPDATE SET onboarding_complete = true`,
    [userId]
  );

  // Demo group
  const groupResult = await pool.query(
    `INSERT INTO groups (name, invite_code, contribution_amount, frequency, max_members, next_collection_date, status, created_by)
     VALUES ('Demo Ajo Group', 'DEMO01', 5000, 'weekly', 5, NOW() + INTERVAL '7 days', 'active', $1)
     ON CONFLICT (invite_code) DO UPDATE SET name = 'Demo Ajo Group'
     RETURNING id`,
    [userId]
  );
  const groupId = groupResult.rows[0].id;

  await pool.query(
    'INSERT INTO group_members (group_id, user_id, rotation_position) VALUES ($1, $2, 1) ON CONFLICT DO NOTHING',
    [groupId, userId]
  );

  // Demo savings goal
  await pool.query(
    `INSERT INTO savings_goals
       (user_id, name, target_amount, locked_balance, frequency, deadline, instalment_amount, next_debit_date, status)
     VALUES ($1, 'Annual Rent', 500000, 125000, 'monthly', '2026-12-31', 41666.67, NOW() + INTERVAL '30 days', 'active')
     ON CONFLICT DO NOTHING`,
    [userId]
  );

  // Demo escrow
  await pool.query(
    `INSERT INTO escrows
       (creator_user_id, amount, description, payment_code, status, creator_confirmed)
     VALUES ($1, 50000, 'Payment for web design work', 'esc_demo01', 'funded', false)
     ON CONFLICT DO NOTHING`,
    [userId]
  );

  console.log('Demo data seeded successfully');
  console.log('Demo login: demo@ajobi.com / demo1234');
  process.exit(0);
}

seed().catch(e => { console.error('Seed failed:', e.message); process.exit(1); });