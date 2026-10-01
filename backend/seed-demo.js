require('dotenv').config();
const pool = require('./src/config/db');
const bcrypt = require('bcrypt');

async function seed() {
  console.log('🌱 Seeding 2-member demo...');

  // Clean slate for demo tables
  await pool.query(`DELETE FROM group_disbursements WHERE group_id IN (SELECT id FROM groups WHERE name = 'Demo Ajo Group')`);
  await pool.query(`DELETE FROM group_payments WHERE group_id IN (SELECT id FROM groups WHERE name = 'Demo Ajo Group')`);
  await pool.query(`DELETE FROM group_members WHERE group_id IN (SELECT id FROM groups WHERE name = 'Demo Ajo Group')`);
  await pool.query(`DELETE FROM groups WHERE name = 'Demo Ajo Group'`);
  await pool.query(`DELETE FROM ajo_scores WHERE user_id IN (SELECT id FROM users WHERE email IN ('alice@demo.com','bob@demo.com'))`);
  await pool.query(`DELETE FROM score_history WHERE user_id IN (SELECT id FROM users WHERE email IN ('alice@demo.com','bob@demo.com'))`);
  await pool.query(`DELETE FROM score_events WHERE user_id IN (SELECT id FROM users WHERE email IN ('alice@demo.com','bob@demo.com'))`);
  await pool.query(`DELETE FROM onboarding_progress WHERE user_id IN (SELECT id FROM users WHERE email IN ('alice@demo.com','bob@demo.com'))`);
  await pool.query(`DELETE FROM users WHERE email IN ('alice@demo.com','bob@demo.com')`);

  const hash = await bcrypt.hash('demo1234', 10);

  // Create Member A — Alice
  const aliceResult = await pool.query(
    `INSERT INTO users (full_name, email, phone, password_hash, is_verified, bank_account, bank_code, account_name)
     VALUES ($1,$2,$3,$4,true,$5,$6,$7) RETURNING id`,
    ['Alice Adeyemi', 'alice@demo.com', '+2348011111111', hash, '0123456789', '058', 'Alice Adeyemi']
  );
  const aliceId = aliceResult.rows[0].id;

  // Create Member B — Bob
  const bobResult = await pool.query(
    `INSERT INTO users (full_name, email, phone, password_hash, is_verified, bank_account, bank_code, account_name)
     VALUES ($1,$2,$3,$4,true,$5,$6,$7) RETURNING id`,
    ['Bob Okafor', 'bob@demo.com', '+2348022222222', hash, '0987654321', '057', 'Bob Okafor']
  );
  const bobId = bobResult.rows[0].id;

  // Give both users AjoScores (post-onboarding)
  for (const [userId, score] of [[aliceId, 62], [bobId, 58]]) {
    await pool.query(
      `INSERT INTO ajo_scores (user_id, total_score, savings_consistency, repayment_behaviour,
        transaction_history, escrow_completion, community_standing, account_maturity)
       VALUES ($1,$2,12,11,8,5,14,4)
       ON CONFLICT (user_id) DO UPDATE SET total_score = $2`,
      [userId, score]
    );

    await pool.query(
      `INSERT INTO score_events (user_id, points, reason, event_type)
       VALUES ($1, $2, 'Completed onboarding', 'onboarding')`,
      [userId, score]
    );
  }

  // Mark onboarding complete for both
  for (const userId of [aliceId, bobId]) {
    await pool.query(
      `INSERT INTO onboarding_progress (user_id, current_step, completed)
       VALUES ($1, 5, true)
       ON CONFLICT (user_id) DO UPDATE SET current_step = 5, completed = true`,
      [userId]
    );
  }

  // Create the demo group — Alice is creator (position 1), Bob joins (position 2)
  const groupResult = await pool.query(
    `INSERT INTO groups (name, invite_code, contribution_amount, frequency, max_members,
       next_collection_date, created_by, status, current_cycle)
     VALUES ($1,$2,$3,$4,$5, NOW() + INTERVAL '1 minute',$6,'active',1)
     RETURNING *`,
    ['Demo Ajo Group', 'DEMO01', 5000, 'weekly', 2, aliceId]
  );
  const group = groupResult.rows[0];

  // Add members
  await pool.query(
    `INSERT INTO group_members (group_id, user_id, rotation_position) VALUES ($1,$2,1)`,
    [group.id, aliceId]
  );
  await pool.query(
    `INSERT INTO group_members (group_id, user_id, rotation_position) VALUES ($1,$2,2)`,
    [group.id, bobId]
  );

  // Pre-create payment records for cycle 1 (both pending)
  const aliceRef = `GRP-${group.id}-U${aliceId}-C1-${Date.now()}`;
  const bobRef = `GRP-${group.id}-U${bobId}-C1-${Date.now() + 1}`;

  await pool.query(
    `INSERT INTO group_payments (group_id, user_id, cycle_number, amount, status, nomba_reference)
     VALUES ($1,$2,1,$3,'pending',$4)`,
    [group.id, aliceId, 5000, aliceRef]
  );
  await pool.query(
    `INSERT INTO group_payments (group_id, user_id, cycle_number, amount, status, nomba_reference)
     VALUES ($1,$2,1,$3,'pending',$4)`,
    [group.id, bobId, 5000, bobRef]
  );

  console.log('\n✅ Demo seed complete!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👤 Member A — Alice');
  console.log('   Email:    alice@demo.com');
  console.log('   Password: demo1234');
  console.log('   Score:    62 (Builder tier)');
  console.log('   Payout:   Cycle 1 (gets the pot first)');
  console.log('');
  console.log('👤 Member B — Bob');
  console.log('   Email:    bob@demo.com');
  console.log('   Password: demo1234');
  console.log('   Score:    58 (Builder tier)');
  console.log('   Payout:   Cycle 2');
  console.log('');
  console.log('🏦 Group: Demo Ajo Group');
  console.log(`   ID:          ${group.id}`);
  console.log('   Invite code: DEMO01');
  console.log('   Amount:      ₦5,000/week each');
  console.log('   Pot:         ₦10,000');
  console.log('');
  console.log('📋 Alice payment ref:', aliceRef);
  console.log('📋 Bob payment ref:  ', bobRef);
  console.log('');
  console.log('🎬 DEMO FLOW:');
  console.log('   1. Login as Alice → see score 62 + virtual account');
  console.log('   2. Login as Bob → see score 58 + virtual account');
  console.log('   3. Open group DEMO01 → both pending payments visible');
  console.log(`   4. POST /api/groups/${group.id}/simulate-payout → triggers full cycle`);
  console.log('   5. Alice score jumps → disbursement logged → cycle advances to 2');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await pool.end();
}

seed().catch(err => { console.error(err); process.exit(1); });
