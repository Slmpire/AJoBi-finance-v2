const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const {
  getTransactions,
  getDisputedEscrows,
  releaseEscrow,
  refundEscrow,
  getUsers,
  banUser,
  unbanUser,
  getStats,
} = require('../controllers/adminController');

router.use(auth, adminOnly);

router.get('/stats', getStats);
router.get('/transactions', getTransactions);
router.get('/escrow/disputed', getDisputedEscrows);
router.post('/escrow/:id/release', releaseEscrow);
router.post('/escrow/:id/refund', refundEscrow);
router.get('/users', getUsers);
router.post('/users/:id/ban', banUser);
router.post('/users/:id/unban', unbanUser);

module.exports = router;