const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getProgress,
  submitStep1,
  submitStep2,
  submitStep3,
  submitStep4,
  submitStep5,
} = require('../controllers/setupController');

router.get('/progress', auth, getProgress);
router.post('/step1', auth, submitStep1);
router.post('/step2', auth, submitStep2);
router.post('/step3', auth, submitStep3);
router.post('/step4', auth, submitStep4);
router.post('/step5', auth, submitStep5);

module.exports = router;