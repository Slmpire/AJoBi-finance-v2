const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createGoal,
  setupGoalPayment,
  getMyGoals,
  getGoalById,
  breakGoal,
} = require('../controllers/savingsController');

router.post('/create', auth, createGoal);
router.get('/mine', auth, getMyGoals);
router.get('/:id', auth, getGoalById);
router.post('/:id/setup-payment', auth, setupGoalPayment);
router.post('/:id/break', auth, breakGoal);

module.exports = router;