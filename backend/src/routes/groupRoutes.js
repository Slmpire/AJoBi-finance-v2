const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createGroup,
  joinGroup,
  getMyGroups,
  getGroupById,
  getGroupMembers,
  getGroupPayments,
  setupDebit,
  listBankCodes,
  browseGroups,
  matchGroup,
  simulatePayout,
} = require('../controllers/groupController');

router.get('/banks', auth, listBankCodes);
router.get('/browse', auth, browseGroups);
router.post('/match', auth, matchGroup);
router.get('/mine', auth, getMyGroups);
router.post('/create', auth, createGroup);
router.post('/join', auth, joinGroup);
router.get('/:id', auth, getGroupById);
router.get('/:id/members', auth, getGroupMembers);
router.get('/:id/payments', auth, getGroupPayments);
router.post('/:id/setup-debit', auth, setupDebit);
router.post('/:id/simulate-payout', auth, simulatePayout);

module.exports = router;