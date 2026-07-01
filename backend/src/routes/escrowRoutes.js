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

module.exports = router;