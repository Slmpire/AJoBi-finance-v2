const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../config/db');
const { success } = require('../utils/response');

// Profile — alias to user profile
router.get('/profile', auth, async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, full_name, email, phone, language, profile_photo, bvn, beneficiary_account, account_name FROM users WHERE id = $1',
      [req.user.id]
    );
    return success(res, result.rows[0], 'Profile fetched');
  } catch (err) { next(err); }
});

router.put('/profile', auth, async (req, res, next) => {
  try {
    const { full_name, phone, language, profile_photo } = req.body;
    const result = await pool.query(
      `UPDATE users SET full_name = COALESCE($1, full_name), phone = COALESCE($2, phone),
       language = COALESCE($3, language), profile_photo = COALESCE($4, profile_photo), updated_at = NOW()
       WHERE id = $5 RETURNING id, full_name, email, phone, language, profile_photo`,
      [full_name, phone, language, profile_photo, req.user.id]
    );
    return success(res, result.rows[0], 'Profile updated');
  } catch (err) { next(err); }
});

// Security — stub for hackathon
router.get('/security', auth, async (req, res, next) => {
  return success(res, {
    two_factor_enabled: false,
    last_password_change: null,
    login_notifications: true,
  }, 'Security settings fetched');
});

router.put('/security', auth, async (req, res, next) => {
  return success(res, req.body, 'Security settings updated');
});

// Notifications — stub for hackathon
router.get('/notifications', auth, async (req, res, next) => {
  return success(res, {
    email_notifications: true,
    sms_notifications: true,
    push_notifications: false,
    contribution_reminders: true,
    payout_alerts: true,
    escrow_updates: true,
  }, 'Notification settings fetched');
});

router.put('/notifications', auth, async (req, res, next) => {
  return success(res, req.body, 'Notification settings updated');
});

module.exports = router;