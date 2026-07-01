const pool = require('../config/db');
const { success, fail } = require('../utils/response');

async function getProfile(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT u.id, u.full_name, u.email, u.phone, u.role, u.status,
              u.bvn, u.beneficiary_account, u.account_name,
              u.profile_photo, u.language, u.created_at,
              a.score, a.tier, a.updated_at as score_updated_at,
              o.onboarding_complete, o.current_step
       FROM users u
       LEFT JOIN ajo_scores a ON a.user_id = u.id
       LEFT JOIN onboarding_progress o ON o.user_id = u.id
       WHERE u.id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) return fail(res, 'User not found', 404);

    return success(res, result.rows[0], 'Profile fetched successfully');
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const { full_name, phone, language, profile_photo } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET full_name = COALESCE($1, full_name),
           phone = COALESCE($2, phone),
           language = COALESCE($3, language),
           profile_photo = COALESCE($4, profile_photo),
           updated_at = NOW()
       WHERE id = $5
       RETURNING id, full_name, email, phone, language, profile_photo`,
      [full_name, phone, language, profile_photo, req.user.id]
    );

    return success(res, result.rows[0], 'Profile updated successfully');
  } catch (err) {
    next(err);
  }
}

async function updateBeneficiary(req, res, next) {
  try {
    const { account_number, account_name, bank_code } = req.body;

    if (!account_number || !account_name || !bank_code) {
      return fail(res, 'Account number, account name and bank code are required', 400);
    }

    await pool.query(
      `UPDATE users
       SET beneficiary_account = $1, account_name = $2, updated_at = NOW()
       WHERE id = $3`,
      [account_number, account_name, req.user.id]
    );

    return success(res, null, 'Beneficiary account updated successfully');
  } catch (err) {
    next(err);
  }
}

async function getDashboardSummary(req, res, next) {
  try {
    const [scoreRes, groupsRes, savingsRes, escrowsRes] = await Promise.all([
      pool.query('SELECT score, tier FROM ajo_scores WHERE user_id = $1', [req.user.id]),
      pool.query(
        `SELECT COUNT(*) as total,
           SUM(CASE WHEN g.status = 'active' THEN 1 ELSE 0 END) as active
         FROM group_members gm
         JOIN groups g ON g.id = gm.group_id
         WHERE gm.user_id = $1`,
        [req.user.id]
      ),
      pool.query(
        `SELECT COUNT(*) as total,
           SUM(locked_balance) as total_saved,
           SUM(target_amount) as total_target
         FROM savings_goals WHERE user_id = $1 AND status != 'broken'`,
        [req.user.id]
      ),
      pool.query(
        `SELECT COUNT(*) as total
         FROM escrows
         WHERE (creator_user_id = $1 OR recipient_user_id = $1)
         AND status NOT IN ('released', 'refunded')`,
        [req.user.id]
      ),
    ]);

    return success(res, {
      ajo_score: scoreRes.rows[0]?.score || 0,
      score_tier: scoreRes.rows[0]?.tier || 'Starter',
      groups: {
        total: parseInt(groupsRes.rows[0].total, 10),
        active: parseInt(groupsRes.rows[0].active, 10),
      },
      savings: {
        total_goals: parseInt(savingsRes.rows[0].total, 10),
        total_saved: parseFloat(savingsRes.rows[0].total_saved || 0),
        total_target: parseFloat(savingsRes.rows[0].total_target || 0),
      },
      escrows: {
        active: parseInt(escrowsRes.rows[0].total, 10),
      },
    }, 'Dashboard summary fetched successfully');
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile, updateProfile, updateBeneficiary, getDashboardSummary };