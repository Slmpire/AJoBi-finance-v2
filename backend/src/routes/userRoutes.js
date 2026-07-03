const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  updateBeneficiary,
  getDashboardSummary,
  submitKYC,
  getVirtualAccount,
  createGroupVirtualAccount,
  recordGroupPayment,
} = require('../controllers/userController');

router.get('/profile', auth, getProfile);
router.patch('/profile', auth, updateProfile);
router.patch('/beneficiary', auth, updateBeneficiary);
router.get('/dashboard', auth, getDashboardSummary);
router.post('/kyc', auth, submitKYC);
router.get('/virtualaccounts', auth, getVirtualAccount);
router.post('/groupvirtualaccounts', auth, createGroupVirtualAccount);
router.post('/group_payment', auth, recordGroupPayment);

module.exports = router;