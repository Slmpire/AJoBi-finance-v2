const cron = require('node-cron');
const pool = require('../config/db');

// Runs daily at 8am — checks for groups due today and flags unpaid members
cron.schedule('0 8 * * *', async () => {
  console.log('[CRON] Running group collection check...');

  try {
    const today = new Date().toISOString().split('T')[0];

    const dueGroups = await pool.query(
      `SELECT * FROM groups
       WHERE status = 'active'
       AND next_collection_date::date <= $1`,
      [today]
    );

    for (const group of dueGroups.rows) {
      const members = await pool.query(
        'SELECT * FROM group_members WHERE group_id = $1',
        [group.id]
      );

      for (const member of members.rows) {
        const existing = await pool.query(
          `SELECT * FROM group_payments
           WHERE group_id = $1 AND user_id = $2 AND cycle_number = $3`,
          [group.id, member.user_id, group.current_cycle]
        );

        if (existing.rows.length === 0) {
          // Member hasn't paid — create a pending payment record
          await pool.query(
            `INSERT INTO group_payments (group_id, user_id, cycle_number, amount, status)
             VALUES ($1, $2, $3, $4, 'pending')
             ON CONFLICT DO NOTHING`,
            [group.id, member.user_id, group.current_cycle, group.contribution_amount]
          );
          console.log(`[CRON] Pending payment created for user ${member.user_id} in group ${group.id}`);
        }
      }
    }
  } catch (err) {
    console.error('[CRON] Group collection error:', err.message);
  }
});

console.log('[CRON] Group collection job registered');