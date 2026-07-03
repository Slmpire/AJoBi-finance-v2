const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createGoal,
  setupGoalPayment,
  getMyGoals,
  getGoalById,
  breakGoal,
  getOverview,
  getActivity,
  getAutomationRules,
} = require('../controllers/savingsController');

// Named routes MUST come before /:id
router.get('/overview', auth, getOverview);
router.get('/mine', auth, getMyGoals);
router.get('/activity', auth, getActivity);
router.get('/automation-rules', auth, getAutomationRules);
router.post('/create', auth, createGoal);

// Parameterised routes after
router.get('/:id', auth, getGoalById);
router.post('/:id/setup-payment', auth, setupGoalPayment);
router.post('/:id/setup-debit', auth, setupGoalPayment);
router.post('/:id/break', auth, breakGoal);

module.exports = router;