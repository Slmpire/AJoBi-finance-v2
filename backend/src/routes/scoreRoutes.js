const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const {
  getMyScore,
  submitOnboarding,
  uploadBankStatement,
  getScoreHistory,
  getScoreEvents,
  getEligibility,
} = require('../controllers/scoreController');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/me', auth, getMyScore);
router.post('/onboarding', auth, submitOnboarding);
router.post('/bank-statement', auth, upload.single('file'), uploadBankStatement);
router.get('/history', auth, getScoreHistory);
router.get('/events', auth, getScoreEvents);
router.get('/eligibility', auth, getEligibility);

// userId in path variants — same handler, JWT user used
router.get('/:userId/history', auth, getScoreHistory);
router.get('/:userId/events', auth, getScoreEvents);
router.get('/:userId/eligibility', auth, getEligibility);

module.exports = router;