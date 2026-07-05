require('dotenv').config();
const pool = require('./src/config/db');
const bcrypt = require('bcrypt');

async function seed() {
  console.log('Seeding demo data...');

  // Demo user
  const hash = await bcrypt.hash('demo1234', 10);
  let userId;

  const existingUser = await pool.query(
    'SELECT id FROM users WHERE email = $1',
    ['demo@ajobi.com']
  );

  if (existingUser.rows.length > 0) {
    userId = existingUser.rows[0].id;
    console.log('Demo user already exists, skipping creation');
  } else {
    const userResult = await pool.query(
      `INSERT INTO users (full_name, email, phone, password_hash, role)
       VALUES ('Demo User', 'demo@ajobi.com', '08099999999', $1, 'user')
       RETURNING id`,
      [hash]
    );
    userId = userResult.rows[0].id;
  }

  // AjoScore
  const existingScore = await pool.query(
    'SELECT id FROM ajo_scores WHERE user_id = $1', [userId]
  );
  if (existingScore.rows.length === 0) {
    await pool.query(
      `INSERT INTO ajo_scores (user_id, score, tier, savings_consistency, repayment_behaviour, account_maturity, community_standing)
       VALUES ($1, 65, 'Builder', 15, 15, 5, 13)`,
      [userId]
    );
  } else {
    await pool.query(
      `UPDATE ajo_scores SET score = 65, tier = 'Builder' WHERE user_id = $1`,
      [userId]
    );
  }

  // Onboarding
  const existingOnboarding = await pool.query(
    'SELECT id FROM onboarding_progress WHERE user_id = $1', [userId]
  );
  if (existingOnboarding.rows.length === 0) {
    await pool.query(
      `INSERT INTO onboarding_progress
         (user_id, occupation, trade_duration, state, lga, income_range,
          saves_money, in_ajo_group, contribution_consistency,
          has_borrowed, repaid_fully, repaid_on_time, language,
          steps_completed, current_step, onboarding_complete)
       VALUES ($1, 'Software Developer', '1_3_years', 'Lagos', 'Ikeja', '100k_500k',
          true, true, 'always_on_time', false, false, false, 'english',
          '{1,2,3,4,5}', 6, true)`,
      [userId]
    );
  } else {
    await pool.query(
      `UPDATE onboarding_progress SET onboarding_complete = true, steps_completed = '{1,2,3,4,5}', current_step = 6 WHERE user_id = $1`,
      [userId]
    );
  }

  // Demo group
  let groupId;
  const existingGroup = await pool.query(
    'SELECT id FROM groups WHERE invite_code = $1', ['DEMO01']
  );
  if (existingGroup.rows.length === 0) {
    const groupResult = await pool.query(
      `INSERT INTO groups (name, invite_code, contribution_amount, frequency, max_members, next_collection_date, status, created_by)
       VALUES ('Demo Ajo Group', 'DEMO01', 5000, 'weekly', 5, NOW() + INTERVAL '7 days', 'active', $1)
       RETURNING id`,
      [userId]
    );
    groupId = groupResult.rows[0].id;
  } else {
    groupId = existingGroup.rows[0].id;
    console.log('Demo group already exists, skipping creation');
  }

  // Group member
  const existingMember = await pool.query(
    'SELECT id FROM group_members WHERE group_id = $1 AND user_id = $2',
    [groupId, userId]
  );
  if (existingMember.rows.length === 0) {
    await pool.query(
      'INSERT INTO group_members (group_id, user_id, rotation_position) VALUES ($1, $2, 1)',
      [groupId, userId]
    );
  }

  // Demo savings goal
  const existingGoal = await pool.query(
    'SELECT id FROM savings_goals WHERE user_id = $1 AND name = $2',
    [userId, 'Annual Rent']
  );
  if (existingGoal.rows.length === 0) {
    await pool.query(
      `INSERT INTO savings_goals
         (user_id, name, target_amount, locked_balance, frequency, deadline, instalment_amount, next_debit_date, status)
       VALUES ($1, 'Annual Rent', 500000, 125000, 'monthly', '2026-12-31', 41666.67, NOW() + INTERVAL '30 days', 'active')`,
      [userId]
    );
  }

  // Demo escrow
  const existingEscrow = await pool.query(
    'SELECT id FROM escrows WHERE payment_code = $1', ['esc_demo01']
  );
  if (existingEscrow.rows.length === 0) {
    await pool.query(
      `INSERT INTO escrows
         (creator_user_id, amount, description, payment_code, status, creator_confirmed)
       VALUES ($1, 50000, 'Payment for web design work', 'esc_demo01', 'funded', false)`,
      [userId]
    );
  }

  console.log('Demo data seeded successfully');
  console.log('Demo login: demo@ajobi.com / demo1234');
  console.log('Admin login: admin@ajobi.com / AjoBI2024!');
  process.exit(0);
}

seed().catch(e => {
  console.error('Seed failed:', e.message);
  process.exit(1);
});