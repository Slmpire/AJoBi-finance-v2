const pool = require('../config/db');

async function updateScore(userId, delta, reason, eventType = 'general') {
  const scoreResult = await pool.query('SELECT score FROM ajo_scores WHERE user_id = $1', [userId]);

  if (scoreResult.rows.length === 0) return;

  const oldScore = scoreResult.rows[0].score;
  const newScore = Math.max(0, Math.min(100, oldScore + delta));

  await pool.query('UPDATE ajo_scores SET score = $1, updated_at = NOW() WHERE user_id = $2', [newScore, userId]);

  await pool.query(
    'INSERT INTO score_history (user_id, old_score, new_score, reason) VALUES ($1, $2, $3, $4)',
    [userId, oldScore, newScore, reason]
  );

  await pool.query(
    'INSERT INTO score_events (user_id, event_type, points, direction, reason) VALUES ($1, $2, $3, $4, $5)',
    [userId, eventType, Math.abs(delta), delta >= 0 ? 'up' : 'down', reason]
  );
}

module.exports = { updateScore };