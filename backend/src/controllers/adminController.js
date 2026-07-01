const pool = require('../config/db');
const { success, fail } = require('../utils/response');

async function getTransactions(req, res, next) {
  try {
    const { limit = 50, offset = 0, type } = req.query;

    let rows = [];

    if (!type || type === 'group') {
      const groupPayments = await pool.query(
        `SELECT gp.id, 'group_payment' as type, gp.amount, gp.status,
                gp.paid_at as date, u.full_name, u.email,
                g.name as group_name, gp.nomba_reference as reference
         FROM group_payments gp
         JOIN users u ON u.id = gp.user_id
         JOIN groups g ON g.id = gp.group_id
         ORDER BY gp.paid_at DESC NULLS LAST
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      rows = [...rows, ...groupPayments.rows];
    }

    if (!type || type === 'savings') {
      const savingsPayments = await pool.query(
        `SELECT si.id, 'savings_instalment' as type, si.amount, si.status,
                si.paid_at as date, u.full_name, u.email,
                sg.name as goal_name, si.nomba_reference as reference
         FROM savings_instalments si
         JOIN users u ON u.id = si.user_id
         JOIN savings_goals sg ON sg.id = si.goal_id
         ORDER BY si.paid_at DESC NULLS LAST
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      rows = [...rows, ...savingsPayments.rows];
    }

    if (!type || type === 'escrow') {
      const escrows = await pool.query(
        `SELECT e.id, 'escrow' as type, e.amount, e.status,
                e.created_at as date, u.full_name, u.email,
                e.description, e.nomba_reference as reference
         FROM escrows e
         JOIN users u ON u.id = e.creator_user_id
         ORDER BY e.created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      rows = [...rows, ...escrows.rows];
    }

    rows.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

    return success(res, rows, 'Transactions fetched successfully');
  } catch (err) {
    next(err);
  }
}

async function getDisputedEscrows(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT e.*,
         creator.full_name as creator_name, creator.email as creator_email,
         recipient.full_name as recipient_name, recipient.email as recipient_email
       FROM escrows e
       LEFT JOIN users creator ON creator.id = e.creator_user_id
       LEFT JOIN users recipient ON recipient.id = e.recipient_user_id
       WHERE e.status = 'disputed'
       ORDER BY e.created_at DESC`
    );

    return success(res, result.rows, 'Disputed escrows fetched successfully');
  } catch (err) {
    next(err);
  }
}

async function releaseEscrow(req, res, next) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE escrows SET status = 'released', released_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) return fail(res, 'Escrow not found', 404);

    return success(res, result.rows[0], 'Escrow released by admin');
  } catch (err) {
    next(err);
  }
}

async function refundEscrow(req, res, next) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE escrows SET status = 'refunded' WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) return fail(res, 'Escrow not found', 404);

    return success(res, result.rows[0], 'Escrow refunded by admin');
  } catch (err) {
    next(err);
  }
}

async function getUsers(req, res, next) {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT u.id, u.full_name, u.email, u.phone, u.role, u.status,
              u.created_at, a.score, a.tier
       FROM users u
       LEFT JOIN ajo_scores a ON a.user_id = u.id
       ORDER BY u.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return success(res, result.rows, 'Users fetched successfully');
  } catch (err) {
    next(err);
  }
}

async function banUser(req, res, next) {
  try {
    const { id } = req.params;

    if (parseInt(id, 10) === req.user.id) {
      return fail(res, 'You cannot ban yourself', 400);
    }

    const result = await pool.query(
      `UPDATE users SET status = 'banned' WHERE id = $1 RETURNING id, full_name, status`,
      [id]
    );

    if (result.rows.length === 0) return fail(res, 'User not found', 404);

    return success(res, result.rows[0], 'User banned successfully');
  } catch (err) {
    next(err);
  }
}

async function unbanUser(req, res, next) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE users SET status = 'active' WHERE id = $1 RETURNING id, full_name, status`,
      [id]
    );

    if (result.rows.length === 0) return fail(res, 'User not found', 404);

    return success(res, result.rows[0], 'User unbanned successfully');
  } catch (err) {
    next(err);
  }
}

async function getStats(req, res, next) {
  try {
    const [users, groups, savings, escrows, scores] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query('SELECT COUNT(*) FROM groups'),
      pool.query(`SELECT COUNT(*) FROM savings_goals WHERE status = 'active'`),
      pool.query(`SELECT COUNT(*) FROM escrows WHERE status != 'released'`),
      pool.query('SELECT AVG(score) as avg_score FROM ajo_scores'),
    ]);

    return success(res, {
      total_users: parseInt(users.rows[0].count, 10),
      total_groups: parseInt(groups.rows[0].count, 10),
      active_savings_goals: parseInt(savings.rows[0].count, 10),
      active_escrows: parseInt(escrows.rows[0].count, 10),
      average_ajo_score: parseFloat(scores.rows[0].avg_score || 0).toFixed(1),
    }, 'Stats fetched successfully');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getTransactions,
  getDisputedEscrows,
  releaseEscrow,
  refundEscrow,
  getUsers,
  banUser,
  unbanUser,
  getStats,
};