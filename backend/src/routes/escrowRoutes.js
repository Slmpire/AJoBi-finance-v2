const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createEscrow,
  getMyEscrows,
  getEscrowById,
  getPublicEscrow,
  verifyPin,
  setReceiverPassword,
  confirmEscrow,
  markPayerVerified,
  generateVirtualAccount,
} = require('../controllers/escrowController');

router.post('/create', auth, createEscrow);
router.get('/mine', auth, getMyEscrows);
router.get('/public/:code', getPublicEscrow);
router.post('/public/:code/verify-pin', verifyPin);
router.post('/public/:code/payer-verified', markPayerVerified);
router.get('/:id', auth, getEscrowById);
router.post('/:id/confirm', auth, confirmEscrow);
router.post('/:id/set-receiver-password', auth, setReceiverPassword);
router.post('/:id/virtual-account', auth, generateVirtualAccount);

module.exports = router;