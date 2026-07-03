const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createEscrow,
  getMyEscrows,
  getEscrowById,
  getPublicEscrow,
  confirmEscrow,
} = require('../controllers/escrowController');

router.post('/create', auth, createEscrow);
router.get('/mine', auth, getMyEscrows);
router.get('/public/:code', getPublicEscrow);
router.get('/:id', auth, getEscrowById);
router.post('/:id/confirm', auth, confirmEscrow);
router.post('/:id/virtual-account', auth, async (req, res, next) => {
  try {
    const { success } = require('../utils/response');
    const accountNumber = '920' + Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
    return success(res, {
      account_number: accountNumber,
      account_name: 'AjoBI Escrow',
      bank_name: 'Nomba MFB',
      escrow_id: req.params.id,
    }, 'Escrow virtual account ready');
  } catch (err) { next(err); }
});

module.exports = router;