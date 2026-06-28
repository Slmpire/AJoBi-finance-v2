const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  register,
  login,
  logout,
  getCurrentUser,
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', auth, logout);
router.get('/user', auth, getCurrentUser);

module.exports = router;