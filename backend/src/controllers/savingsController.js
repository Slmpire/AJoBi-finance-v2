const pool = require('../config/db');
const { success, fail } = require('../utils/response');
const NombaService = require('../services/NombaService');
const { updateScore } = require('../services/ScoreService');

async function createGoal(req, res, next) {
  try {
    const { name, target_amount, deadline, frequency } = req.body;

    if (!name || !target_amount || !deadline || !frequency) {
      return fail(res, 'All fields are required', 400);
    }

    if (!['weekly', 'monthly'].includes(frequency)) {
      return fail(res, 'Frequency must be weekly or monthly', 400);
    }

    const deadlineDate = new Date(deadline);
    const now = new Date();

    if (deadlineDate <= now) {
      return fail(res, 'Deadline must be in the future', 400);
    }

    const diffMs = deadlineDate - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const periods = frequency === 'weekly'
      ? Math.ceil(diffDays / 7)
      : Math.ceil(diffDays / 30);

    if (periods < 1) {
      return fail(res, 'Deadline is too soon for this frequency', 400);
    }

    const instalment = parseFloat((target_amount / periods).toFixed(2));

    const nextDebitDate = new Date();
    if (frequency === 'weekly') nextDebitDate.setDate(nextDebitDate.getDate() + 7);
    else nextDebitDate.setMonth(nextDebitDate.getMonth() + 1);

    const result = await pool.query(
      `INSERT INTO savings_goals
         (user_id, name, target_amount, frequency, deadline, instalment_amount, next_debit_date, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending_payment_setup')
       RETURNING *`,
      [req.user.id, name, target_amount, frequency, deadline, instalment, nextDebitDate]
    );

    const goal = result.rows[0];

    return success(res, {
      goal,
      instalment_breakdown: {
        instalment_amount: instalment,
        frequency,
        periods,
        deadline,
        total: target_amount,
      },
    }, 'Savings goal created successfully', 201);
  } catch (err) {
    next(err);
  }
}

async function setupGoalPayment(req, res, next) {
  try {
    const { id } = req.params;

    const goalResult = await pool.query(
      'SELECT * FROM savings_goals WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (goalResult.rows.length === 0) {
      return fail(res, 'Goal not found', 404);
    }

    const goal = goalResult.rows[0];
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = userResult.rows[0];

    const orderReference = `SAV-${goal.id}-USR-${req.user.id}-${Date.now()}`;

    const checkout = await NombaService.createCheckoutOrder({
      amount: parseFloat(goal.instalment_amount),
      customerEmail: user.email,
      orderReference,
      customerId: String(user.id),
      narration: `${goal.name} - savings instalment`,
    });

    await pool.query(
      `INSERT INTO savings_instalments (goal_id, user_id, amount, status, nomba_reference)
       VALUES ($1, $2, $3, 'pending', $4)`,
      [goal.id, req.user.id, goal.instalment_amount, orderReference]
    );

    await pool.query(
      `UPDATE savings_goals SET status = 'active' WHERE id = $1`,
      [goal.id]
    );

    return success(res, {
      checkout_link: checkout.checkoutLink,
      order_reference: orderReference,
      amount: goal.instalment_amount,
      instructions: `Pay ₦${goal.instalment_amount} to make your first instalment toward ${goal.name}.`,
    }, 'Payment setup created');
  } catch (err) {
    next(err);
  }
}

async function getMyGoals(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT *,
        ROUND((locked_balance / NULLIF(target_amount, 0)) * 100, 1) as progress_percent
       FROM savings_goals
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    return success(res, result.rows, 'Goals fetched successfully');
  } catch (err) {
    next(err);
  }
}

async function getGoalById(req, res, next) {
  try {
    const { id } = req.params;

    const goalResult = await pool.query(
      `SELECT *,
        ROUND((locked_balance / NULLIF(target_amount, 0)) * 100, 1) as progress_percent
       FROM savings_goals WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );

    if (goalResult.rows.length === 0) {
      return fail(res, 'Goal not found', 404);
    }

    const instalments = await pool.query(
      `SELECT * FROM savings_instalments WHERE goal_id = $1 ORDER BY paid_at DESC NULLS LAST`,
      [id]
    );

    const goal = goalResult.rows[0];
    const deadline = new Date(goal.deadline);
    const today = new Date();
    const remaining = parseFloat(goal.target_amount) - parseFloat(goal.locked_balance);
    const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    const periodsLeft = goal.frequency === 'weekly'
      ? Math.ceil(daysLeft / 7)
      : Math.ceil(daysLeft / 30);
    const projectedCompletion = periodsLeft > 0 && remaining > 0
      ? `${periodsLeft} more ${goal.frequency} payments`
      : 'Goal complete';

    return success(res, {
      goal,
      instalments: instalments.rows,
      projected_completion: projectedCompletion,
    }, 'Goal fetched successfully');
  } catch (err) {
    next(err);
  }
}

async function breakGoal(req, res, next) {
  try {
    const { id } = req.params;

    const goalResult = await pool.query(
      'SELECT * FROM savings_goals WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (goalResult.rows.length === 0) {
      return fail(res, 'Goal not found', 404);
    }

    const goal = goalResult.rows[0];

    if (goal.status === 'broken') {
      return fail(res, 'Goal is already broken', 400);
    }

    if (goal.status === 'completed') {
      return fail(res, 'Cannot break a completed goal', 400);
    }

    await pool.query(
      `UPDATE savings_goals SET status = 'broken' WHERE id = $1`,
      [id]
    );

    await updateScore(req.user.id, -3, 'Broke a savings goal', 'savings_broken');

    return success(res, {
      released_amount: goal.locked_balance,
      score_penalty: -3,
    }, 'Goal broken. Funds will be released to your wallet.');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createGoal,
  setupGoalPayment,
  getMyGoals,
  getGoalById,
  breakGoal,
};