const pool = require('../config/db');
const { success, fail } = require('../utils/response');
const { getTierInfo, getFeatureGates } = require('../utils/scoreFormulas');

function buildBreakdown(row) {
  return {
    savings_consistency: { score: row.savings_consistency, weight: 15, label: 'Savings Consistency', explanation: 'How consistently you save and contribute' },
    repayment_behaviour: { score: row.repayment_behaviour, weight: 15, label: 'Repayment Behaviour', explanation: 'Your track record repaying borrowed funds' },
    escrow_completion: { score: row.escrow_completion, weight: 15, label: 'Escrow Completion', explanation: 'Escrow transactions completed without disputes' },
    transaction_history: { score: row.transaction_history, weight: 15, label: 'Transaction History', explanation: 'Volume and frequency of platform transactions' },
    account_maturity: { score: row.account_maturity, weight: 5, label: 'Account Maturity', explanation: 'How long you have been active on AjoBI' },
    community_standing: { score: row.community_standing, weight: 15, label: 'Community Standing', explanation: 'Based on your trade, location, and peer standing' },
  };
}

async function getMyScore(req, res, next) {
  try {
    const result = await pool.query(
      'SELECT * FROM ajo_scores WHERE user_id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return fail(res, 'Score record not found', 404);
    }

    const row = result.rows[0];
    const tierInfo = getTierInfo(row.score);
    const { unlocked, locked } = getFeatureGates(row.score);
    const breakdown = buildBreakdown(row);

    const improvementTips = [];
    if (row.savings_consistency < 15) improvementTips.push('Keep contributing to your Ajo groups and savings goals consistently');
    if (row.escrow_completion < 10) improvementTips.push('Complete more escrow transactions to build trust');
    if (row.transaction_history < 10) improvementTips.push('Stay active on the platform to grow your transaction history');

    return success(res, {
      score: row.score,
      tier: tierInfo.name,
      tier_color: tierInfo.color,
      next_tier: tierInfo.next,
      points_to_next_tier: tierInfo.points_to_next,
      breakdown,
      unlocked_features: unlocked,
      locked_features: locked,
      improvement_tips: improvementTips,
    }, 'AjoScore fetched successfully');
  } catch (err) {
    next(err);
  }
}

async function submitOnboarding(req, res, next) {
  // Kept for compatibility with scoreService.ts's submitOnboarding call.
  // The real onboarding logic lives in setupController's step endpoints;
  // this just forwards to the same place if hit directly.
  return fail(res, 'Use /api/setup/step1 through step5 to complete onboarding', 400);
}

async function uploadBankStatement(req, res, next) {
  try {
    if (!req.file) {
      return fail(res, 'No file uploaded', 400);
    }

    // Gemini integration happens here later via GeminiService.
    // For now, acknowledge upload and keep score unchanged so the
    // frontend flow isn't blocked while Gemini wiring is pending.
    return success(res, {
      message: 'Bank statement received. Scoring update coming soon.',
    }, 'Bank statement uploaded');
  } catch (err) {
    next(err);
  }
}

async function getScoreHistory(req, res, next) {
  try {
    const { days = 30 } = req.query;

    const result = await pool.query(
      `SELECT new_score as score, created_at as date
       FROM score_history
       WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days, 10)} days'
       ORDER BY created_at ASC`,
      [req.user.id]
    );

    return success(res, result.rows, 'Score history fetched successfully');
  } catch (err) {
    next(err);
  }
}

async function getScoreEvents(req, res, next) {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT id as event_id, event_type, points, direction, reason, created_at
       FROM score_events
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.user.id, limit, offset]
    );

    return success(res, result.rows, 'Score events fetched successfully');
  } catch (err) {
    next(err);
  }
}

async function getEligibility(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM ajo_scores WHERE user_id = $1', [req.user.id]);

    if (result.rows.length === 0) {
      return fail(res, 'Score record not found', 404);
    }

    const score = result.rows[0].score;

    return success(res, {
      loan_eligible: false,
      loan_conditions: {
        score_met: { required: 70, current: score, passed: score >= 70 },
        tenure_met: { required_days: 90, current_days: 0, passed: false, days_remaining: 90 },
        ajo_member: { passed: false },
        consistency_met: { required_percent: 80, current_percent: 0, passed: false },
        no_disputes: { passed: true },
        no_default: { passed: true },
      },
      loan_eligibility_message: 'Micro-credit is not yet available on AjoBI. Coming soon.',
      group_tiers_available: score >= 30 ? ['standard'] : [],
      escrow_eligible: true,
      instalment_eligible: true,
      insurance_eligible: false,
    }, 'Eligibility fetched successfully');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMyScore,
  submitOnboarding,
  uploadBankStatement,
  getScoreHistory,
  getScoreEvents,
  getEligibility,
};