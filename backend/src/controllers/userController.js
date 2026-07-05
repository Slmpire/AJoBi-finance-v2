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
      `UPDATE users SET beneficiary_account = $1, account_name = $2, updated_at = NOW() WHERE id = $3`,
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
           COALESCE(SUM(locked_balance), 0) as total_saved,
           COALESCE(SUM(target_amount), 0) as total_target
         FROM savings_goals WHERE user_id = $1 AND status != 'broken'`,
        [req.user.id]
      ),
      pool.query(
        `SELECT COUNT(*) as total FROM escrows
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
        active: parseInt(groupsRes.rows[0].active || 0, 10),
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

async function submitKYC(req, res, next) {
  try {
    const { bvn, account_number, account_name, bank_code } = req.body;

    // BVN validation — any 11 digits for hackathon
    if (!bvn || !/^\d{11}$/.test(bvn)) {
      return fail(res, 'BVN must be exactly 11 digits', 400);
    }

    if (!account_number || !account_name || !bank_code) {
      return fail(res, 'Account number, account name and bank code are required', 400);
    }

    await pool.query(
      `UPDATE users
       SET bvn = $1, beneficiary_account = $2, account_name = $3, updated_at = NOW()
       WHERE id = $4`,
      [bvn, account_number, account_name, req.user.id]
    );

    return success(res, {
      kyc_status: 'verified',
      bvn_verified: true,
      account_verified: true,
    }, 'KYC submitted successfully');
  } catch (err) {
    next(err);
  }
}

async function getVirtualAccount(req, res, next) {
  try {
    const result = await pool.query(
      'SELECT * FROM virtual_accounts WHERE user_id = $1',
      [req.user.id]
    );

    if (result.rows.length > 0) {
      return success(res, result.rows[0], 'Virtual account fetched');
    }

    return success(res, null, 'No virtual account found');
  } catch (err) {
    next(err);
  }
}

async function createVirtualAccount(req, res, next) {
  try {
    const existing = await pool.query(
      'SELECT * FROM virtual_accounts WHERE user_id = $1',
      [req.user.id]
    );

    if (existing.rows.length > 0) {
      return success(res, existing.rows[0], 'Virtual account already exists');
    }

    const userResult = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [req.user.id]
    );
    const user = userResult.rows[0];

    const accountRef = `AJOBI-USR-${req.user.id}-${Date.now()}`;

    const NombaService = require('../services/NombaService');
    const account = await NombaService.createVirtualAccount({
      accountRef,
      accountName: user.full_name,
      bvn: user.bvn || '00000000000',
      currency: 'NGN',
    });

    await pool.query(
      `INSERT INTO virtual_accounts
         (user_id, account_number, account_name, bank_name, bank_code, account_ref)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        req.user.id,
        account.bankAccountNumber || account.accountNumber,
        account.accountName || user.full_name,
        account.bankName || 'Nomba MFB',
        account.bankCode || '000026',
        accountRef,
      ]
    );

    const saved = await pool.query(
      'SELECT * FROM virtual_accounts WHERE user_id = $1',
      [req.user.id]
    );

    return success(res, saved.rows[0], 'Virtual account created successfully');
  } catch (err) {
    next(err);
  }
}

async function createGroupVirtualAccount(req, res, next) {
  try {
    const { group_id } = req.body;

    // Simulate virtual account creation for hackathon
    const accountNumber = '920' + Math.floor(Math.random() * 10000000).toString().padStart(7, '0');

    return success(res, {
      account_number: accountNumber,
      account_name: 'AjoBI Group Collection',
      bank_name: 'Nomba MFB',
      group_id,
    }, 'Group virtual account ready');
  } catch (err) {
    next(err);
  }
}

async function recordGroupPayment(req, res, next) {
  try {
    const { group_id } = req.body;

    const groupResult = await pool.query('SELECT * FROM groups WHERE id = $1', [group_id]);
    if (groupResult.rows.length === 0) return fail(res, 'Group not found', 404);

    const group = groupResult.rows[0];

    const existing = await pool.query(
      `SELECT * FROM group_payments WHERE group_id = $1 AND user_id = $2 AND cycle_number = $3`,
      [group_id, req.user.id, group.current_cycle]
    );

    if (existing.rows.length > 0 && existing.rows[0].status === 'paid') {
      return fail(res, 'You have already paid for this cycle', 400);
    }

    await pool.query(
      `INSERT INTO group_payments (group_id, user_id, cycle_number, amount, status, paid_at)
       VALUES ($1, $2, $3, $4, 'paid', NOW())
       ON CONFLICT DO NOTHING`,
      [group_id, req.user.id, group.current_cycle, group.contribution_amount]
    );

    return success(res, { paid: true }, 'Payment recorded');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProfile,
  updateProfile,
  updateBeneficiary,
  getDashboardSummary,
  submitKYC,
  getVirtualAccount,
  createVirtualAccount,
  createGroupVirtualAccount,
  recordGroupPayment,
};