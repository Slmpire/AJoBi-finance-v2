const cron = require('node-cron');
const pool = require('../config/db');

// Runs daily at 9am — checks for savings goals due today and creates instalment records
cron.schedule('0 9 * * *', async () => {
  console.log('[CRON] Running savings instalment check...');

  try {
    const today = new Date().toISOString().split('T')[0];

    const dueGoals = await pool.query(
      `SELECT * FROM savings_goals
       WHERE status = 'active'
       AND next_debit_date::date <= $1`,
      [today]
    );

    for (const goal of dueGoals.rows) {
      const existing = await pool.query(
        `SELECT * FROM savings_instalments
         WHERE goal_id = $1 AND status = 'pending'`,
        [goal.id]
      );

      if (existing.rows.length === 0) {
        await pool.query(
          `INSERT INTO savings_instalments (goal_id, user_id, amount, status)
           VALUES ($1, $2, $3, 'pending')`,
          [goal.id, goal.user_id, goal.instalment_amount]
        );
        console.log(`[CRON] Pending instalment created for goal ${goal.id}`);
      }
    }
  } catch (err) {
    console.error('[CRON] Savings instalment error:', err.message);
  }
});

console.log('[CRON] Savings instalment job registered');