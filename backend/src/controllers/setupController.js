const pool = require('../config/db');
const { success, fail } = require('../utils/response');
const { calculateBaseScore } = require('../utils/scoreFormulas');

async function getProgress(req, res, next) {
  try {
    const result = await pool.query(
      'SELECT steps_completed, current_step, onboarding_complete FROM onboarding_progress WHERE user_id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return fail(res, 'Onboarding record not found', 404);
    }

    return success(res, result.rows[0], 'Progress fetched successfully');
  } catch (err) {
    next(err);
  }
}

async function submitStep1(req, res, next) {
  try {
    const { occupation } = req.body;

    if (!occupation) {
      return fail(res, 'Occupation is required', 400);
    }

    await pool.query(
      `UPDATE onboarding_progress
       SET occupation = $1,
           steps_completed = array_append(steps_completed, 1),
           current_step = 2,
           updated_at = NOW()
       WHERE user_id = $2`,
      [occupation, req.user.id]
    );

    return success(res, { step_completed: 1, next_step: 2 }, 'Step 1 saved');
  } catch (err) {
    next(err);
  }
}

async function submitStep2(req, res, next) {
  try {
    const { trade_duration, state, lga, income_range } = req.body;

    if (!trade_duration || !state || !lga || !income_range) {
      return fail(res, 'All fields in this step are required', 400);
    }

    await pool.query(
      `UPDATE onboarding_progress
       SET trade_duration = $1, state = $2, lga = $3, income_range = $4,
           steps_completed = array_append(steps_completed, 2),
           current_step = 3,
           updated_at = NOW()
       WHERE user_id = $5`,
      [trade_duration, state, lga, income_range, req.user.id]
    );

    return success(res, { step_completed: 2, next_step: 3 }, 'Step 2 saved');
  } catch (err) {
    next(err);
  }
}

async function submitStep3(req, res, next) {
  try {
    const { saves_money, savings_methods, in_ajo_group, contribution_consistency } = req.body;

    await pool.query(
      `UPDATE onboarding_progress
       SET saves_money = $1, savings_methods = $2, in_ajo_group = $3,
           contribution_consistency = $4,
           steps_completed = array_append(steps_completed, 3),
           current_step = 4,
           updated_at = NOW()
       WHERE user_id = $5`,
      [saves_money, savings_methods, in_ajo_group, contribution_consistency, req.user.id]
    );

    return success(res, { step_completed: 3, next_step: 4 }, 'Step 3 saved');
  } catch (err) {
    next(err);
  }
}

async function submitStep4(req, res, next) {
  try {
    const { has_borrowed, repaid_fully, repaid_on_time } = req.body;

    await pool.query(
      `UPDATE onboarding_progress
       SET has_borrowed = $1, repaid_fully = $2, repaid_on_time = $3,
           steps_completed = array_append(steps_completed, 4),
           current_step = 5,
           updated_at = NOW()
       WHERE user_id = $4`,
      [has_borrowed, repaid_fully, repaid_on_time, req.user.id]
    );

    return success(res, { step_completed: 4, next_step: 5 }, 'Step 4 saved');
  } catch (err) {
    next(err);
  }
}

async function submitStep5(req, res, next) {
  try {
    const { language, profile_photo } = req.body;

    const progressResult = await pool.query(
      'SELECT * FROM onboarding_progress WHERE user_id = $1',
      [req.user.id]
    );

    const progress = progressResult.rows[0];

    if (!progress) {
      return fail(res, 'Onboarding record not found', 404);
    }

    const breakdown = calculateBaseScore(progress);
    const totalScore = Object.values(breakdown).reduce((sum, item) => sum + item.score, 0);
    const tier = totalScore >= 70 ? 'Trusted' : totalScore >= 40 ? 'Builder' : 'Starter';

    await pool.query(
      `UPDATE onboarding_progress
       SET language = $1,
           steps_completed = array_append(steps_completed, 5),
           current_step = 6,
           onboarding_complete = TRUE,
           updated_at = NOW()
       WHERE user_id = $2`,
      [language, req.user.id]
    );

    if (profile_photo && typeof profile_photo === 'string') {
      await pool.query('UPDATE users SET profile_photo = $1 WHERE id = $2', [profile_photo, req.user.id]);
    }

    await pool.query(
      `UPDATE ajo_scores
       SET score = $1, tier = $2,
           savings_consistency = $3, repayment_behaviour = $4,
           escrow_completion = $5, transaction_history = $6,
           account_maturity = $7, community_standing = $8,
           updated_at = NOW()
       WHERE user_id = $9`,
      [
        totalScore, tier,
        breakdown.savings_consistency.score,
        breakdown.repayment_behaviour.score,
        breakdown.escrow_completion.score,
        breakdown.transaction_history.score,
        breakdown.account_maturity.score,
        breakdown.community_standing.score,
        req.user.id,
      ]
    );

    await pool.query(
      `INSERT INTO score_history (user_id, old_score, new_score, reason)
       VALUES ($1, 0, $2, 'Completed onboarding')`,
      [req.user.id, totalScore]
    );

    const improvementTips = [];
    if (breakdown.savings_consistency.score < breakdown.savings_consistency.weight) {
      improvementTips.push('Save consistently to boost your savings consistency score');
    }
    if (breakdown.repayment_behaviour.score < breakdown.repayment_behaviour.weight) {
      improvementTips.push('Repay any borrowed funds on time to improve this score');
    }
    if (breakdown.account_maturity.score < breakdown.account_maturity.weight) {
      improvementTips.push('Your score will grow naturally the longer you stay active on AjoBI');
    }

    return success(res, {
      onboarding_complete: true,
      ajo_score: totalScore,
      score_tier: tier,
      breakdown: {
        savings_consistency: breakdown.savings_consistency.score,
        repayment_behaviour: breakdown.repayment_behaviour.score,
        escrow_completion: breakdown.escrow_completion.score,
        transaction_history: breakdown.transaction_history.score,
        account_maturity: breakdown.account_maturity.score,
        community_standing: breakdown.community_standing.score,
      },
      explanation: `Your AjoScore is ${totalScore}/100 based on your onboarding answers. This will grow as you use the platform.`,
      improvement_tips: improvementTips,
    }, 'Onboarding completed successfully');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProgress,
  submitStep1,
  submitStep2,
  submitStep3,
  submitStep4,
  submitStep5,
};