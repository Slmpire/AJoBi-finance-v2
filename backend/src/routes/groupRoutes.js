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
} = require('../controllers/groupController');

router.post('/create', auth, createGroup);
router.post('/join', auth, joinGroup);
router.get('/mine', auth, getMyGroups);
router.get('/:id', auth, getGroupById);
router.get('/:id/members', auth, getGroupMembers);
router.get('/:id/payments', auth, getGroupPayments);
router.post('/:id/setup-debit', auth, setupDebit);

module.exports = router;