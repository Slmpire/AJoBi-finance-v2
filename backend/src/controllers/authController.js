const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { success, fail } = require('../utils/response');

async function register(req, res, next) {
  try {
    const { full_name, email, phone, password } = req.body;

    if (!full_name || !email || !password) {
      return fail(res, 'Full name, email and password are required', 400);
    }

    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      return fail(res, 'An account with this email already exists', 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, phone, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, full_name, email, phone, role`,
      [full_name, email, phone, passwordHash]
    );

    const user = result.rows[0];

    // Create starter rows so later features have something to read/update
    await pool.query(
      'INSERT INTO ajo_scores (user_id) VALUES ($1)',
      [user.id]
    );
    await pool.query(
      'INSERT INTO onboarding_progress (user_id) VALUES ($1)',
      [user.id]
    );

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return success(res, {
  user: { ...user, user_id: user.id },
  user_id: user.id,
  token,
}, 'Account created successfully', 201);
  } catch (err) {
    next(err);
  }
}
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return fail(res, 'Email and password are required', 400);
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return fail(res, 'Invalid email or password', 401);
    }

    const user = result.rows[0];

    if (user.status === 'banned') {
      return fail(res, 'This account has been suspended', 403);
    }

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return fail(res, 'Invalid email or password', 401);
    }

    const [scoreResult, onboardingResult] = await Promise.all([
      pool.query('SELECT score, tier FROM ajo_scores WHERE user_id = $1', [user.id]),
      pool.query('SELECT onboarding_complete, current_step FROM onboarding_progress WHERE user_id = $1', [user.id]),
    ]);

    const scoreRow = scoreResult.rows[0];
    const onboardingRow = onboardingResult.rows[0];

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    delete user.password_hash;

    return success(res, {
      user: { ...user, user_id: user.id },
      user_id: user.id,
      full_name: user.full_name,
      email: user.email,
      ajo_score: scoreRow?.score || 0,
      score_tier: scoreRow?.tier || 'Starter',
      onboarding_complete: onboardingRow?.onboarding_complete || false,
      token,
    }, 'Login successful');
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    const header = req.headers.authorization;
    const token = header.split(' ')[1];

    await pool.query(
      'INSERT INTO invalidated_tokens (token) VALUES ($1)',
      [token]
    );

    return success(res, null, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
}

async function getCurrentUser(req, res, next) {
  try {
    const result = await pool.query(
      'SELECT id, full_name, email, phone, role, status, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return fail(res, 'User not found', 404);
    }

    return success(res, result.rows[0], 'User fetched successfully');
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, logout, getCurrentUser };