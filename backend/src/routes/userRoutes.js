const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  updateBeneficiary,
  getDashboardSummary,
} = require('../controllers/userController');

router.get('/profile', auth, getProfile);
router.patch('/profile', auth, updateProfile);
router.patch('/beneficiary', auth, updateBeneficiary);
router.get('/dashboard', auth, getDashboardSummary);

module.exports = router;