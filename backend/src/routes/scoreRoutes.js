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

module.exports = router;