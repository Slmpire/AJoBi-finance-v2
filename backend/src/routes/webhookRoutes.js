const express = require('express');
const router = express.Router();

// Raw body needed for Paystack signature verification
router.use(express.raw({ type: 'application/json' }));

const { handlePaystack } = require('../controllers/webhookController');

router.post('/paystack', handlePaystack);

module.exports = router;
