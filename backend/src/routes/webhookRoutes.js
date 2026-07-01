const express = require('express');
const router = express.Router();

// Raw body needed for signature verification — must parse before express.json()
router.use(express.raw({ type: 'application/json' }));

const { handleNomba } = require('../controllers/webhookController');

router.post('/nomba', handleNomba);

module.exports = router;